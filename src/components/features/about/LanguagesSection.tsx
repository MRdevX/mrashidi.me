import { motion } from "framer-motion";
import { Languages } from "lucide-react";
import { personalInfo } from "@/data";
import { fadeInVariants, slideInVariants } from "@/lib/animations";

export function LanguagesSection() {
  return (
    <motion.section
      className="mb-12"
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
      transition={{ delay: 0.8 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Languages className="w-8 h-8 text-orange-500" />
        <h2 className="text-3xl font-bold text-orange-500 font-cyberpunk glow-text">Languages</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {personalInfo.languages.map((lang, index) => (
          <motion.div
            key={lang.language}
            className="feature-card group"
            variants={slideInVariants}
            transition={{ delay: 1 + index * 0.1 }}
          >
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-orange-500 group-hover:text-orange-400 transition-colors">
                {lang.language}
              </span>
              <span className="text-gray-400 group-hover:text-gray-300 transition-colors">{lang.level}</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2.5">
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
    </motion.section>
  );
}
