import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

/**
 * Formats a date relative to current time
 */
export function formatMessageDate(date: string | Date): string {
  const messageDate = typeof date === 'string' ? new Date(date) : date;
  
  if (isToday(messageDate)) {
    return format(messageDate, 'h:mm a');
  } else if (isYesterday(messageDate)) {
    return 'Yesterday, ' + format(messageDate, 'h:mm a');
  } else if (new Date().getFullYear() === messageDate.getFullYear()) {
    return format(messageDate, 'MMM d, h:mm a');
  } else {
    return format(messageDate, 'MMM d, yyyy h:mm a');
  }
}

/**
 * Returns a relative time string like "2 minutes ago" 
 */
export function formatRelativeTime(date: string | Date): string {
  const messageDate = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(messageDate, { addSuffix: true });
}