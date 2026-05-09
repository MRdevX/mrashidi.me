"use client";

import { useThemeConfig } from "@/hooks/useThemeConfig";
import { getTechIcon } from "@/lib/tech";
import { AboutCardSurface } from "./AboutCardSurface";
import { AboutSection } from "./AboutSection";
import { getSkillsGroupedByLevel, SKILL_LEVEL_META, type SkillLevelBucket } from "./aboutSkillsGrouped";

export function SkillsSection() {
  const { getTextColor } = useThemeConfig();
  const skillsByLevel = getSkillsGroupedByLevel();

  return (
    <AboutSection delay={0.4} iconName="Code2" title="Skills & Technologies" className="not-prose">
      <div className="space-y-8">
        {(Object.keys(SKILL_LEVEL_META) as SkillLevelBucket[]).map((level) => {
          const list = skillsByLevel[level];
          if (list.length === 0) {
            return null;
          }

          const config = SKILL_LEVEL_META[level];

          return (
            <AboutCardSurface key={level}>
              <div className="relative z-10 mb-4 flex items-center gap-3">
                <h3 className={`text-xl font-bold ${getTextColor("primary")}`} style={{ color: config.color }}>
                  {config.label}
                </h3>
                <span className={`text-sm ${getTextColor("secondary")}`}>({list.length})</span>
              </div>

              <div className="relative z-10 flex flex-wrap gap-2">
                {list.map((skill) => {
                  const { Icon, colorClass } = getTechIcon(skill.name);

                  return (
                    <span
                      key={`${skill.name}-${skill.category}`}
                      className="relative isolate z-10 inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium a11y-tech-chip transition-colors"
                      title={skill.name}
                    >
                      <Icon className={`size-4 ${colorClass}`} aria-hidden />
                      <span>{skill.name}</span>
                    </span>
                  );
                })}
              </div>
            </AboutCardSurface>
          );
        })}
      </div>
    </AboutSection>
  );
}
