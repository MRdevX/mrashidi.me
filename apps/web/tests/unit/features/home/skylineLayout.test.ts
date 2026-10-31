import { describe, expect, it } from "vitest";
import type { ContributionDay } from "@/features/home/contributionCalendar";
import {
  barHeight,
  buildSkyline,
  SKYLINE_MAX_HEIGHT,
  SKYLINE_MIN_HEIGHT,
  SKYLINE_STEP,
  skylineCameraDistance,
} from "@/features/home/skyline/skylineLayout";

const day = (date: string, count: number): ContributionDay => ({ date, count, level: count === 0 ? 0 : 2 });

describe("barHeight", () => {
  it("gives days without contributions the minimum height", () => {
    expect(barHeight(0, 10)).toBe(SKYLINE_MIN_HEIGHT);
  });

  it("gives the busiest day the maximum height", () => {
    expect(barHeight(10, 10)).toBeCloseTo(SKYLINE_MAX_HEIGHT);
  });

  it("grows with the count", () => {
    expect(barHeight(2, 10)).toBeLessThan(barHeight(5, 10));
  });
});

describe("buildSkyline", () => {
  it("returns an empty layout for no days", () => {
    expect(buildSkyline([])).toEqual({ bars: [], width: 0, depth: 0 });
  });

  it("lays weeks along x and Monday-first weekdays along z, centred on the origin", () => {
    // 2026-01-05 is a Monday; 2026-01-12 is the next Monday.
    const { bars, width, depth } = buildSkyline([day("2026-01-12", 1), day("2026-01-05", 3), day("2026-01-11", 0)]);

    expect(width).toBe(SKYLINE_STEP);
    expect(depth).toBe(6 * SKYLINE_STEP);
    expect(bars.map((b) => b.day.date)).toEqual(["2026-01-05", "2026-01-11", "2026-01-12"]);
    expect(bars.map(({ x, z }) => [x, z])).toEqual([
      [-width / 2, -depth / 2],
      [-width / 2, depth / 2],
      [width / 2, -depth / 2],
    ]);
  });

  it("offsets a first day that is not a Monday", () => {
    // 2026-01-07 is a Wednesday.
    const { bars, depth } = buildSkyline([day("2026-01-07", 1)]);
    expect(bars[0]?.z).toBe(2 * SKYLINE_STEP - depth / 2);
  });

  it("keeps later days in place when a day is missing", () => {
    const { bars } = buildSkyline([day("2026-01-05", 1), day("2026-01-07", 1)]);
    expect(bars[1]?.z).toBe((bars[0]?.z ?? 0) + 2 * SKYLINE_STEP);
  });
});

describe("skylineCameraDistance", () => {
  const year = { bars: [], width: 52 * SKYLINE_STEP, depth: 6 * SKYLINE_STEP };

  it("moves the camera closer on a wider canvas", () => {
    expect(skylineCameraDistance(year, 4)).toBeLessThan(skylineCameraDistance(year, 3));
  });

  it("frames a short history by height, not width", () => {
    const fewWeeks = { bars: [], width: 2 * SKYLINE_STEP, depth: 6 * SKYLINE_STEP };
    expect(skylineCameraDistance(fewWeeks, 4)).toBe(skylineCameraDistance(fewWeeks, 8));
  });
});
