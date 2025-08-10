import { motion } from "framer-motion";
import education from "@/data/education";
import { fadeInVariants } from "@/lib/animations";

export default function EducationSection() {
  return (
    <motion.section initial="hidden" animate="visible" variants={fadeInVariants} transition={{ delay: 1.2 }}>
      <h2 className="text-3xl font-bold mb-6 text-orange-500 font-cyberpunk glow-text">Education</h2>
      {education.map((edu) => (
        <div className="feature-card group mb-4" key={edu.degree + edu.institution}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-orange-500 group-hover:text-orange-400 transition-colors">
                {edu.degree}
              </h3>
              <div
                className={`text-gray-400 group-hover:text-gray-300 transition-colors mt-2 flex items-center relative z-10 ${
                  edu.url ? "cursor-pointer hover:text-orange-400" : ""
                }`}
                onClick={() => edu.url && window.open(edu.url, "_blank")}
              >
                <span>{edu.institution}</span>
                {edu.url && (
                  <svg
                    className="w-4 h-4 ml-2 text-orange-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-400 text-right ml-4">
              <div>{edu.location}</div>
              <div className="text-xs text-gray-500">{edu.period}</div>
            </div>
          </div>
        </div>
      ))}
    </motion.section>
  );
}
