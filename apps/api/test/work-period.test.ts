import { describe, expect, it } from "vitest";
import {
  durationMonths,
  InvalidWorkPeriodError,
  parseWorkPeriod,
  toIsoMonth,
} from "../src/modules/resume/domain/work-period.ts";

const now = { year: 2026, month: 10 };

describe("work period", () => {
  it("parses a closed period", () => {
    expect(parseWorkPeriod("Mar 2022 – Jan 2025")).toEqual({
      start: { year: 2022, month: 3 },
      end: { year: 2025, month: 1 },
    });
  });

  it("treats Present as an open end", () => {
    expect(parseWorkPeriod("Nov 2025 – Present")).toEqual({ start: { year: 2025, month: 11 }, end: null });
  });

  it("rejects an unknown month", () => {
    expect(() => parseWorkPeriod("Foo 2015 – Sep 2018")).toThrow(InvalidWorkPeriodError);
  });

  it("counts months inclusively", () => {
    expect(durationMonths(parseWorkPeriod("Mar 2022 – Jan 2025"), now)).toBe(35);
    expect(durationMonths(parseWorkPeriod("Mar 2021 – Feb 2022"), now)).toBe(12);
    expect(durationMonths(parseWorkPeriod("Nov 2025 – Nov 2025"), now)).toBe(1);
  });

  it("counts an ongoing role up to the current month", () => {
    expect(durationMonths(parseWorkPeriod("Nov 2025 – Present"), now)).toBe(12);
  });

  it("formats ISO months", () => {
    expect(toIsoMonth({ year: 2020, month: 1 })).toBe("2020-01");
  });
});
