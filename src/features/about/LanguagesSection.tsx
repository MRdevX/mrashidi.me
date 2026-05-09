"use client";

import { motion } from "framer-motion";
import { personalInfo } from "@/data";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { slideInVariants } from "@/lib/animations";
import { useAboutCardSurface } from "./AboutCardSurface";
import { AboutSection } from "./AboutSection";

export function LanguagesSection() {
  const { getTextColor, getBackgroundColor } = useThemeConfig();
  const cardSurface = useAboutCardSurface();

  return (
    <AboutSection delay={0.8} iconName="Languages" title="Languages">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {personalInfo.languages.map((lang, index) => (
          <motion.div
            key={lang.language}
            className={cardSurface}
            variants={slideInVariants}
            transition={{ delay: 1 + index * 0.1 }}
          >
            <div className="relative z-10">
              <div className="mb-2 flex justify-between">
                <span className="font-semibold text-orange-500 transition-colors group-hover:text-orange-400">
                  {lang.language}
                </span>
                <span
                  className={`${getTextColor("secondary")} group-hover:${getTextColor("primary")} transition-colors`}
                >
                  {lang.level}
                </span>
              </div>
              <div className={`h-2.5 w-full rounded-full ${getBackgroundColor("muted")}`}>
                <motion.div
                  className="h-2.5 rounded-full bg-orange-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${lang.progress}%` }}
                  transition={{ duration: 1, delay: 1.2 + index * 0.1 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </AboutSection>
  );
}
