"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/* ─── types ──────────────────────────────────────────────────────── */

type ContributionDay = {
  date: string; // "YYYY-MM-DD"
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

type ApiResponse = {
  contributions: ContributionDay[];
  total: number;
  year: number;
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

/* ─── constants ──────────────────────────────────────────────────── */

const CELL = 11; // px — day cell size
const GAP = 2; // px — gap between cells
const STEP = CELL + GAP; // 13px per column / row
const LABEL_H = 16; // px — month label row height
const SVG_H = LABEL_H + 7 * STEP - GAP; // 105px total SVG height

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Cyberpunk neon-orange fill per contribution level (0 = none, 4 = peak) */
const LEVEL_FILL = [
  "rgba(255,255,255,0.06)", // 0 – no contributions
  "rgba(255,95,31,0.20)", //  1 – low
  "rgba(255,95,31,0.42)", //  2 – moderate
  "rgba(255,95,31,0.68)", //  3 – high
  "#ff5f1f", //               4 – peak (+ neon glow filter)
];

/* ─── pure helpers ───────────────────────────────────────────────── */

/**
 * Groups a sorted flat day array into Sun-first week columns, padding the
 * first week so column 0 starts on Sunday. Also computes month label positions.
 */
function buildCalendar(days: ContributionDay[]): CalendarData {
  if (days.length === 0) {
    return { weeks: [], monthLabels: [] };
  }

  // Parse at noon local time to avoid UTC off-by-one shifts on any timezone.
  const startPad = new Date(`${days[0].date}T12:00:00`).getDay(); // 0 = Sunday
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

/* ─── skeleton ───────────────────────────────────────────────────── */

/**
 * SVG skeleton using a <pattern> fill — a single <rect> renders the full
 * placeholder grid. No array iterations means no React key concerns.
 */
function GraphSkeleton() {
  return (
    <svg width={53 * STEP - GAP} height={SVG_H} aria-hidden="true" className="animate-pulse">
      <defs>
        <pattern id="sk-grid" x="0" y="0" width={STEP} height={STEP} patternUnits="userSpaceOnUse">
          <rect width={CELL} height={CELL} rx="3" fill="rgba(255,255,255,0.05)" />
        </pattern>
      </defs>
      <rect x="0" y={LABEL_H} width={53 * STEP - GAP} height={7 * STEP - GAP} fill="url(#sk-grid)" />
    </svg>
  );
}

/* ─── main component ─────────────────────────────────────────────── */

export type ContributionGraphProps = {
  /** API endpoint for contribution data. Defaults to /api/github/contributions */
  apiUrl?: string;
  className?: string;
};

export function ContributionGraph({ apiUrl = "/api/github/contributions", className }: ContributionGraphProps) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState>(null);

  useEffect(() => {
    let alive = true;
    fetch(apiUrl)
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
  }, [apiUrl]);

  const { weeks, monthLabels } = data ? buildCalendar(data.contributions) : { weeks: [], monthLabels: [] };
  const svgWidth = weeks.length > 0 ? weeks.length * STEP - GAP : 0;

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
        {/* Ambient neon gradient overlay */}
        <div className="pointer-events-none absolute inset-0 rounded-xl bg-linear-to-br from-orange-500/4 via-transparent to-transparent" />

        <div className="relative z-10 overflow-x-auto pb-1">
          {/* ── Loading ── */}
          {loading && <GraphSkeleton />}

          {/* ── Error ── */}
          {error && (
            <div className="flex h-26.25 items-center justify-center font-mono text-sm text-muted-foreground">
              Unable to load contribution data.
            </div>
          )}

          {/* ── Data ── */}
          {!loading && !error && data && (
            <div className="flex w-max flex-col gap-2">
              <svg
                width={svgWidth}
                height={SVG_H}
                aria-label={`${data.total.toLocaleString()} GitHub contributions in ${data.year}`}
                role="img"
                onMouseMove={(e) => {
                  const { left, top } = e.currentTarget.getBoundingClientRect();
                  const rx = e.clientX - left;
                  const ry = e.clientY - top;
                  const wi = Math.floor(rx / STEP);
                  const di = Math.floor((ry - LABEL_H) / STEP);
                  const inBounds = wi >= 0 && wi < weeks.length && di >= 0 && di < 7 && ry >= LABEL_H;
                  const inCell = inBounds && rx - wi * STEP < CELL && ry - LABEL_H - di * STEP < CELL;
                  const day = inCell ? (weeks[wi]?.[di] ?? null) : null;
                  setTooltip((prev) =>
                    prev?.day.date === day?.date ? prev : day ? { day, x: e.clientX, y: e.clientY } : null
                  );
                }}
                onMouseLeave={() => setTooltip(null)}
              >
                <defs>
                  {/* Neon glow for peak-activity cells (level 4) */}
                  <filter id="neon-glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Month labels */}
                {monthLabels.map(({ weekIndex, label }) => (
                  <text
                    key={label}
                    x={weekIndex * STEP}
                    y={LABEL_H - 4}
                    fontSize={10}
                    fontFamily="monospace"
                    className="fill-muted-foreground"
                  >
                    {label}
                  </text>
                ))}

                {/* Contribution cells — grouped by week */}
                {weeks.map((week, wi) => {
                  const firstRealDay = week.find(Boolean);
                  // Skip any all-empty week (defensive; won't happen with real GitHub data).
                  if (!firstRealDay) {
                    return null;
                  }

                  return (
                    // Key uses the first real day's date — stable, data-based, not an array index.
                    <g key={firstRealDay.date}>
                      {week.map((day, di) =>
                        // Null padding cells are skipped; SVG coordinate space handles the gap.
                        day ? (
                          <rect
                            key={day.date}
                            x={wi * STEP}
                            y={LABEL_H + di * STEP}
                            width={CELL}
                            height={CELL}
                            rx={3}
                            ry={3}
                            fill={LEVEL_FILL[day.level]}
                            filter={day.level === 4 ? "url(#neon-glow)" : undefined}
                          >
                            <title>{`${formatCount(day.count)} on ${formatDate(day.date)}`}</title>
                          </rect>
                        ) : null
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Footer: total count + legend */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-muted-foreground" style={{ fontSize: 11 }}>
                  {data.total.toLocaleString()} contributions in {data.year}
                </span>
                <div className="ml-auto flex items-center gap-1">
                  <span className="mr-1 font-mono text-muted-foreground" style={{ fontSize: 10 }}>
                    Less
                  </span>
                  {([0, 1, 2, 3, 4] as const).map((lvl) => (
                    <svg key={lvl} width={CELL} height={CELL} aria-hidden="true">
                      <rect width={CELL} height={CELL} rx={3} ry={3} fill={LEVEL_FILL[lvl]} />
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
