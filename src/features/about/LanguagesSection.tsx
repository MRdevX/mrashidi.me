import { motion } from "framer-motion";
import { Languages } from "lucide-react";
import { personalInfo } from "@/data";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { slideInVariants } from "@/lib/animations";
import { AnimatedSection, SectionHeader } from "@/components/ui";

export function LanguagesSection() {
  const { getCardPattern, getTextColor, getBackgroundColor } = useThemeConfig();

  return (
    <AnimatedSection delay={0.8}>
      <SectionHeader icon={Languages} title="Languages" size="sm" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {personalInfo.languages.map((lang, index) => (
          <motion.div
            key={lang.language}
            className={getCardPattern()}
            variants={slideInVariants}
            transition={{ delay: 1 + index * 0.1 }}
          >
            <div className="flex justify-between mb-2">
              <span className={`font-semibold text-orange-500 group-hover:text-orange-400 transition-colors`}>
                {lang.language}
              </span>
              <span className={`${getTextColor("secondary")} group-hover:${getTextColor("primary")} transition-colors`}>
                {lang.level}
              </span>
            </div>
            <div className={`w-full ${getBackgroundColor("muted")} rounded-full h-2.5`}>
              <motion.div
                className="bg-orange-500 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${lang.progress}%` }}
                transition={{ duration: 1, delay: 1.2 + index * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  );
}
