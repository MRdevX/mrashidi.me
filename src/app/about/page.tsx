"use client";

import { motion } from "framer-motion";
import personalInfo from "@/data/personalInfo";
import skillCategories from "@/data/skills";
import education from "@/data/education";
import { getTechIcon } from "@/lib/techIconMap";

export default function About() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Flatten all skills and organize by level
  const allSkills = skillCategories.flatMap((cat) => cat.skills);
  const skillsByLevel = {
    expert: allSkills.filter((skill) => skill.level === "expert"),
    proficient: allSkills.filter((skill) => skill.level === "proficient"),
    experienced: allSkills.filter((skill) => skill.level === "experienced"),
    familiar: allSkills.filter((skill) => skill.level === "familiar"),
    unspecified: allSkills.filter((skill) => !skill.level),
  };

  const levelConfig = {
    expert: { color: "#9A3412", label: "Expert" },
    proficient: { color: "#EA580C", label: "Proficient" },
    experienced: { color: "#FBBF24", label: "Experienced" },
    familiar: { color: "#FEF9C3", label: "Familiar" },
    unspecified: { color: "#6B7280", label: "Tools & Concepts" },
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold mb-8 text-orange-500 font-cyberpunk glow-text">About Me</h1>
        </motion.div>

        <div className="prose dark:prose-invert max-w-none">
          <motion.section className="mb-12" initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.2 }}>
            <p className="text-lg mb-6 leading-relaxed text-gray-300">{personalInfo.summary}</p>
          </motion.section>

          <motion.section className="mb-12" initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.4 }}>
            <h2 className="text-3xl font-bold mb-8 text-orange-500 font-cyberpunk glow-text">Skills & Technologies</h2>

            <div className="space-y-8">
              {Object.entries(skillsByLevel).map(([level, skills]) => {
                if (skills.length === 0) return null;
                const config = levelConfig[level as keyof typeof levelConfig];

                return (
                  <div key={level} className="feature-card p-6 bg-gray-900/70 border border-white/10 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg font-bold text-sm bg-gray-800/80 text-white border border-white/10"
                        style={{ boxShadow: `0 0 12px 2px ${config.color}` }}
                      >
                        {config.label}
                      </span>
                      <span className="text-gray-400 text-sm">({skills.length})</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => {
                        let iconKey = skill.name
                          .toLowerCase()
                          .replace(/\s*\(.*\)/, "")
                          .replace(/\./g, "")
                          .replace(/\s+/g, "")
                          .replace(/\+/, "p")
                          .replace(/#/, "sharp");
                        if (iconKey.includes("azure")) iconKey = "azure";
                        if (iconKey === "aws") iconKey = "aws";
                        const { Icon, colorClass } = getTechIcon(iconKey);

                        return (
                          <span
                            key={skill.name}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm bg-gray-800/60 text-white border border-white/10 hover:bg-gray-800/80 transition-colors"
                            style={{ boxShadow: `0 0 8px 1px ${config.color}` }}
                            title={skill.name}
                          >
                            <Icon className={`w-4 h-4 ${colorClass}`} />
                            <span>{skill.name}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>

          <motion.section className="mb-12" initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.8 }}>
            <h2 className="text-3xl font-bold mb-6 text-orange-500 font-cyberpunk glow-text">Languages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personalInfo.languages.map((lang, index) => (
                <motion.div
                  key={lang.language}
                  className="feature-card group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
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

          <motion.section initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 1.2 }}>
            <h2 className="text-3xl font-bold mb-6 text-orange-500 font-cyberpunk glow-text">Education</h2>
            {education.map((edu) => (
              <div className="feature-card group mb-4" key={edu.degree + edu.institution}>
                <h3 className="text-xl font-bold text-orange-500 group-hover:text-orange-400 transition-colors">
                  {edu.degree}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors mt-2">
                  {edu.institution}, {edu.location}
                </p>
                <p className="text-gray-500 mt-1">{edu.period}</p>
              </div>
            ))}
          </motion.section>
        </div>
      </div>
    </div>
  );
}
