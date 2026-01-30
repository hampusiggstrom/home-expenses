import { DollarSign, TrendingUp, Tag, Calendar } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { formatCurrency } from '../../lib/expense-utils';

interface SummaryCardsProps {
  totalSpending: number;
  monthlyAverage: number;
  topCategory: { name: string; amount: number } | null;
  expenseCount: number;
}

export function SummaryCards({ totalSpending, monthlyAverage, topCategory, expenseCount }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Totala utgifter',
      value: formatCurrency(totalSpending),
      icon: DollarSign,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      title: 'Månadssnitt',
      value: formatCurrency(monthlyAverage),
      icon: TrendingUp,
      color: 'text-green-600 bg-green-100',
    },
    {
      title: 'Största kategori',
      value: topCategory?.name || 'Ej tillgängligt',
      subtitle: topCategory ? formatCurrency(topCategory.amount) : undefined,
      icon: Tag,
      color: 'text-purple-600 bg-purple-100',
    },
    {
      title: 'Antal utgifter',
      value: expenseCount.toString(),
      icon: Calendar,
      color: 'text-orange-600 bg-orange-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent className="p-6 pt-6">
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                WebkitBoxAlign: 'center',
              }}
            >
              <div
                className={`rounded-full shrink-0 ${card.color}`}
                style={{
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  WebkitBoxAlign: 'center',
                  WebkitBoxPack: 'center',
                }}
              >
                <card.icon className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground" style={{ margin: 0 }}>{card.title}</p>
                <p className="text-xl font-bold truncate" style={{ margin: 0 }} title={card.value}>{card.value}</p>
                {card.subtitle && (
                  <p className="text-sm text-muted-foreground" style={{ margin: 0 }}>{card.subtitle}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
