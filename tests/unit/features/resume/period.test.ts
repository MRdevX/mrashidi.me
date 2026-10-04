import { describe, expect, it } from "vitest";
import { formatDuration, formatYearMonth, parsePeriod, toIsoMonth } from "@/features/resume/period";

describe("parsePeriod", () => {
  it("parses a closed period", () => {
    expect(parsePeriod("Mar 2022 – Jan 2025")).toEqual({
      start: { year: 2022, month: 3 },
      end: { year: 2025, month: 1 },
    });
  });

  it("treats Present as an open end", () => {
    expect(parsePeriod("Nov 2025 – Present")).toEqual({ start: { year: 2025, month: 11 }, end: null });
  });

  it("accepts a plain hyphen separator", () => {
    expect(parsePeriod("Oct 2015 - Sep 2018")?.end).toEqual({ year: 2018, month: 9 });
  });

  it("returns null for unparseable input", () => {
    expect(parsePeriod("2015 to 2018")).toBeNull();
    expect(parsePeriod("Foo 2015 – Sep 2018")).toBeNull();
  });
});

describe("formatDuration", () => {
  it("counts months inclusively", () => {
    expect(formatDuration({ year: 2022, month: 3 }, { year: 2025, month: 1 })).toBe("2 yrs 11 mos");
    expect(formatDuration({ year: 2021, month: 3 }, { year: 2022, month: 2 })).toBe("1 yr");
    expect(formatDuration({ year: 2025, month: 11 }, { year: 2025, month: 11 })).toBe("1 mo");
  });
});

describe("formatting helpers", () => {
  it("formats ISO months and labels", () => {
    expect(toIsoMonth({ year: 2020, month: 1 })).toBe("2020-01");
    expect(formatYearMonth({ year: 2020, month: 1 })).toBe("Jan 2020");
  });
});
