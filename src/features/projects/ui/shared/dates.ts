import { format, formatDistanceToNow, parseISO } from "date-fns";

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "MMMM d, yyyy");
}

export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}
