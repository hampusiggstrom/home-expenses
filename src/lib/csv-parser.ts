import Papa from 'papaparse';
import type { Expense, PersonShare, StoredExpense } from '../types/expense';
import { SUBCATEGORY_KEYWORDS } from '../constants/categories';

// Column name mappings for different languages
const COLUMN_MAPPINGS: Record<string, string> = {
  // Swedish
  'Datum': 'Date',
  'Beskrivning': 'Description',
  'Kategori': 'Category',
  'Kostnad': 'Cost',
  'Valuta': 'Currency',
  // English (already correct)
  'Date': 'Date',
  'Description': 'Description',
  'Category': 'Category',
  'Cost': 'Cost',
  'Currency': 'Currency',
};

interface NormalizedRow {
  Date: string;
  Description: string;
  Category: string;
  Cost: string;
  Currency: string;
  [key: string]: string;
}

function normalizeRow(row: Record<string, string>): NormalizedRow {
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(row)) {
    const mappedKey = COLUMN_MAPPINGS[key] || key;
    normalized[mappedKey] = value;
  }
  return normalized as NormalizedRow;
}

function parseNumber(value: string): number {
  if (!value || value.trim() === '') return 0;
  // Handle European decimal separator (comma) and thousand separator (space or period)
  const normalized = value
    .replace(/\s/g, '')
    .replace(/\.(?=\d{3})/g, '') // Remove thousand separators
    .replace(',', '.'); // Convert European decimal separator
  const num = parseFloat(normalized);
  return isNaN(num) ? 0 : num;
}

function inferSubcategory(description: string): string | null {
  const lowerDesc = description.toLowerCase();
  for (const [subcategory, keywords] of Object.entries(SUBCATEGORY_KEYWORDS)) {
    if (keywords.some(keyword => lowerDesc.includes(keyword))) {
      return subcategory;
    }
  }
  return null;
}

function parseDate(dateStr: string): Date {
  // Splitwise uses YYYY-MM-DD format
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function extractShares(row: NormalizedRow): PersonShare[] {
  const shares: PersonShare[] = [];
  const excludedColumns = ['Date', 'Description', 'Category', 'Cost', 'Currency',
    'Datum', 'Beskrivning', 'Kategori', 'Kostnad', 'Valuta'];

  for (const [key, value] of Object.entries(row)) {
    if (!excludedColumns.includes(key) && key.trim() !== '' && !COLUMN_MAPPINGS[key]) {
      const amount = parseNumber(value);
      if (amount !== 0) {
        shares.push({
          name: key,
          paid: amount > 0 ? amount : 0,
          owes: amount < 0 ? Math.abs(amount) : 0,
        });
      }
    }
  }

  return shares;
}

export function parseCsv(file: File): Promise<Expense[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const expenses: Expense[] = results.data
            .map(row => normalizeRow(row))
            .filter(row => row.Date && row.Description && row.Cost)
            .filter(row => row.Description.toLowerCase() !== 'totalsumma')
            .filter(row => row.Category.toLowerCase() !== 'betalning')
            .map((row, index) => ({
              id: `${Date.now()}-${index}`,
              date: parseDate(row.Date),
              description: row.Description,
              category: row.Category || 'Uncategorized',
              subcategory: inferSubcategory(row.Description),
              cost: parseNumber(row.Cost),
              currency: row.Currency || 'SEK',
              shares: extractShares(row),
            }));
          resolve(expenses);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

export function expenseToStored(expense: Expense): StoredExpense {
  return {
    ...expense,
    date: expense.date.toISOString(),
  };
}

export function storedToExpense(stored: StoredExpense): Expense {
  return {
    ...stored,
    date: new Date(stored.date),
  };
}
