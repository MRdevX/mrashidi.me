import { describe, expect, it } from "vitest";
import {
  buildCalendar,
  type ContributionDay,
  computeDynamicLevels,
  formatContributionCount,
} from "@/features/home/contributionCalendar";

const day = (date: string, count: number): ContributionDay => ({ date, count, level: 0 });

const consecutiveDays = (start: string, counts: number[]): ContributionDay[] =>
  counts.map((count, i) => {
    const date = new Date(`${start}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() + i);
    return day(date.toISOString().slice(0, 10), count);
  });

describe("buildCalendar", () => {
  it("pads the first week so weeks start on Monday", () => {
    const { weeks } = buildCalendar([day("2026-10-14", 1)]);
    expect(weeks).toHaveLength(1);
    expect(weeks[0]).toHaveLength(7);
    expect(weeks[0][0]).toBeNull();
    expect(weeks[0][2]?.date).toBe("2026-10-14");
  });

  it("labels the first week of each month", () => {
    const { monthLabels } = buildCalendar(consecutiveDays("2026-09-28", Array(14).fill(1)));
    expect(monthLabels.map((m) => m.label)).toEqual(["Sep", "Oct"]);
  });

  it("returns nothing for no days", () => {
    expect(buildCalendar([])).toEqual({ weeks: [], monthLabels: [] });
  });
});

describe("computeDynamicLevels", () => {
  it("keeps empty days at level 0 and gives the busiest day the top level", () => {
    const counts = [0, ...Array.from({ length: 20 }, (_, i) => i + 1), 100];
    const days = consecutiveDays("2026-01-05", counts);
    const levels = computeDynamicLevels(days).map((d) => d.level);
    expect(levels[0]).toBe(0);
    expect(levels.at(-1)).toBe(6);
    expect(levels.slice(1).every((level) => level >= 1)).toBe(true);
  });
});

describe("formatContributionCount", () => {
  it("pluralises the count", () => {
    expect(formatContributionCount(0)).toBe("No contributions");
    expect(formatContributionCount(1)).toBe("1 contribution");
    expect(formatContributionCount(3)).toBe("3 contributions");
  });
});
