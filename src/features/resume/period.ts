const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

export interface YearMonth {
  year: number;
  /** 1–12 */
  month: number;
}

export interface ParsedPeriod {
  start: YearMonth;
  /** `null` while the role is ongoing ("Present"). */
  end: YearMonth | null;
}

function parseYearMonth(value: string): YearMonth | null {
  const match = /^([A-Za-z]{3})\w*\s+(\d{4})$/.exec(value.trim());
  if (!match) {
    return null;
  }
  const monthIndex = MONTHS.findIndex((m) => m.toLowerCase() === match[1].toLowerCase());
  return monthIndex === -1 ? null : { year: Number(match[2]), month: monthIndex + 1 };
}

/** Parses "Mar 2022 – Jan 2025" / "Nov 2025 – Present"; returns `null` for anything else. */
export function parsePeriod(period: string): ParsedPeriod | null {
  const parts = period.split(/\s+[–—-]\s+/);
  if (parts.length !== 2) {
    return null;
  }
  const start = parseYearMonth(parts[0]);
  if (!start) {
    return null;
  }
  if (/^present$/i.test(parts[1].trim())) {
    return { start, end: null };
  }
  const end = parseYearMonth(parts[1]);
  return end ? { start, end } : null;
}

/** `YYYY-MM`, valid for `<time dateTime>`. */
export function toIsoMonth({ year, month }: YearMonth): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function formatYearMonth({ year, month }: YearMonth): string {
  return `${MONTHS[month - 1]} ${year}`;
}

/** Inclusive month count ("Mar–Mar" is one month), formatted like "2 yrs 11 mos". */
export function formatDuration(start: YearMonth, end: YearMonth): string {
  const totalMonths = Math.max(1, (end.year - start.year) * 12 + (end.month - start.month) + 1);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts: string[] = [];
  if (years > 0) {
    parts.push(`${years} ${years === 1 ? "yr" : "yrs"}`);
  }
  if (months > 0) {
    parts.push(`${months} ${months === 1 ? "mo" : "mos"}`);
  }
  return parts.join(" ");
}
