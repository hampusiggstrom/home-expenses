import { useCallback, useMemo } from 'react';
import type { Expense, StoredExpense } from '../types/expense';
import { useLocalStorage } from './useLocalStorage';
import { expenseToStored, storedToExpense } from '../lib/csv-parser';

const STORAGE_KEY = 'home-expenses-data';

export function useExpenses() {
  const [storedExpenses, setStoredExpenses] = useLocalStorage<StoredExpense[]>(STORAGE_KEY, []);

  const expenses = useMemo(() => {
    return storedExpenses.map(storedToExpense);
  }, [storedExpenses]);

  const importExpenses = useCallback((newExpenses: Expense[]) => {
    setStoredExpenses(prev => {
      const existingIds = new Set(prev.map(e => e.id));
      const uniqueNew = newExpenses.filter(e => !existingIds.has(e.id));
      return [...prev, ...uniqueNew.map(expenseToStored)];
    });
  }, [setStoredExpenses]);

  const clearExpenses = useCallback(() => {
    setStoredExpenses([]);
  }, [setStoredExpenses]);

  const deleteExpense = useCallback((id: string) => {
    setStoredExpenses(prev => prev.filter(e => e.id !== id));
  }, [setStoredExpenses]);

  return {
    expenses,
    importExpenses,
    clearExpenses,
    deleteExpense,
    hasData: expenses.length > 0,
  };
}
