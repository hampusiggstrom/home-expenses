import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import type { CategorySummary } from '../../types/expense';
import { formatCurrency } from '../../lib/expense-utils';

interface CategoryPieChartProps {
  data: CategorySummary[];
}

const COLORS = [
  '#3b82f6',
  '#22c55e',
  '#f97316',
  '#a855f7',
  '#ec4899',
  '#06b6d4',
  '#eab308',
  '#64748b',
  '#ef4444',
  '#84cc16',
  '#14b8a6',
  '#f43f5e',
];

const MAX_CATEGORIES = 8;

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Utgifter per kategori</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">Ingen data att visa</p>
        </CardContent>
      </Card>
    );
  }

  // Group smaller categories into "Övriga" if there are too many
  let chartData: { name: string; value: number; color: string; percentage: number }[];
  const totalSpending = data.reduce((sum, cat) => sum + cat.total, 0);

  if (data.length > MAX_CATEGORIES) {
    const topCategories = data.slice(0, MAX_CATEGORIES - 1);
    const otherCategories = data.slice(MAX_CATEGORIES - 1);
    const otherTotal = otherCategories.reduce((sum, cat) => sum + cat.total, 0);

    chartData = [
      ...topCategories.map((item, index) => ({
        name: item.category,
        value: item.total,
        color: COLORS[index % COLORS.length],
        percentage: totalSpending > 0 ? (item.total / totalSpending) * 100 : 0,
      })),
      {
        name: `Övriga (${otherCategories.length})`,
        value: otherTotal,
        color: '#94a3b8',
        percentage: totalSpending > 0 ? (otherTotal / totalSpending) * 100 : 0,
      },
    ];
  } else {
    chartData = data.map((item, index) => ({
      name: item.category,
      value: item.total,
      color: COLORS[index % COLORS.length],
      percentage: item.percentage,
    }));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Utgifter per kategori</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 flex">
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, _name, props) => [
                    formatCurrency(value as number),
                    `${props.payload.name} (${props.payload.percentage.toFixed(1)}%)`,
                  ]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-40 flex flex-col justify-center gap-1 text-xs">
            {chartData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="truncate" title={entry.name}>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
