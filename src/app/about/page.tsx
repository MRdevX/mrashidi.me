"use client";

import { motion } from "framer-motion";
import personalInfo from "@/data/personalInfo";
import skillCategories from "@/data/skills";
import education from "@/data/education";
import techIconMap, { getTechIcon } from "@/lib/techIconMap";

// Helper to get color class for each icon
const getIconColorClass = (iconKey: string) => {
  switch (iconKey) {
    case "react":
      return "text-cyan-400";
    case "nextjs":
      return "text-black dark:text-white";
    case "tailwindcss":
      return "text-sky-400";
    case "typescript":
      return "text-blue-500";
    case "framermotion":
      return "text-pink-400";
    case "nodejs":
      return "text-green-600";
    case "inquirerjs":
      return "text-gray-400";
    case "azure":
      return "text-blue-500";
    case "kubernetes":
      return "text-blue-400";
    case "nestjs":
      return "text-rose-600";
    case "postgresql":
      return "text-blue-800";
    case "redis":
      return "text-red-500";
    case "mongodb":
      return "text-green-700";
    case "docker":
      return "text-blue-500";
    case "aws":
      return "text-yellow-500";
    case "rabbitmq":
      return "text-orange-500";
    case "websocket":
      return "text-gray-400";
    case "javascript":
      return "text-yellow-400";
    case "java":
      return "text-red-700";
    case "csharp":
      return "text-purple-700";
    case "python":
      return "text-yellow-300";
    case "kotlin":
      return "text-purple-400";
    case "go":
      return "text-cyan-500";
    case "springboot":
      return "text-green-500";
    case "aspnet":
      return "text-blue-700";
    case "django":
      return "text-green-700";
    case "flask":
      return "text-gray-400";
    case "graphql":
      return "text-pink-500";
    case "gcp":
      return "text-blue-400";
    case "terraform":
      return "text-purple-500";
    case "helm":
      return "text-blue-500";
    case "githubactions":
      return "text-blue-500";
    case "mysql":
      return "text-blue-500";
    case "mssql":
      return "text-blue-800";
    case "jest":
      return "text-red-500";
    case "postman":
      return "text-orange-500";
    case "html5":
      return "text-orange-500";
    case "css3":
      return "text-blue-500";
    case "jira":
      return "text-blue-500";
    case "confluence":
      return "text-blue-400";
    case "nx":
      return "text-gray-400";
    case "miro":
      return "text-pink-400";
    case "figma":
      return "text-pink-500";
    case "prometheus":
      return "text-orange-500";
    case "grafana":
      return "text-orange-400";
    case "sentry":
      return "text-orange-500";
    default:
      return "text-gray-400";
  }
};

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {skillCategories.map((cat, index) => (
                <motion.div
                  key={cat.category}
                  className="feature-card group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <h3 className="text-xl font-bold mb-3 text-orange-500 font-cyberpunk glow-text relative z-10">
                    {cat.category}
                  </h3>
                  <ul className="flex flex-wrap gap-2 relative z-10">
                    {cat.skills.map((skill) => {
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
                        <li
                          key={skill.name}
                          className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-800/70 hover:bg-gray-700/80 transition-colors"
                        >
                          <Icon className={`w-5 h-5 ${colorClass}`} />
                          <span className="text-gray-200 font-medium whitespace-nowrap">{skill.name}</span>
                          <span
                            className={
                              skill.level === "expert"
                                ? "px-2 py-0.5 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500 glow-text"
                                : skill.level === "proficient"
                                  ? "px-2 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500 glow-text"
                                  : skill.level === "experienced"
                                    ? "px-2 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500 glow-text"
                                    : skill.level === "familiar"
                                      ? "px-2 py-0.5 rounded-full text-xs font-bold bg-gray-500/20 text-gray-400 border border-gray-500 glow-text"
                                      : ""
                            }
                          >
                            {skill.level ? skill.level.charAt(0).toUpperCase() + skill.level.slice(1) : ""}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
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
