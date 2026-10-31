import { InvalidContentError } from "#shared/invalid-content-error.ts";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

export interface YearMonth {
  year: number;
  month: number;
}

export interface WorkPeriod {
  start: YearMonth;
  end: YearMonth | null;
}

export class InvalidWorkPeriodError extends InvalidContentError {
  constructor(period: string) {
    super(`Unreadable work period "${period}"`);
    this.name = "InvalidWorkPeriodError";
  }
}

function parseYearMonth(value: string, period: string): YearMonth {
  const [name, year] = value.split(" ");
  const month = MONTHS.indexOf(name as (typeof MONTHS)[number]) + 1;
  if (month === 0 || !/^\d{4}$/.test(year ?? "")) {
    throw new InvalidWorkPeriodError(period);
  }
  return { year: Number(year), month };
}

export function parseWorkPeriod(period: string): WorkPeriod {
  const parts = period.split(" – ");
  if (parts.length !== 2) {
    throw new InvalidWorkPeriodError(period);
  }
  const [from, to] = parts;
  return {
    start: parseYearMonth(from, period),
    end: to === "Present" ? null : parseYearMonth(to, period),
  };
}

export function yearMonthOf(date: Date): YearMonth {
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1 };
}

export function durationMonths({ start, end }: WorkPeriod, now: YearMonth): number {
  const until = end ?? now;
  return Math.max(1, (until.year - start.year) * 12 + (until.month - start.month) + 1);
}

export function toIsoMonth({ year, month }: YearMonth): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}
