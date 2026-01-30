import { useState, useMemo, useCallback } from 'react';
import type { Expense, FilterState } from '../types/expense';
import { filterExpenses } from '../lib/expense-utils';

const initialFilters: FilterState = {
  dateRange: { start: null, end: null },
  categories: [],
  searchTerm: '',
};

export function useFilters(expenses: Expense[]) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const filteredExpenses = useMemo(() => {
    return filterExpenses(expenses, filters);
  }, [expenses, filters]);

  const setDateRange = useCallback((start: Date | null, end: Date | null) => {
    setFilters(prev => ({
      ...prev,
      dateRange: { start, end },
    }));
  }, []);

  const setCategories = useCallback((categories: string[]) => {
    setFilters(prev => ({
      ...prev,
      categories,
    }));
  }, []);

  const setSearchTerm = useCallback((searchTerm: string) => {
    setFilters(prev => ({
      ...prev,
      searchTerm,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  return {
    filters,
    filteredExpenses,
    setDateRange,
    setCategories,
    setSearchTerm,
    resetFilters,
  };
}
