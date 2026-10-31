import type { ContributionDay } from "../contributionCalendar";

export type SkylineBar = {
  day: ContributionDay;
  x: number;
  z: number;
  height: number;
};

export type SkylineLayout = {
  bars: SkylineBar[];
  width: number;
  depth: number;
};

export const SKYLINE_STEP = 1.25;
export const SKYLINE_MIN_HEIGHT = 0.15;
export const SKYLINE_MAX_HEIGHT = 6;
export const SKYLINE_CAMERA_FOV = 35;
export const SKYLINE_CAMERA_ELEVATION = (30 * Math.PI) / 180;

const WIDTH_MARGIN = 1.22;
// Near bars sit closer to the camera than the scene centre, so perspective makes the
// orthographic height estimate fall short.
const HEIGHT_MARGIN = 1.45;

const DAYS_PER_WEEK = 7;
const MS_PER_DAY = 86_400_000;

function utcDay(date: string): number {
  return Date.parse(`${date}T00:00:00Z`) / MS_PER_DAY;
}

function mondayFirstWeekday(date: string): number {
  return (new Date(`${date}T00:00:00Z`).getUTCDay() + 6) % DAYS_PER_WEEK;
}

export function barHeight(count: number, maxCount: number): number {
  if (count <= 0 || maxCount <= 0) {
    return SKYLINE_MIN_HEIGHT;
  }
  return SKYLINE_MIN_HEIGHT + (SKYLINE_MAX_HEIGHT - SKYLINE_MIN_HEIGHT) * (Math.log1p(count) / Math.log1p(maxCount));
}

export function buildSkyline(days: ContributionDay[]): SkylineLayout {
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const first = sorted[0];
  const last = sorted.at(-1);
  if (!first || !last) {
    return { bars: [], width: 0, depth: 0 };
  }

  const start = utcDay(first.date);
  const offset = mondayFirstWeekday(first.date);
  const weeks = Math.floor((offset + utcDay(last.date) - start) / DAYS_PER_WEEK) + 1;
  const width = (weeks - 1) * SKYLINE_STEP;
  const depth = (DAYS_PER_WEEK - 1) * SKYLINE_STEP;
  const maxCount = Math.max(...sorted.map((day) => day.count));

  const bars = sorted.map((day) => {
    const slot = offset + utcDay(day.date) - start;
    return {
      day,
      x: Math.floor(slot / DAYS_PER_WEEK) * SKYLINE_STEP - width / 2,
      z: (slot % DAYS_PER_WEEK) * SKYLINE_STEP - depth / 2,
      height: barHeight(day.count, maxCount),
    };
  });

  return { bars, width, depth };
}

export function skylineCameraDistance({ width, depth }: SkylineLayout, aspect: number): number {
  const viewSlope = 2 * Math.tan(((SKYLINE_CAMERA_FOV / 2) * Math.PI) / 180);
  const projectedHeight =
    depth * Math.sin(SKYLINE_CAMERA_ELEVATION) + SKYLINE_MAX_HEIGHT * Math.cos(SKYLINE_CAMERA_ELEVATION);
  const fitWidth = (width * WIDTH_MARGIN) / (viewSlope * aspect);
  const fitHeight = (projectedHeight * HEIGHT_MARGIN) / viewSlope;
  return Math.max(fitWidth, fitHeight);
}
