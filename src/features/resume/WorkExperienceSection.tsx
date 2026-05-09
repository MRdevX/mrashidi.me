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

export function WorkExperienceSection() {
  const { getSectionTitle, getTextColor } = useThemeConfig();
  const [openAchievements, setOpenAchievements] = useState<Set<string>>(new Set());

  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <Briefcase className="w-8 h-8 text-orange-500" />
        <h2 className={getSectionTitle()}>Work Experience</h2>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-linear-to-b from-orange-500/50 via-orange-500/30 to-transparent" />

        <div className="space-y-8">
          {workExperience.map((job, index) => (
            <motion.div
              key={`${job.company}-${job.title}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative"
            >
              {/* Timeline square */}
              <div className="absolute left-6 top-10 w-3 h-3 bg-orange-500 shadow-lg shadow-orange-500/50 transform -translate-x-1/2 z-10">
                <div className="absolute inset-0 bg-orange-500 animate-ping opacity-20" />
              </div>

              {/* Content card */}
              <div className="ml-12">
                <CyberpunkCard
                  variant="feature"
                  className="relative isolate z-0 overflow-hidden border-orange-500/20 transition-all duration-300 group"
                >
                  <div className="relative z-10">
                    <CyberpunkCardHeader className={job.achievements.length > 0 ? "pb-4" : "border-b-0 pb-4"}>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                        {/* Title + company */}
                        <div className="min-w-0 flex-1">
                          <CyberpunkCardTitle className="!text-xl md:!text-2xl mb-0 font-albert font-semibold leading-snug tracking-tight text-balance text-orange-500 transition-colors dark:text-orange-400 group-hover:text-orange-400 dark:group-hover:text-orange-300">
                            {job.title}
                          </CyberpunkCardTitle>

                          <div
                            className={`mt-6 flex flex-wrap items-center gap-2 font-albert text-sm font-medium leading-snug tracking-tight md:text-base ${getTextColor("secondary")}`}
                          >
                            <Building2 className="size-4 shrink-0 text-orange-500/70" aria-hidden />
                            <span className="leading-snug">{job.company}</span>
                          </div>

                          <div
                            className={`mt-3 flex gap-2 font-albert text-sm leading-snug tracking-tight md:text-[0.9375rem] ${getTextColor("secondary")}`}
                          >
                            <MapPin
                              className="mt-0.5 size-4 shrink-0 text-orange-500/60 dark:text-orange-400/75"
                              aria-hidden
                            />
                            <span>{job.location}</span>
                          </div>
                        </div>

                        {/* Period + arrangement */}
                        <aside
                          className={`flex w-full shrink-0 flex-col gap-2.5 font-albert sm:w-auto sm:max-w-xs sm:items-end sm:gap-3 sm:text-right ${getTextColor("muted")}`}
                        >
                          <div className="inline-flex w-fit items-center gap-2 self-end rounded-md border border-orange-500/15 bg-orange-500/5 px-2.5 py-1.5 dark:border-orange-500/25 dark:bg-orange-500/10">
                            <Calendar
                              className="size-3.5 shrink-0 text-orange-500/80 dark:text-orange-400/90"
                              aria-hidden
                            />
                            <span className="text-xs font-medium tracking-tight tabular-nums text-foreground sm:text-sm">
                              {job.period}
                            </span>
                          </div>

                          <div
                            className={`flex items-start gap-2 self-end justify-end text-left tracking-tight sm:justify-end ${getTextColor("secondary")}`}
                          >
                            <Laptop
                              className="mt-0.5 size-3.5 shrink-0 text-orange-500/70 dark:text-orange-400/80"
                              aria-hidden
                            />
                            <span className="max-w-full text-xs leading-snug sm:text-sm">{job.employmentType}</span>
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
                            className="relative z-10 flex w-full cursor-pointer items-center justify-between rounded-lg border border-orange-500/20 bg-muted/20 p-3 transition-all duration-200 hover:border-orange-500/35 hover:bg-muted/40 dark:hover:bg-muted/25 group/trigger"
                          >
                            <div className="flex items-center gap-2">
                              <Trophy className="size-4 text-orange-500" aria-hidden />
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
                              <ul className="mt-4 space-y-2 px-0.5 pb-1">
                                {job.achievements.map((achievement, index) => (
                                  <motion.li
                                    key={achievement}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group/achievement flex items-start gap-3"
                                  >
                                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-orange-500 transition-colors group-hover/achievement:text-orange-400" />
                                    <span
                                      className={`${getTextColor("primary")} group-hover/achievement:${getTextColor(
                                        "primary"
                                      )} leading-relaxed transition-colors`}
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
          ))}
        </div>
      </div>
    </section>
  );
}
