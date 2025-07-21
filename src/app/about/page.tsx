"use client";

import { motion } from "framer-motion";
import personalInfo from "@/data/personalInfo";
import skillCategories from "@/data/skills";
import education from "@/data/education";
import { SkillLevel } from "@/data/skills";
import { getTechIcon } from "@/lib/techIconMap";

export default function About() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
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
            <h2 className="text-3xl font-bold mb-8 text-orange-500 font-cyberpunk glow-text">Technical Skills</h2>
            {/* Legend for proficiency levels */}
            <div className="flex flex-wrap gap-4 mb-6">
              <span className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full" style={{ background: "#FF5F1F" }}></span>Expert
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full" style={{ background: "#00CFFF" }}></span>Proficient
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full" style={{ background: "#A259F7" }}></span>Experienced
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full" style={{ background: "#A3A3A3" }}></span>Familiar
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {skillCategories.map((cat) => (
                <div
                  key={cat.category}
                  className="feature-card mb-8 p-6 relative overflow-visible bg-gray-900/40 border border-white/10 backdrop-blur-2xl"
                  style={{ position: "relative" }}
                >
                  {/* Cyberpunk orange accent bar on the left */}
                  <span className="absolute left-0 top-4 bottom-4 w-1 rounded-full bg-[#FF5F1F] opacity-90"></span>
                  <h3 className="text-2xl font-bold mb-5 text-orange-500 font-cyberpunk glow-text pl-4 relative z-10">
                    {cat.category}
                  </h3>
                  <div className="flex flex-wrap gap-3 pl-4 relative z-10">
                    {cat.skills.map((skill) => {
                      let glow = "0 0 0px #0000";
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
                      switch (skill.level as SkillLevel) {
                        case "expert":
                          glow = "0 0 12px 2px #FF5F1F";
                          break;
                        case "proficient":
                          glow = "0 0 12px 2px #00CFFF";
                          break;
                        case "experienced":
                          glow = "0 0 12px 2px #A259F7";
                          break;
                        case "familiar":
                          glow = "0 0 8px 1.5px #A3A3A3";
                          break;
                        default:
                          glow = "0 0 0px #0000";
                      }
                      return (
                        <span
                          key={skill.name}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm bg-gray-900/70 text-white shadow-sm transition-all duration-200 cursor-default backdrop-blur-md border border-white/10`}
                          style={{ boxShadow: glow }}
                          title={skill.name}
                        >
                          <Icon className={`w-5 h-5 ${colorClass}`} />
                          <span>{skill.name}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
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
              <div className="feature-card group mb-4" key={edu.degree + edu.school}>
                <h3 className="text-xl font-bold text-orange-500 group-hover:text-orange-400 transition-colors">
                  {edu.degree}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors mt-2">
                  {edu.school}, {edu.location}
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
