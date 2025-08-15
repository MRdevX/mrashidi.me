import * as React from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Building2, ChevronRight } from "lucide-react";
import { CyberpunkCard, CyberpunkCardHeader, CyberpunkCardTitle, CyberpunkCardContent } from "./CyberpunkCard";
import { CyberpunkBadge } from "./CyberpunkBadge";
import { cn } from "@/lib/utils";

interface TimelineItem {
  title: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  technologies?: string[];
}

interface CyberpunkTimelineProps {
  items: TimelineItem[];
  className?: string;
}

export const CyberpunkTimeline = React.forwardRef<HTMLDivElement, CyberpunkTimelineProps>(({ items, className }, ref) => {
  return (
    <div ref={ref} className={cn("relative py-8", className)}>
      {/* Timeline line */}
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500/50 via-orange-500/30 to-transparent transform -translate-x-1/2" />

      <div className="space-y-8">
        {items.map((item, index) => (
          <motion.div
            key={`${item.company}-${item.title}`}
            className={cn("relative", index % 2 === 0 ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8", "w-full md:w-1/2")}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            {/* Timeline dot */}
            <div className="absolute left-8 md:left-1/2 top-6 w-4 h-4 bg-orange-500 rounded-full shadow-lg shadow-orange-500/50 transform -translate-x-1/2 z-10">
              <div className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-20" />
            </div>

            {/* Content card */}
            <div className="ml-16 md:ml-0">
              <CyberpunkCard
                variant="feature"
                hover
                className="relative overflow-hidden border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 group"
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <CyberpunkCardHeader className="pb-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <CyberpunkCardTitle className="text-xl md:text-2xl mb-2 group-hover:text-orange-400 transition-colors">
                        {item.title}
                      </CyberpunkCardTitle>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-orange-500/80">
                          <Building2 className="w-4 h-4" />
                          <span className="font-medium">{item.company}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span>{item.location}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{item.period}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <CyberpunkBadge variant="neon" className="text-xs">
                        {item.period.split("–")[1]?.trim() || "Present"}
                      </CyberpunkBadge>

                      <ChevronRight className="w-4 h-4 text-orange-500/60 group-hover:text-orange-400 transition-colors" />
                    </div>
                  </div>
                </CyberpunkCardHeader>

                <CyberpunkCardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Description */}
                    <div>
                      <ul className="space-y-2">
                        {item.description.map((desc, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-start gap-2 text-gray-300 group-hover:text-gray-200 transition-colors"
                          >
                            <span className="text-orange-500 mt-1.5">•</span>
                            <span className="leading-relaxed">{desc}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies */}
                    {item.technologies && item.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {item.technologies.map((tech, i) => (
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
                    )}
                  </div>
                </CyberpunkCardContent>
              </CyberpunkCard>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

CyberpunkTimeline.displayName = "CyberpunkTimeline";
