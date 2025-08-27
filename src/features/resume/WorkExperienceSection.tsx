import { motion } from "framer-motion";
import { Briefcase, Building2, Calendar, CheckCircle2, MapPin } from "lucide-react";
import { CyberpunkCard, CyberpunkCardContent, CyberpunkCardHeader, CyberpunkCardTitle } from "@/components/ui";
import { workExperience } from "@/data";
import { useThemeConfig } from "@/hooks/useThemeConfig";

export function WorkExperienceSection() {
  const { getSectionTitle, getTextColor } = useThemeConfig();

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
                  hover
                  className="relative overflow-hidden border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 group"
                >
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-linear-to-r from-orange-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <CyberpunkCardHeader className="pb-4">
                    <div className="flex flex-col gap-4">
                      {/* Header with title and company */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CyberpunkCardTitle className="text-xl md:text-2xl mb-2 group-hover:text-orange-400 transition-colors">
                            {job.title}
                          </CyberpunkCardTitle>

                          <div className="flex items-center gap-2 text-orange-500/80 mb-2">
                            <Building2 className="w-4 h-4" />
                            <span className="font-medium">{job.company}</span>
                          </div>
                        </div>

                        {/* Current job indicator */}
                        {job.period.includes("Present") && (
                          <div className="flex items-center gap-1 text-green-500">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs font-medium">Current</span>
                          </div>
                        )}
                      </div>

                      {/* Location and period */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                        <div className={`flex items-center gap-2 ${getTextColor("secondary")}`}>
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>

                        <div className={`flex items-center gap-2 ${getTextColor("muted")}`}>
                          <Calendar className="w-4 h-4" />
                          <span>{job.period}</span>
                        </div>
                      </div>
                    </div>
                  </CyberpunkCardHeader>

                  {/* Achievements */}
                  <CyberpunkCardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-4 mt-6">
                        <div className="w-1 h-5 bg-linear-to-b from-orange-500 to-orange-600 rounded-full" />
                        <h4 className="text-base font-bold text-orange-400 tracking-wide uppercase">
                          Key Achievements
                        </h4>
                        <div className="flex-1 h-px bg-linear-to-r from-orange-500/30 to-transparent" />
                      </div>
                      <ul className="space-y-3">
                        {job.achievements.map((achievement, index) => (
                          <motion.li
                            key={achievement}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-start gap-3 group/achievement"
                          >
                            <CheckCircle2 className="w-5 h-5 text-orange-500 mt-0.5 shrink-0 group-hover/achievement:text-orange-400 transition-colors" />
                            <span
                              className={`${getTextColor("primary")} group-hover/achievement:${getTextColor(
                                "primary"
                              )} transition-colors leading-relaxed`}
                            >
                              {achievement}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </CyberpunkCardContent>
                </CyberpunkCard>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
