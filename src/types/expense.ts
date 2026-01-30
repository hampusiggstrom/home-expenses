export interface PersonShare {
  name: string;
  paid: number;
  owes: number;
}

export interface Expense {
  id: string;
  date: Date;
  description: string;
  category: string;
  subcategory: string | null;
  cost: number;
  currency: string;
  shares: PersonShare[];
}

export interface StoredExpense {
  id: string;
  date: string; // ISO string for localStorage
  description: string;
  category: string;
  subcategory: string | null;
  cost: number;
  currency: string;
  shares: PersonShare[];
}

export interface FilterState {
  dateRange: { start: Date | null; end: Date | null };
  categories: string[];
  searchTerm: string;
}

export interface CategorySummary {
  category: string;
  total: number;
  count: number;
  percentage: number;
}

export interface MonthlyTotal {
  month: string;
  total: number;
  date: Date;
}
