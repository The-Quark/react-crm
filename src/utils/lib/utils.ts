import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DateRange } from 'react-day-picker';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  dateString: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
): string {
  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

export const filterDateRange = (rowDate: string, filterValue: DateRange) => {
  if (!filterValue) return true;

  const date = new Date(rowDate);
  const { from, to } = filterValue;

  if (from && to) {
    return date >= from && date <= to;
  }
  if (from) {
    return date >= from;
  }
  if (to) {
    return date <= to;
  }
  return true;
};
