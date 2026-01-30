import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import type { CategorySummary } from '../../types/expense';
import { formatCurrency } from '../../lib/expense-utils';

interface CategorySummaryTableProps {
  summaries: CategorySummary[];
  monthCount: number;
}

export function CategorySummaryTable({ summaries, monthCount }: CategorySummaryTableProps) {
  if (summaries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Kategoriöversikt</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">Ingen data att visa</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kategoriöversikt</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Kategori</th>
                <th className="px-4 py-3 text-right">Antal</th>
                <th className="px-4 py-3 text-right">Totalt</th>
                <th className="px-4 py-3 text-right">Snitt/mån</th>
                <th className="px-4 py-3 text-right">%</th>
              </tr>
            </thead>
            <tbody>
              {summaries.map((summary, idx) => (
                <tr
                  key={summary.category}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-4 py-3 font-medium">{summary.category}</td>
                  <td className="px-4 py-3 text-right">{summary.count}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(summary.total)}</td>
                  <td className="px-4 py-3 text-right">
                    {formatCurrency(monthCount > 0 ? summary.total / monthCount : 0)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {summary.percentage.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
