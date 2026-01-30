import { format, startOfMonth } from 'date-fns';
import type { Expense, CategorySummary, MonthlyTotal, FilterState } from '../types/expense';
import { getAllMonthsBetween } from './date-utils';
import { CATEGORY_TO_GROUP, CATEGORY_GROUP_COLORS, EXCLUDED_CATEGORIES } from '../constants/categories';

export function filterExpenses(expenses: Expense[], filters: FilterState): Expense[] {
  return expenses.filter(expense => {
    // Date range filter
    if (filters.dateRange.start && expense.date < filters.dateRange.start) {
      return false;
    }
    if (filters.dateRange.end && expense.date > filters.dateRange.end) {
      return false;
    }

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(expense.category)) {
      return false;
    }

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesDescription = expense.description.toLowerCase().includes(searchLower);
      const matchesCategory = expense.category.toLowerCase().includes(searchLower);
      const matchesSubcategory = expense.subcategory?.toLowerCase().includes(searchLower);
      if (!matchesDescription && !matchesCategory && !matchesSubcategory) {
        return false;
      }
    }

    return true;
  });
}

export function calculateCategorySummaries(expenses: Expense[]): CategorySummary[] {
  const categoryMap = new Map<string, { total: number; count: number }>();

  expenses.forEach(expense => {
    const existing = categoryMap.get(expense.category) || { total: 0, count: 0 };
    categoryMap.set(expense.category, {
      total: existing.total + expense.cost,
      count: existing.count + 1,
    });
  });

  const totalSpending = expenses.reduce((sum, exp) => sum + exp.cost, 0);

  return Array.from(categoryMap.entries())
    .map(([category, data]) => ({
      category,
      total: data.total,
      count: data.count,
      percentage: totalSpending > 0 ? (data.total / totalSpending) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);
}

export function calculateMonthlyTotals(expenses: Expense[]): MonthlyTotal[] {
  if (expenses.length === 0) return [];

  // Find min and max dates
  const dateRange = getDateRange(expenses);
  if (!dateRange.min || !dateRange.max) return [];

  // Get all months between min and max
  const allMonths = getAllMonthsBetween(dateRange.min, dateRange.max);

  // Calculate totals for each month
  const monthMap = new Map<string, number>();

  // Initialize all months with 0
  allMonths.forEach(month => {
    monthMap.set(format(month, 'yyyy-MM'), 0);
  });

  // Add expense totals
  expenses.forEach(expense => {
    const monthKey = format(startOfMonth(expense.date), 'yyyy-MM');
    const existing = monthMap.get(monthKey) || 0;
    monthMap.set(monthKey, existing + expense.cost);
  });

  return allMonths.map(month => ({
    month: format(month, 'MMM yyyy'),
    total: monthMap.get(format(month, 'yyyy-MM')) || 0,
    date: month,
  }));
}

export function calculateTotalSpending(expenses: Expense[]): number {
  return expenses.reduce((sum, expense) => sum + expense.cost, 0);
}

export function calculateMonthlyAverage(expenses: Expense[]): number {
  const monthlyTotals = calculateMonthlyTotals(expenses);
  if (monthlyTotals.length === 0) return 0;
  const total = monthlyTotals.reduce((sum, month) => sum + month.total, 0);
  return total / monthlyTotals.length;
}

export function getDateRange(expenses: Expense[]): { min: Date | null; max: Date | null } {
  if (expenses.length === 0) return { min: null, max: null };

  let min = expenses[0].date;
  let max = expenses[0].date;

  expenses.forEach(expense => {
    if (expense.date < min) min = expense.date;
    if (expense.date > max) max = expense.date;
  });

  return { min, max };
}

export function formatCurrency(amount: number, currency: string = 'SEK'): string {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getUniqueCategories(expenses: Expense[]): string[] {
  const categories = new Set(expenses.map(e => e.category).filter(c => c && c.trim()));
  return Array.from(categories).sort();
}

export function isExcludedCategory(category: string): boolean {
  return (EXCLUDED_CATEGORIES as readonly string[]).includes(category);
}

export function getCategoryGroup(category: string): string {
  return CATEGORY_TO_GROUP[category] || 'Övrigt';
}

export function getCategoryGroupColor(group: string): string {
  return CATEGORY_GROUP_COLORS[group] || '#64748b';
}

export interface GroupedCategorySummary {
  group: string;
  total: number;
  count: number;
  percentage: number;
  color: string;
  categories: string[];
}

export function calculateGroupedCategorySummaries(expenses: Expense[]): GroupedCategorySummary[] {
  // Filter out excluded categories
  const filteredExpenses = expenses.filter(e => !isExcludedCategory(e.category));

  const groupMap = new Map<string, { total: number; count: number; categories: Set<string> }>();

  filteredExpenses.forEach(expense => {
    const group = getCategoryGroup(expense.category);
    const existing = groupMap.get(group) || { total: 0, count: 0, categories: new Set<string>() };
    existing.total += expense.cost;
    existing.count += 1;
    existing.categories.add(expense.category);
    groupMap.set(group, existing);
  });

  const totalSpending = filteredExpenses.reduce((sum, exp) => sum + exp.cost, 0);

  return Array.from(groupMap.entries())
    .map(([group, data]) => ({
      group,
      total: data.total,
      count: data.count,
      percentage: totalSpending > 0 ? (data.total / totalSpending) * 100 : 0,
      color: getCategoryGroupColor(group),
      categories: Array.from(data.categories).sort(),
    }))
    .sort((a, b) => b.total - a.total);
}
