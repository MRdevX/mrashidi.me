import { motion } from "framer-motion";
import { GraduationCap, ExternalLink } from "lucide-react";
import { education } from "@/data";
import { fadeInVariants } from "@/lib/animations";

export function EducationSection() {
  return (
    <motion.section initial="hidden" animate="visible" variants={fadeInVariants} transition={{ delay: 1.2 }}>
      <div className="flex items-center gap-3 mb-6">
        <GraduationCap className="w-8 h-8 text-orange-500" />
        <h2 className="text-3xl font-bold text-orange-500 font-cyberpunk glow-text">Education</h2>
      </div>
      {education.map((edu) => (
        <div className="feature-card group mb-4" key={edu.degree + edu.institution}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-orange-500 group-hover:text-orange-400 transition-colors">
                {edu.degree}
              </h3>
              <div
                className={`text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors mt-2 flex items-center relative z-10 ${
                  edu.url ? "cursor-pointer hover:text-orange-400" : ""
                }`}
                onClick={() => edu.url && window.open(edu.url, "_blank")}
              >
                <span>{edu.institution}</span>
                {edu.url && <ExternalLink className="w-4 h-4 ml-2 text-orange-500 shrink-0" />}
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 text-right ml-4">
              <div>{edu.location}</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">{edu.period}</div>
            </div>
          </div>
        </div>
      ))}
    </motion.section>
  );
}
