import { Search, X } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { DateRangeFilter } from './DateRangeFilter';
import { CategoryFilter } from './CategoryFilter';
import type { FilterState } from '../../types/expense';

interface FilterBarProps {
  filters: FilterState;
  categories: string[];
  onDateRangeChange: (start: Date | null, end: Date | null) => void;
  onCategoriesChange: (categories: string[]) => void;
  onSearchChange: (search: string) => void;
  onReset: () => void;
}

export function FilterBar({
  filters,
  categories,
  onDateRangeChange,
  onCategoriesChange,
  onSearchChange,
  onReset,
}: FilterBarProps) {
  const hasActiveFilters =
    filters.dateRange.start !== null ||
    filters.dateRange.end !== null ||
    filters.categories.length > 0 ||
    filters.searchTerm !== '';

  return (
    <Card>
      <CardContent className="pt-6 px-4 pb-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Filter</h3>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onReset}>
              <X className="mr-1 h-4 w-4" />
              Rensa filter
            </Button>
          )}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Sök utgifter..."
            value={filters.searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Datumintervall</p>
          <DateRangeFilter
            startDate={filters.dateRange.start}
            endDate={filters.dateRange.end}
            onDateRangeChange={onDateRangeChange}
          />
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Kategorier</p>
          <CategoryFilter
            categories={categories}
            selectedCategories={filters.categories}
            onCategoriesChange={onCategoriesChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
