export interface ContributionWindow {
  from: string;
  to: string;
}

const toDay = (date: Date) => date.toISOString().slice(0, 10);

export function contributionWindow(now: Date): ContributionWindow {
  const from = new Date(now);
  from.setUTCFullYear(from.getUTCFullYear() - 1);
  from.setUTCDate(from.getUTCDate() + 1);
  const daysUntilMonday = (1 - from.getUTCDay() + 7) % 7;
  from.setUTCDate(from.getUTCDate() + daysUntilMonday);
  return { from: `${toDay(from)}T00:00:00Z`, to: `${toDay(now)}T23:59:59Z` };
}
