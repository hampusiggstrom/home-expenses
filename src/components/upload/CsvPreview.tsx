import { useMemo } from 'react';
import { Check, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import type { Expense } from '../../types/expense';
import { formatCurrency, calculateTotalSpending, getDateRange, getUniqueCategories } from '../../lib/expense-utils';
import { formatDisplayDate } from '../../lib/date-utils';

interface CsvPreviewProps {
  expenses: Expense[];
  onConfirm: () => void;
  onCancel: () => void;
}

export function CsvPreview({ expenses, onConfirm, onCancel }: CsvPreviewProps) {
  const summary = useMemo(() => {
    const total = calculateTotalSpending(expenses);
    const dateRange = getDateRange(expenses);
    const categories = getUniqueCategories(expenses);

    return { total, dateRange, categories };
  }, [expenses]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Förhandsvisning av import</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Utgifter</p>
              <p className="text-2xl font-bold">{expenses.length}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Totalt</p>
              <p className="text-2xl font-bold">{formatCurrency(summary.total)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Datumintervall</p>
              <p className="text-sm font-medium">
                {summary.dateRange.min && summary.dateRange.max ? (
                  <>
                    {formatDisplayDate(summary.dateRange.min)} -{' '}
                    {formatDisplayDate(summary.dateRange.max)}
                  </>
                ) : (
                  'Ej tillgängligt'
                )}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Kategorier</p>
              <p className="text-2xl font-bold">{summary.categories.length}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Exempelutgifter:</p>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Datum</th>
                    <th className="px-4 py-2 text-left">Beskrivning</th>
                    <th className="px-4 py-2 text-left">Kategori</th>
                    <th className="px-4 py-2 text-right">Kostnad</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.slice(0, 5).map((expense, idx) => (
                    <tr key={expense.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2">{formatDisplayDate(expense.date)}</td>
                      <td className="px-4 py-2">{expense.description}</td>
                      <td className="px-4 py-2">{expense.category}</td>
                      <td className="px-4 py-2 text-right">{formatCurrency(expense.cost, expense.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {expenses.length > 5 && (
              <p className="text-xs text-muted-foreground mt-2">
                ...och {expenses.length - 5} fler utgifter
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Avbryt
        </Button>
        <Button onClick={onConfirm}>
          <Check className="mr-2 h-4 w-4" />
          Importera {expenses.length} utgifter
        </Button>
      </CardFooter>
    </Card>
  );
}
