"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Building2, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { CyberpunkCard, CyberpunkCardHeader, CyberpunkCardTitle, CyberpunkCardContent } from "./CyberpunkCard";
import { CyberpunkBadge } from "./CyberpunkBadge";
import { cn } from "@/lib/utils";

interface ExperienceCardProps {
  title: string;
  company: string;
  location: string;
  period: string;
  achievements: string[];
  technologies?: string[];
  className?: string;
  index?: number;
}

export const CyberpunkExperienceCard = React.forwardRef<HTMLDivElement, ExperienceCardProps>(
  ({ title, company, location, period, achievements, technologies, className, index = 0 }, ref) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        className={cn("group", className)}
      >
        <CyberpunkCard
          variant="feature"
          hover
          className="relative overflow-hidden border-orange-500/30 hover:border-orange-500/50 transition-all duration-300"
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-linear-to-r from-orange-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <CyberpunkCardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <CyberpunkCardTitle className="text-xl md:text-2xl mb-2 group-hover:text-orange-400 transition-colors">
                  {title}
                </CyberpunkCardTitle>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-orange-500/80">
                    <Building2 className="w-4 h-4" />
                    <span className="font-medium">{company}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{period}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CyberpunkBadge variant="neon" className="text-xs">
                  {period.split("–")[1]?.trim() || "Present"}
                </CyberpunkBadge>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                  className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800/80 border border-gray-600/50 hover:border-orange-500/50 transition-all duration-300 z-10 relative"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-orange-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-orange-500" />
                  )}
                </button>
              </div>
            </div>
          </CyberpunkCardHeader>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <CyberpunkCardContent className="pt-0">
                  <div className="space-y-6">
                    {/* Achievements Section */}
                    <div>
                      <h4 className="text-lg font-semibold text-orange-500 mb-3 font-cyberpunk">Key Achievements</h4>
                      <ul className="space-y-3">
                        {achievements.map((achievement, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-start gap-3 group/achievement"
                          >
                            <CheckCircle2 className="w-5 h-5 text-orange-500 mt-0.5 shrink-0 group-hover/achievement:text-orange-400 transition-colors" />
                            <span className="text-gray-300 group-hover/achievement:text-gray-200 transition-colors leading-relaxed">
                              {achievement}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies Section */}
                    {technologies && technologies.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-orange-500 mb-3 font-cyberpunk">Technologies Used</h4>
                        <div className="flex flex-wrap gap-2">
                          {technologies.map((tech, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.05 }}
                            >
                              <CyberpunkBadge variant="tech" className="text-xs">
                                {tech}
                              </CyberpunkBadge>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CyberpunkCardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </CyberpunkCard>
      </motion.div>
    );
  }
);

CyberpunkExperienceCard.displayName = "CyberpunkExperienceCard";
