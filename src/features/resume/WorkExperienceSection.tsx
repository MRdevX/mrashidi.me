"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Laptop,
  MapPin,
  Trophy,
} from "lucide-react";
import { useState } from "react";
import { CyberpunkCard, CyberpunkCardContent, CyberpunkCardHeader, CyberpunkCardTitle } from "@/components/ui";
import { workExperience } from "@/data";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { cn } from "@/lib/utils";

/** Shared styles: meta chips + left-column body text */
const metaChipClass =
  "inline-flex w-fit max-w-full shrink-0 items-center gap-2 rounded-md border border-orange-500/15 bg-orange-500/5 px-2.5 py-1.5 text-xs font-medium leading-tight tracking-tight text-foreground dark:border-orange-500/25 dark:bg-orange-500/10 sm:text-sm";
const metaChipIconClass = "size-4 shrink-0 text-orange-500/80 dark:text-orange-400/90";
const leadingIconClass = "size-4 shrink-0 text-orange-500/70 dark:text-orange-400/85";
/**
 * Vertical sync for milestone dot + spine with job title glyph box:
 * feature-card padding (`p-6`) + CyberpunkCardHeader (`p-6`) + ~½ leading for `text-xl` / md:`text-2xl` (`leading-snug`).
 */
const timelineAnchorTw = "top-[3.875rem] md:top-[4rem]";
const timelineSpineClass = `pointer-events-none absolute ${timelineAnchorTw} bottom-14 left-6 z-[1] w-px -translate-x-1/2 rounded-full bg-[linear-gradient(to_bottom,_rgb(249_115_22/0.44)_0%,_rgb(249_115_22/0.44)_calc(100%-4rem),_transparent)] dark:bg-[linear-gradient(to_bottom,_rgb(251_146_60/0.36)_0%,_rgb(251_146_60/0.36)_calc(100%-4rem),_transparent)]`;

export function WorkExperienceSection() {
  const { getSectionTitle, getTextColor } = useThemeConfig();
  const [openAchievements, setOpenAchievements] = useState<Set<string>>(new Set());

  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <Briefcase className="size-8 shrink-0 text-orange-500" aria-hidden />
        <h2 className={getSectionTitle()}>Work Experience</h2>
      </div>

      <div className="relative">
        <div aria-hidden className={timelineSpineClass} />
        <div className="flex flex-col">
          {workExperience.map((job, index) => {
            const showAchievementsBlock = job.achievements.length > 0;

            return (
              <motion.div
                key={`${job.company}-${job.title}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative pb-8 last:pb-0"
              >
                {/* Timeline node — centred on job title cap line (see timelineAnchorTw) */}
                <div
                  className={`absolute ${timelineAnchorTw} left-6 z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-400/45 bg-orange-500 shadow-md shadow-orange-500/35 ring-[3px] ring-orange-500/12 dark:border-orange-300/35 dark:ring-orange-400/14`}
                  aria-hidden
                />

                {/* Content card */}
                <div className="ml-12">
                  <CyberpunkCard
                    variant="feature"
                    className="relative isolate z-0 overflow-hidden border-orange-500/20 transition-all duration-300 group"
                  >
                    <div className="relative z-10">
                      <CyberpunkCardHeader
                        className={cn(
                          showAchievementsBlock
                            ? "border-b border-orange-500/12 pb-5 dark:border-white/10"
                            : "border-b-0 pb-4"
                        )}
                      >
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                          {/* Title · company · location */}
                          <div className="flex min-w-0 flex-1 flex-col gap-5">
                            <CyberpunkCardTitle className="!text-xl md:!text-2xl mb-0 font-albert font-semibold leading-snug tracking-tight text-balance text-orange-500 transition-colors dark:text-orange-400 group-hover:text-orange-400 dark:group-hover:text-orange-300">
                              {job.title}
                            </CyberpunkCardTitle>

                            <div
                              className={`flex flex-wrap items-center gap-2 font-albert text-base font-medium leading-snug tracking-tight ${getTextColor("secondary")}`}
                            >
                              <Building2 className={leadingIconClass} aria-hidden />
                              <span>{job.company}</span>
                            </div>

                            <div
                              className={`flex flex-wrap items-center gap-2 font-albert text-sm leading-snug tracking-tight ${getTextColor("secondary")}`}
                            >
                              <MapPin className={leadingIconClass} aria-hidden />
                              <span className="min-w-0">{job.location}</span>
                            </div>
                          </div>

                          {/* Period · employment */}
                          <aside
                            className={`flex w-full shrink-0 flex-col items-end gap-3 font-albert sm:ml-auto sm:w-auto sm:min-w-[11.5rem] sm:max-w-[14rem] ${getTextColor("muted")}`}
                          >
                            <div className={metaChipClass}>
                              <Calendar className={metaChipIconClass} aria-hidden />
                              <span className="tabular-nums">{job.period}</span>
                            </div>
                            <div className={metaChipClass}>
                              <Laptop className={metaChipIconClass} aria-hidden />
                              <span className="text-balance">{job.employmentType}</span>
                            </div>
                          </aside>
                        </div>
                      </CyberpunkCardHeader>

                      {job.achievements.length > 0 && (
                        <CyberpunkCardContent className="pt-0">
                          <div className="pt-6">
                            <button
                              type="button"
                              onClick={() => {
                                const key = `${job.company}-${job.title}`;
                                const newOpen = new Set(openAchievements);
                                if (newOpen.has(key)) {
                                  newOpen.delete(key);
                                } else {
                                  newOpen.add(key);
                                }
                                setOpenAchievements(newOpen);
                              }}
                              className="relative z-10 flex min-h-[2.75rem] w-full cursor-pointer items-center justify-between gap-3 rounded-md border border-orange-500/20 bg-muted/20 px-3 py-2.5 text-left transition-colors duration-200 hover:border-orange-500/35 hover:bg-muted/40 dark:hover:bg-muted/25 group/trigger"
                            >
                              <div className="flex min-w-0 items-center gap-2">
                                <Trophy className="size-4 shrink-0 text-orange-500" aria-hidden />
                                <span className="text-sm font-medium text-orange-500 dark:text-orange-400">
                                  Key Achievements
                                </span>
                              </div>
                              <motion.div
                                animate={{
                                  rotate: openAchievements.has(`${job.company}-${job.title}`) ? 180 : 0,
                                }}
                                transition={{ duration: 0.2 }}
                                className="text-orange-500/60"
                              >
                                {openAchievements.has(`${job.company}-${job.title}`) ? (
                                  <ChevronUp className="size-4" aria-hidden />
                                ) : (
                                  <ChevronDown className="size-4" aria-hidden />
                                )}
                              </motion.div>
                            </button>

                            {openAchievements.has(`${job.company}-${job.title}`) && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden"
                              >
                                <ul className="mt-4 space-y-3">
                                  {job.achievements.map((achievement, index) => (
                                    <motion.li
                                      key={achievement}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.05 }}
                                      className="group/achievement flex items-start gap-3"
                                    >
                                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-orange-500 transition-colors group-hover/achievement:text-orange-400" />
                                      <span
                                        className={`${getTextColor("primary")} group-hover/achievement:${getTextColor(
                                          "primary"
                                        )} text-sm leading-relaxed transition-colors`}
                                      >
                                        {achievement}
                                      </span>
                                    </motion.li>
                                  ))}
                                </ul>
                              </motion.div>
                            )}
                          </div>
                        </CyberpunkCardContent>
                      )}
                    </div>
                  </CyberpunkCard>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
