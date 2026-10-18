"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Level = 0 | 1 | 2 | 3 | 4 | 5 | 6;

type ContributionDay = {
  date: string; // "YYYY-MM-DD"
  count: number;
  level: Level;
};

type ApiResponse = {
  contributions: ContributionDay[];
  total: number;
};

type TooltipState = {
  day: ContributionDay;
  x: number;
  y: number;
} | null;

type CalendarData = {
  weeks: (ContributionDay | null)[][];
  monthLabels: { weekIndex: number; label: string }[];
};

const CELL_PX = 11;
const GAP_PX = 2;
const STEP_PX = CELL_PX + GAP_PX;
const LABEL_HEIGHT_PX = 16;
const SVG_HEIGHT_PX = LABEL_HEIGHT_PX + 7 * STEP_PX - GAP_PX;

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const LEVEL_FILL: Record<Level, string> = {
  0: "rgba(255,255,255,0.06)",
  1: "rgba(255,95,31,0.20)",
  2: "rgba(255,95,31,0.36)",
  3: "rgba(255,95,31,0.52)",
  4: "rgba(255,95,31,0.68)",
  5: "rgba(255,95,31,0.84)",
  6: "#ff5f1f",
};

function buildCalendar(days: ContributionDay[]): CalendarData {
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

function formatDate(s: string): string {
  return new Date(`${s}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCount(count: number): string {
  if (count === 0) {
    return "No contributions";
  }
  return count === 1 ? "1 contribution" : `${count} contributions`;
}

function computeDynamicLevels(days: ContributionDay[]): ContributionDay[] {
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

function GraphSkeleton() {
  const vw = 53 * STEP_PX - GAP_PX;
  return (
    <svg viewBox={`0 0 ${vw} ${SVG_HEIGHT_PX}`} width="100%" aria-hidden="true" className="animate-pulse">
      <defs>
        <pattern id="sk-grid" x="0" y="0" width={STEP_PX} height={STEP_PX} patternUnits="userSpaceOnUse">
          <rect width={CELL_PX} height={CELL_PX} rx="3" fill="rgba(255,255,255,0.05)" />
        </pattern>
      </defs>
      <rect x="0" y={LABEL_HEIGHT_PX} width={vw} height={7 * STEP_PX - GAP_PX} fill="url(#sk-grid)" />
    </svg>
  );
}

export type ContributionGraphProps = {
  className?: string;
};

const CONTRIBUTIONS_URL = "/api/github/contributions";

export function ContributionGraph({ className }: ContributionGraphProps) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState>(null);

  useEffect(() => {
    let alive = true;
    fetch(CONTRIBUTIONS_URL)
      .then((r) => {
        if (!r.ok) {
          throw new Error(`HTTP ${r.status}`);
        }
        return r.json() as Promise<ApiResponse>;
      })
      .then((d) => {
        if (alive) {
          setData(d);
          setLoading(false);
        }
      })
      .catch(() => {
        if (alive) {
          setError(true);
          setLoading(false);
        }
      });
    return () => {
      alive = false;
    };
  }, []);

  const contributions = data ? computeDynamicLevels(data.contributions) : [];
  const { weeks, monthLabels } = buildCalendar(contributions);
  const svgWidth = weeks.length > 0 ? weeks.length * STEP_PX - GAP_PX : 0;
  return (
    <>
      {/* Fixed tooltip — uses viewport coords, never clipped by overflow */}
      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 rounded-lg border border-orange-500/20 bg-background/95 px-3 py-2 text-xs shadow-xl backdrop-blur-sm"
          style={{
            left: tooltip.x + 14,
            top: tooltip.y < 70 ? tooltip.y + 18 : tooltip.y - 52,
          }}
        >
          <p className="font-mono font-medium text-foreground">{formatCount(tooltip.day.count)}</p>
          <p className="text-muted-foreground">{formatDate(tooltip.day.date)}</p>
        </div>
      )}

      <div
        className={cn(
          "glass-card-no-shadow relative w-full overflow-hidden rounded-xl border border-orange-500/10 p-4 shadow-lg lg:p-6",
          className
        )}
      >
        <div className="pointer-events-none absolute inset-0 rounded-xl bg-linear-to-br from-orange-500/4 via-transparent to-transparent" />

        <div className="relative z-10 pb-1">
          {loading && <GraphSkeleton />}

          {error && (
            <div className="flex h-26.25 items-center justify-center font-mono text-sm text-muted-foreground">
              Unable to load contribution data.
            </div>
          )}

          {!loading && !error && data && (
            <div className="flex w-full flex-col gap-2">
              <svg
                viewBox={`0 0 ${svgWidth} ${SVG_HEIGHT_PX}`}
                width="100%"
                aria-label={`${data.total.toLocaleString()} GitHub contributions in the last year`}
                role="img"
                onMouseMove={(e) => {
                  const pt = e.currentTarget.createSVGPoint();
                  pt.x = e.clientX;
                  pt.y = e.clientY;
                  const ctm = e.currentTarget.getScreenCTM();
                  if (!ctm) {
                    return;
                  }
                  const { x: rx, y: ry } = pt.matrixTransform(ctm.inverse());
                  const wi = Math.floor(rx / STEP_PX);
                  const di = Math.floor((ry - LABEL_HEIGHT_PX) / STEP_PX);
                  const inBounds = wi >= 0 && wi < weeks.length && di >= 0 && di < 7 && ry >= LABEL_HEIGHT_PX;
                  const inCell =
                    inBounds && rx - wi * STEP_PX < CELL_PX && ry - LABEL_HEIGHT_PX - di * STEP_PX < CELL_PX;
                  const day = inCell ? (weeks[wi]?.[di] ?? null) : null;
                  setTooltip((prev) =>
                    prev?.day.date === day?.date ? prev : day ? { day, x: e.clientX, y: e.clientY } : null
                  );
                }}
                onMouseLeave={() => setTooltip(null)}
              >
                <defs>
                  <filter id="neon-glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {monthLabels.map(({ weekIndex, label }) => (
                  <text
                    key={`${label}-${weekIndex}`}
                    x={weekIndex * STEP_PX}
                    y={LABEL_HEIGHT_PX - 4}
                    fontSize={10}
                    fontFamily="monospace"
                    className="fill-muted-foreground"
                  >
                    {label}
                  </text>
                ))}

                {weeks.map((week, wi) => {
                  const firstRealDay = week.find(Boolean);
                  if (!firstRealDay) {
                    return null;
                  }

                  return (
                    <g key={firstRealDay.date}>
                      {week.map((day, di) =>
                        day ? (
                          <rect
                            key={day.date}
                            x={wi * STEP_PX}
                            y={LABEL_HEIGHT_PX + di * STEP_PX}
                            width={CELL_PX}
                            height={CELL_PX}
                            rx={3}
                            ry={3}
                            fill={LEVEL_FILL[day.level]}
                            filter={day.level === 6 ? "url(#neon-glow)" : undefined}
                          >
                            <title>{`${formatCount(day.count)} on ${formatDate(day.date)}`}</title>
                          </rect>
                        ) : null
                      )}
                    </g>
                  );
                })}
              </svg>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-muted-foreground" style={{ fontSize: 11 }}>
                  {data.total.toLocaleString()} contributions in the last year
                </span>
                <div className="ml-auto flex items-center gap-1">
                  <span className="mr-1 font-mono text-muted-foreground" style={{ fontSize: 10 }}>
                    Less
                  </span>
                  {([0, 1, 2, 3, 4, 5, 6] as const).map((lvl) => (
                    <svg key={lvl} width={CELL_PX} height={CELL_PX} aria-hidden="true">
                      <rect width={CELL_PX} height={CELL_PX} rx={3} ry={3} fill={LEVEL_FILL[lvl]} />
                    </svg>
                  ))}
                  <span className="ml-1 font-mono text-muted-foreground" style={{ fontSize: 10 }}>
                    More
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
