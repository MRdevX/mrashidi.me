"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRender3D } from "@/lib/three/useRender3D";
import { cn } from "@/lib/utils";
import {
  buildCalendar,
  type CalendarData,
  type ContributionDay,
  computeDynamicLevels,
  formatContributionCount,
  formatContributionDate,
  type Level,
} from "./contributionCalendar";
import { useContributions } from "./useContributions";

const ContributionSkyline = dynamic(() => import("./skyline/ContributionSkyline"), {
  ssr: false,
  loading: () => <div className="h-[300px]" aria-hidden="true" />,
});

type GraphView = "2d" | "3d";

type TooltipState = {
  day: ContributionDay;
  x: number;
  y: number;
} | null;

const CELL_PX = 11;
const GAP_PX = 2;
const STEP_PX = CELL_PX + GAP_PX;
const LABEL_HEIGHT_PX = 16;
const DAYS_PER_WEEK = 7;
const WEEKS_PER_YEAR = 53;
const SVG_HEIGHT_PX = LABEL_HEIGHT_PX + DAYS_PER_WEEK * STEP_PX - GAP_PX;

const LEVEL_FILL: Record<Level, string> = {
  0: "rgba(255,255,255,0.06)",
  1: "rgba(255,95,31,0.20)",
  2: "rgba(255,95,31,0.36)",
  3: "rgba(255,95,31,0.52)",
  4: "rgba(255,95,31,0.68)",
  5: "rgba(255,95,31,0.84)",
  6: "#ff5f1f",
};

function findDayUnderPointer(
  svg: SVGSVGElement,
  clientX: number,
  clientY: number,
  weeks: CalendarData["weeks"]
): ContributionDay | null {
  const ctm = svg.getScreenCTM();
  if (!ctm) {
    return null;
  }
  const point = svg.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  const { x: rx, y: ry } = point.matrixTransform(ctm.inverse());
  const wi = Math.floor(rx / STEP_PX);
  const di = Math.floor((ry - LABEL_HEIGHT_PX) / STEP_PX);
  const inBounds = wi >= 0 && wi < weeks.length && di >= 0 && di < DAYS_PER_WEEK && ry >= LABEL_HEIGHT_PX;
  const inCell = inBounds && rx - wi * STEP_PX < CELL_PX && ry - LABEL_HEIGHT_PX - di * STEP_PX < CELL_PX;
  return inCell ? (weeks[wi]?.[di] ?? null) : null;
}

function GraphSkeleton() {
  const vw = WEEKS_PER_YEAR * STEP_PX - GAP_PX;
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

function GraphViewToggle({ view, onChange }: { view: GraphView; onChange: (view: GraphView) => void }) {
  return (
    <fieldset className="flex rounded-md border border-primary/20 p-0.5 font-mono text-[11px]">
      <legend className="sr-only">Graph view</legend>
      {(["2d", "3d"] as const).map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={view === option}
          onClick={() => onChange(option)}
          className={cn(
            "rounded px-2 py-0.5 uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            view === option ? "bg-primary text-black" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option}
        </button>
      ))}
    </fieldset>
  );
}

export type ContributionGraphProps = {
  className?: string;
};

export function ContributionGraph({ className }: ContributionGraphProps) {
  const { data, loading, error } = useContributions();
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const render3D = useRender3D();
  const [view, setView] = useState<GraphView>("3d");
  const show3D = render3D && view === "3d";

  const contributions = data ? computeDynamicLevels(data.contributions) : [];
  const { weeks, monthLabels } = buildCalendar(contributions);
  const svgWidth = weeks.length > 0 ? weeks.length * STEP_PX - GAP_PX : 0;
  return (
    <>
      {/* Fixed tooltip — uses viewport coords, never clipped by overflow */}
      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 rounded-lg border border-primary/20 bg-background/95 px-3 py-2 text-xs shadow-xl backdrop-blur-sm"
          style={{
            left: tooltip.x + 14,
            top: tooltip.y < 70 ? tooltip.y + 18 : tooltip.y - 52,
          }}
        >
          <p className="font-mono font-medium text-foreground">{formatContributionCount(tooltip.day.count)}</p>
          <p className="text-muted-foreground">{formatContributionDate(tooltip.day.date)}</p>
        </div>
      )}

      <div
        className={cn(
          "glass-card-no-shadow relative w-full overflow-hidden rounded-xl border border-primary/10 p-4 shadow-lg lg:p-6",
          className
        )}
      >
        <div className="pointer-events-none absolute inset-0 rounded-xl bg-linear-to-br from-primary/4 via-transparent to-transparent" />

        <div className="relative z-10 pb-1">
          {loading && <GraphSkeleton />}

          {error && (
            <div className="flex h-26.25 items-center justify-center font-mono text-sm text-muted-foreground">
              Unable to load contribution data.
            </div>
          )}

          {!loading && !error && data && (
            <div className="flex w-full flex-col gap-2">
              {show3D ? (
                <ContributionSkyline
                  contributions={data.contributions}
                  label={`${data.total.toLocaleString()} GitHub contributions in the last year`}
                />
              ) : (
                <svg
                  viewBox={`0 0 ${svgWidth} ${SVG_HEIGHT_PX}`}
                  width="100%"
                  aria-label={`${data.total.toLocaleString()} GitHub contributions in the last year`}
                  role="img"
                  onMouseMove={(e) => {
                    const day = findDayUnderPointer(e.currentTarget, e.clientX, e.clientY, weeks);
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
                              <title>{`${formatContributionCount(day.count)} on ${formatContributionDate(day.date)}`}</title>
                            </rect>
                          ) : null
                        )}
                      </g>
                    );
                  })}
                </svg>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-muted-foreground" style={{ fontSize: 11 }}>
                  {data.total.toLocaleString()} contributions in the last year
                </span>
                <div className="ml-auto flex items-center gap-3">
                  {!show3D && (
                    <div className="flex items-center gap-1">
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
                  )}
                  {render3D && <GraphViewToggle view={view} onChange={setView} />}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
