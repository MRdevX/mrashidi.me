"use client";

import type { ExperienceEntry } from "@mrashidi/types";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Laptop } from "lucide-react";
import { useId, useState } from "react";
import { FilamentDivider, SectionHeader, SurfaceCard } from "@/components/ui";
import { getThemeConfig } from "@/config/theme.config";
import { pageEnterTransition } from "@/lib/animations";
import { useContent } from "@/lib/content";
import { getTechIcon } from "@/lib/tech";
import { cn } from "@/lib/utils";
import { Badge } from "./Badge";
import { formatDuration, formatIsoMonth } from "./period";

const ACHIEVEMENT_PREVIEW_COUNT = 3;

/**
 * The timeline dot sits in the rail beside the card, so it shares two values with the card:
 * the card's inner padding (+1px border) and the job title's font metrics (`1lh` box).
 */
const cardPaddingClass = "p-5 sm:p-6";
const railDotOffsetClass = "mt-[calc(1.25rem+1px)] sm:mt-[calc(1.5rem+1px)]";
const jobTitleTextClass = "text-lg leading-snug sm:text-xl";

function JobPeriod({ start, end, durationMonths }: Pick<ExperienceEntry, "start" | "end" | "durationMonths">) {
  const { getTextColor } = getThemeConfig();

  return (
    <p className={cn("shrink-0 text-sm tabular-nums", getTextColor("secondary"))}>
      <time dateTime={start}>{formatIsoMonth(start)}</time>
      {" – "}
      {end ? <time dateTime={end}>{formatIsoMonth(end)}</time> : "Present"}
      <span className={getTextColor("muted")}>
        <span aria-hidden> · </span>
        <span className="sr-only">, </span>
        {formatDuration(durationMonths)}
      </span>
    </p>
  );
}

function StackList({ stack }: { stack: string[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tech stack">
      {stack.map((tech) => {
        const { Icon, colorClass } = getTechIcon(tech);
        return (
          <li
            key={tech}
            className="a11y-tech-chip inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-xs font-medium"
          >
            <Icon className={cn("size-3.5 shrink-0", colorClass)} aria-hidden />
            {tech}
          </li>
        );
      })}
    </ul>
  );
}

function Achievements({ items }: { items: string[] }) {
  const { getTextColor } = getThemeConfig();
  const prefersReducedMotion = useReducedMotion();
  const listId = useId();
  const [expanded, setExpanded] = useState(false);
  const hiddenCount = Math.max(0, items.length - ACHIEVEMENT_PREVIEW_COUNT);
  const visible = expanded ? items : items.slice(0, ACHIEVEMENT_PREVIEW_COUNT);

  return (
    <div className="mt-5">
      <FilamentDivider className="mb-4" />
      <h4 className={cn("mb-3 text-xs font-semibold uppercase tracking-wider", getTextColor("muted"))}>
        Key achievements
      </h4>
      <ul id={listId} className="space-y-2.5">
        <AnimatePresence initial={false}>
          {visible.map((achievement, index) => (
            <motion.li
              key={achievement}
              className="flex items-start gap-3"
              initial={index >= ACHIEVEMENT_PREVIEW_COUNT ? { opacity: 0, y: prefersReducedMotion ? 0 : -4 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={pageEnterTransition(prefersReducedMotion, {
                delay: (index - ACHIEVEMENT_PREVIEW_COUNT) * 0.03,
                duration: 0.25,
              })}
            >
              <span className="mt-[0.55rem] size-1.5 shrink-0 rounded-full bg-primary/80" aria-hidden />
              <span className={cn("text-sm leading-relaxed sm:text-[0.9375rem]", getTextColor("primary"))}>
                {achievement}
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {hiddenCount > 0 ? (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => setExpanded((open) => !open)}
          className={cn(
            "mt-3 inline-flex min-h-[2.75rem] cursor-pointer items-center gap-1.5 rounded-md px-1 text-sm font-medium transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 text-brand-text"
          )}
        >
          {expanded ? "Show less" : `Show ${hiddenCount} more`}
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={pageEnterTransition(prefersReducedMotion, { duration: 0.2 })}
            className="inline-flex"
          >
            <ChevronDown className="size-4" aria-hidden />
          </motion.span>
        </button>
      ) : null}
    </div>
  );
}

function JobCard({ job }: { job: ExperienceEntry }) {
  const { getTextColor } = getThemeConfig();

  return (
    <SurfaceCard as="article" static className="!p-0 border-primary/15">
      <div className={cn("relative z-10", cardPaddingClass)}>
        <header>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
            <h3
              className={cn(
                jobTitleTextClass,
                "font-albert font-semibold tracking-tight text-balance",
                getTextColor("primary")
              )}
            >
              {job.title}
            </h3>
            <JobPeriod start={job.start} end={job.end} durationMonths={job.durationMonths} />
          </div>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm sm:text-base">
            <span className={"font-medium text-brand-text"}>{job.company}</span>
            <span aria-hidden className={getTextColor("muted")}>
              ·
            </span>
            <span className={getTextColor("secondary")}>{job.location}</span>
          </p>
          <Badge icon={Laptop} className="mt-3">
            {job.employmentType}
          </Badge>
        </header>

        {job.summary ? (
          <p className={cn("mt-4 text-sm leading-relaxed sm:text-[0.9375rem]", getTextColor("primary"))}>
            {job.summary}
          </p>
        ) : null}

        {job.stack && job.stack.length > 0 ? <StackList stack={job.stack} /> : null}

        {job.achievements.length > 0 ? <Achievements items={job.achievements} /> : null}
      </div>
    </SurfaceCard>
  );
}

export function WorkExperienceSection() {
  const prefersReducedMotion = useReducedMotion();
  const { experience: workExperience } = useContent();

  return (
    <section>
      <SectionHeader as="h2" iconName="Briefcase" title="Work Experience" />

      <ol>
        {workExperience.map((job, index) => (
          <motion.li
            key={`${job.company}-${job.title}`}
            className="group/job relative grid grid-cols-[1rem_minmax(0,1fr)] gap-x-3 pb-6 last:pb-0 sm:grid-cols-[1.5rem_minmax(0,1fr)] sm:gap-x-5"
            initial={{ opacity: 1, y: prefersReducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={pageEnterTransition(prefersReducedMotion, { delay: index * 0.08, duration: 0.5 })}
          >
            {/* Rail: spine segment (runs through the li's pb-6 so segments join) + dot aligned to the title's first line */}
            <div aria-hidden className="relative flex justify-center">
              <span className="absolute top-0 -bottom-6 left-1/2 w-px -translate-x-1/2 bg-primary/35 group-first/job:top-8 group-last/job:bottom-0 group-last/job:bg-transparent group-last/job:bg-gradient-to-b group-last/job:from-primary/35 group-last/job:to-transparent" />
              <span className={cn("relative flex h-[1lh] items-center", railDotOffsetClass, jobTitleTextClass)}>
                <span className="size-3 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.45)] ring-4 ring-primary/15" />
              </span>
            </div>

            <JobCard job={job} />
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
