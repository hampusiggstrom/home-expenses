import { format, startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear, addMonths } from 'date-fns';

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatDisplayDate(date: Date): string {
  return format(date, 'MMM d, yyyy');
}

export function getPresetDateRanges() {
  const now = new Date();

  return {
    thisMonth: {
      start: startOfMonth(now),
      end: endOfMonth(now),
      label: 'Denna månad',
    },
    lastMonth: {
      start: startOfMonth(subMonths(now, 1)),
      end: endOfMonth(subMonths(now, 1)),
      label: 'Förra månaden',
    },
    last3Months: {
      start: startOfMonth(subMonths(now, 2)),
      end: endOfMonth(now),
      label: 'Senaste 3 mån',
    },
    last6Months: {
      start: startOfMonth(subMonths(now, 5)),
      end: endOfMonth(now),
      label: 'Senaste 6 mån',
    },
    last12Months: {
      start: startOfMonth(subMonths(now, 11)),
      end: endOfMonth(now),
      label: 'Senaste 12 mån',
    },
    thisYear: {
      start: startOfYear(now),
      end: endOfYear(now),
      label: 'I år',
    },
    all: {
      start: null,
      end: null,
      label: 'All tid',
    },
  };
}

export function getAllMonthsBetween(startDate: Date, endDate: Date): Date[] {
  const months: Date[] = [];
  let current = startOfMonth(startDate);
  const end = startOfMonth(endDate);

  while (current <= end) {
    months.push(current);
    current = addMonths(current, 1);
  }

  return months;
}
