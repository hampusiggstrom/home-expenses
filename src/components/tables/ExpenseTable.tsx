import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import type { Expense } from '../../types/expense';
import { formatCurrency } from '../../lib/expense-utils';
import { formatDisplayDate } from '../../lib/date-utils';

type SortField = 'date' | 'description' | 'category' | 'cost';
type SortDirection = 'asc' | 'desc';

interface ExpenseTableProps {
  expenses: Expense[];
  onDeleteExpense?: (id: string) => void;
}

const PAGE_SIZE = 10;

export function ExpenseTable({ expenses, onDeleteExpense }: ExpenseTableProps) {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(0);

  const sortedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'date':
          comparison = a.date.getTime() - b.date.getTime();
          break;
        case 'description':
          comparison = a.description.localeCompare(b.description);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'cost':
          comparison = a.cost - b.cost;
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [expenses, sortField, sortDirection]);

  const paginatedExpenses = useMemo(() => {
    const start = currentPage * PAGE_SIZE;
    return sortedExpenses.slice(start, start + PAGE_SIZE);
  }, [sortedExpenses, currentPage]);

  const totalPages = Math.ceil(expenses.length / PAGE_SIZE);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(0);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4 inline ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 inline ml-1" />
    );
  };

  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Utgifter</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">Inga utgifter att visa</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Utgifter ({expenses.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('date')}
                >
                  Datum <SortIcon field="date" />
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('description')}
                >
                  Beskrivning <SortIcon field="description" />
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('category')}
                >
                  Kategori <SortIcon field="category" />
                </th>
                <th
                  className="px-4 py-3 text-right cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('cost')}
                >
                  Kostnad <SortIcon field="cost" />
                </th>
                {onDeleteExpense && <th className="px-4 py-3 w-10"></th>}
              </tr>
            </thead>
            <tbody>
              {paginatedExpenses.map((expense, idx) => (
                <tr
                  key={expense.id}
                  className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}
                >
                  <td className="px-4 py-3">{formatDisplayDate(expense.date)}</td>
                  <td className="px-4 py-3">{expense.description}</td>
                  <td className="px-4 py-3">{expense.category}</td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatCurrency(expense.cost, expense.currency)}
                  </td>
                  {onDeleteExpense && (
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onDeleteExpense(expense.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Visar {currentPage * PAGE_SIZE + 1} till{' '}
              {Math.min((currentPage + 1) * PAGE_SIZE, expenses.length)} av {expenses.length}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
              >
                Föregående
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
              >
                Nästa
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
