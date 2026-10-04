"use client";

import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AppWindow,
  Braces,
  Cloud,
  Database,
  Network,
  Server,
  ShieldCheck,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { cn } from "@/lib/utils";
import { AboutCardSurface } from "./AboutCardSurface";
import { AboutSection } from "./AboutSection";
import {
  getPrimaryStack,
  getSkillGroups,
  matchesSkillFilter,
  SKILL_FILTERS,
  SKILL_TIER_META,
  SKILL_TIERS,
  type SkillFilter,
  type SkillGroupId,
} from "./aboutSkillsGrouped";
import { SkillChip, SkillTierSwatch } from "./SkillChip";

const GROUP_ICONS: Record<SkillGroupId, LucideIcon> = {
  backend: Server,
  data: Database,
  cloud: Cloud,
  architecture: Network,
  languages: Braces,
  observability: Activity,
  quality: ShieldCheck,
  ai: Sparkles,
  frontend: AppWindow,
  tools: Wrench,
};

const SKILL_GROUPS = getSkillGroups();
const PRIMARY_STACK_SKILLS = getPrimaryStack();
const ALL_SKILLS = SKILL_GROUPS.flatMap((group) => group.skills);

const filterButtonClass =
  "inline-flex h-11 shrink-0 items-center gap-2 rounded-lg border px-4 font-terminal text-xs uppercase tracking-[0.06em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500";
const filterOnClass =
  "border-orange-600 bg-orange-50 text-orange-950 dark:border-orange-500 dark:bg-orange-500/15 dark:text-orange-100";
const filterOffClass =
  "border-gray-300 bg-white text-gray-800 hover:border-gray-400 dark:border-white/15 dark:bg-[#0b0d11] dark:text-gray-200 dark:hover:border-white/30";

function CardHeading({ Icon, title, meta }: { Icon: LucideIcon; title: string; meta: string }) {
  const { getTextColor } = useThemeConfig();

  return (
    <div className="flex items-center justify-between gap-3">
      <h3 className={cn("flex items-center gap-2.5 text-lg font-semibold tracking-tight", getTextColor("primary"))}>
        <Icon className="size-5 text-primary" aria-hidden />
        {title}
      </h3>
      <span className={cn("font-terminal text-xs", getTextColor("secondary"))}>{meta}</span>
    </div>
  );
}

export function SkillsSection() {
  const { getTextColor } = useThemeConfig();
  const [filter, setFilter] = useState<SkillFilter>("all");

  const visibleGroups = SKILL_GROUPS.map((group) => ({
    ...group,
    visibleSkills: group.skills.filter((skill) => matchesSkillFilter(skill.tier, filter)),
  })).filter((group) => group.visibleSkills.length > 0);

  return (
    <AboutSection delay={0.4} iconName="Code2" title="Skills & Technologies" className="not-prose">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <ul
            aria-label="Proficiency key"
            className={cn("flex flex-wrap gap-x-4 gap-y-2 font-terminal text-xs", getTextColor("secondary"))}
          >
            {SKILL_TIERS.map((tier) => (
              <li key={tier} className="flex items-center gap-2">
                <SkillTierSwatch tier={tier} />
                {SKILL_TIER_META[tier].label}: {SKILL_TIER_META[tier].description}
              </li>
            ))}
          </ul>

          <fieldset className="min-w-0">
            <legend className="sr-only">Filter skills by proficiency</legend>
            <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
              {SKILL_FILTERS.map(({ id, label }) => {
                const selected = filter === id;
                const count = ALL_SKILLS.filter((skill) => matchesSkillFilter(skill.tier, id)).length;

                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setFilter(id)}
                    className={cn(filterButtonClass, selected ? filterOnClass : filterOffClass)}
                  >
                    {label}
                    <span className="opacity-80">{count}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>

        <AboutCardSurface>
          <div className="relative z-10 flex flex-col gap-4">
            <CardHeading Icon={Zap} title="Primary stack" meta="What I reach for first" />
            <ul className="flex flex-wrap gap-2">
              {PRIMARY_STACK_SKILLS.map((skill) => (
                <SkillChip key={skill.name} name={skill.name} tier={skill.tier} size="lg" />
              ))}
            </ul>
          </div>
        </AboutCardSurface>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {visibleGroups.map((group) => {
            const total = group.skills.length;
            const shown = group.visibleSkills.length;

            return (
              <AboutCardSurface key={group.id}>
                <div className="relative z-10 flex flex-col gap-4">
                  <CardHeading
                    Icon={GROUP_ICONS[group.id]}
                    title={group.title}
                    meta={shown === total ? String(total) : `${shown}/${total}`}
                  />
                  <ul className="flex flex-wrap gap-2">
                    {group.visibleSkills.map((skill) => (
                      <SkillChip key={skill.name} name={skill.name} tier={skill.tier} />
                    ))}
                  </ul>
                </div>
              </AboutCardSurface>
            );
          })}
        </div>
      </div>
    </AboutSection>
  );
}
