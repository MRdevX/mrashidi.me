export type Level = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type ContributionDay = {
  date: string; // "YYYY-MM-DD"
  count: number;
  level: Level;
};

export type ContributionsResponse = {
  contributions: ContributionDay[];
  total: number;
};

export type CalendarData = {
  weeks: (ContributionDay | null)[][];
  monthLabels: { weekIndex: number; label: string }[];
};

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function buildCalendar(days: ContributionDay[]): CalendarData {
  if (days.length === 0) {
    return { weeks: [], monthLabels: [] };
  }

  // Parse at noon local time to avoid UTC off-by-one shifts on any timezone.
  // Monday-first weeks: Mon=0, Tue=1, …, Sun=6
  const startPad = (new Date(`${days[0].date}T12:00:00`).getDay() + 6) % 7;
  const padded: (ContributionDay | null)[] = [...Array<null>(startPad).fill(null), ...days];

  const weeks: (ContributionDay | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    const week = padded.slice(i, i + 7);
    while (week.length < 7) {
      week.push(null);
    }
    weeks.push(week);
  }

  const monthLabels: { weekIndex: number; label: string }[] = [];
  let lastMonth = -1;
  for (let wi = 0; wi < weeks.length; wi++) {
    const first = weeks[wi].find(Boolean);
    if (!first) {
      continue;
    }
    const month = new Date(`${first.date}T12:00:00`).getMonth();
    if (month !== lastMonth) {
      monthLabels.push({ weekIndex: wi, label: MONTH_NAMES[month] ?? "" });
      lastMonth = month;
    }
  }

  return { weeks, monthLabels };
}

export function formatContributionDate(s: string): string {
  return new Date(`${s}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatContributionCount(count: number): string {
  if (count === 0) {
    return "No contributions";
  }
  return count === 1 ? "1 contribution" : `${count} contributions`;
}

export function computeDynamicLevels(days: ContributionDay[]): ContributionDay[] {
  const nonZero = days
    .map((d) => d.count)
    .filter((c) => c > 0)
    .sort((a, b) => a - b);

  if (nonZero.length === 0) {
    return days;
  }

  const pct = (p: number): number => {
    const idx = Math.min(Math.floor(p * nonZero.length), nonZero.length - 1);
    return nonZero[idx] ?? 1;
  };

  const thresholds = [pct(0.25), pct(0.5), pct(0.7), pct(0.85), pct(0.95)];

  return days.map((d): ContributionDay => {
    if (d.count === 0) {
      return { ...d, level: 0 };
    }
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (d.count > (thresholds[i] ?? 0)) {
        return { ...d, level: (i + 2) as Level };
      }
    }
    return { ...d, level: 1 };
  });
}
