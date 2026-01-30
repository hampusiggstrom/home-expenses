import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { getPresetDateRanges, formatDate } from '../../lib/date-utils';

interface DateRangeFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateRangeChange: (start: Date | null, end: Date | null) => void;
}

export function DateRangeFilter({ startDate, endDate, onDateRangeChange }: DateRangeFilterProps) {
  const presets = getPresetDateRanges();

  const isPresetActive = (preset: { start: Date | null; end: Date | null }): boolean => {
    // For "All Time" preset: both dates are null
    if (preset.start === null && preset.end === null) {
      return startDate === null && endDate === null;
    }
    // For other presets: compare formatted dates to avoid timezone issues
    if (startDate === null || endDate === null || preset.start === null || preset.end === null) {
      return false;
    }
    return formatDate(startDate) === formatDate(preset.start) && formatDate(endDate) === formatDate(preset.end);
  };

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onDateRangeChange(value ? new Date(value) : null, endDate);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onDateRangeChange(startDate, value ? new Date(value) : null);
  };

  const handlePresetClick = (preset: { start: Date | null; end: Date | null }) => {
    onDateRangeChange(preset.start, preset.end);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {Object.entries(presets).map(([key, preset]) => (
          <Button
            key={key}
            variant={isPresetActive(preset) ? 'default' : 'outline'}
            size="sm"
            onClick={() => handlePresetClick(preset)}
            className="text-xs"
          >
            {preset.label}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="w-40">
          <Input
            type="date"
            value={startDate ? formatDate(startDate) : ''}
            onChange={handleStartChange}
          />
        </div>
        <span className="text-muted-foreground">till</span>
        <div className="w-40">
          <Input
            type="date"
            value={endDate ? formatDate(endDate) : ''}
            onChange={handleEndChange}
          />
        </div>
      </div>
    </div>
  );
}
