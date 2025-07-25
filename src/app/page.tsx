"use client";

import { motion } from "framer-motion";
import { useEffect, useState, Suspense, lazy } from "react";
import Link from "next/link";
import LoadingAnimation from "@/components/ui/LoadingAnimation";
import { skillCategories } from "@/components/skills/skillsData";
import personalInfo from "@/data/personalInfo";
import techIconMap, { getTechIcon } from "@/lib/techIconMap";

const ContributionGraph = lazy(() => import("@/components/ui/ContributionGraph"));
const Terminal = lazy(() => import("@/components/terminal/Terminal"));

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (!mounted) return null;

  const mainStack: { name: string; iconKey: string }[] = [];
  skillCategories.forEach((cat) => {
    cat.skills.forEach((skill) => {
      if ((skill.level === "expert" || skill.level === "proficient") && !skill.excludeFromMainStack) {
        let iconKey = skill.name
          .toLowerCase()
          .replace(/\s*\(.*\)/, "")
          .replace(/\./g, "")
          .replace(/\s+/g, "")
          .replace(/\+/, "p")
          .replace(/#/, "sharp");
        if (iconKey.includes("azure")) iconKey = "azure";
        if (iconKey === "aws") iconKey = "aws";
        if (techIconMap[iconKey]) {
          mainStack.push({ name: skill.name, iconKey });
        }
      }
    });
  });
  const uniqueMainStack = Array.from(new Map(mainStack.map((item) => [item.name, item])).values());

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-gray-900 to-black">
      <motion.div className="max-w-4xl mx-auto px-4" initial="hidden" animate="show" variants={container}>
        <motion.div className="text-center mb-12 glass-card p-8 relative overflow-hidden" variants={item}>
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent opacity-50" />
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-300 font-cyberpunk glow-text relative z-10">
            {personalInfo.name}
          </h1>
          <p className="text-2xl text-gray-300 mb-3 font-terminal relative z-10">{personalInfo.title}</p>
          <p className="text-lg text-gray-400 mb-6 relative z-10 max-w-2xl mx-auto">{personalInfo.intro}</p>
          <p className="text-lg text-gray-400 mb-8 relative z-10 flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {personalInfo.location}
          </p>

          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <motion.a
              href={`mailto:${personalInfo.email}`}
              className="neon-button text-sm px-4 py-2 w-full sm:w-auto text-center rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-4 h-4 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Email
            </motion.a>
            <motion.a
              href={personalInfo.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="neon-button text-sm px-4 py-2 w-full sm:w-auto text-center rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-4 h-4 inline-block mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </motion.a>
            <motion.a
              href={personalInfo.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="neon-button text-sm px-4 py-2 w-full sm:w-auto text-center rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-4 h-4 inline-block mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              LinkedIn
            </motion.a>
          </div>

          <div className="scanline absolute inset-0 pointer-events-none" />
        </motion.div>

        <motion.div className="mb-16" variants={item}>
          <h2 className="text-2xl font-bold mb-6 text-center text-orange-500 font-cyberpunk glow-text">
            Interact with Terminal
          </h2>
          <Suspense
            fallback={
              <div className="terminal-window w-full h-96 glass-card border border-orange-500/20 overflow-hidden rounded-lg flex items-center justify-center">
                <LoadingAnimation text="Loading terminal..." color="green" />
              </div>
            }
          >
            <Terminal />
          </Suspense>
        </motion.div>

        <motion.div className="mb-16" variants={item}>
          <h2 className="text-2xl font-bold mb-8 text-center text-orange-500 font-cyberpunk glow-text">My Tech Stack</h2>
          <div className="glass-card p-8 flex flex-col items-center border border-orange-500/20 shadow-lg rounded-lg">
            <div className="flex flex-wrap justify-center gap-6">
              {uniqueMainStack.map((tech) => {
                const { Icon, colorClass } = getTechIcon(tech.iconKey);
                return (
                  <div
                    key={tech.name}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg bg-black/30 border border-orange-500/10 shadow hover:shadow-orange-500/20 transition-all min-w-[90px]"
                  >
                    <Icon className={`w-10 h-10 ${colorClass}`} />
                    <span className="text-xs text-gray-200 font-mono text-center mt-1">{tech.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div className="mb-16" variants={item}>
          <h2 className="text-2xl font-bold mb-6 text-center text-orange-500 font-cyberpunk glow-text">GitHub Activity</h2>
          <motion.div variants={item} className="w-full overflow-x-auto pb-4">
            <Suspense
              fallback={
                <div className="glass-card p-6 flex justify-center items-center" style={{ minHeight: "240px" }}>
                  <LoadingAnimation text="Loading GitHub activity..." />
                </div>
              }
            >
              <ContributionGraph />
            </Suspense>
          </motion.div>
        </motion.div>

        <motion.div className="text-center" variants={item}>
          <div className="glass-card p-8 md:p-12 border border-orange-500/10 relative overflow-hidden group rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h2 className="text-2xl md:text-3xl font-bold text-orange-500 font-cyberpunk glow-text mb-6">
              {personalInfo.contactCta}
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">{personalInfo.contactDescription}</p>
            <Link href="/contact" className="neon-button px-8 py-3 text-lg inline-flex items-center gap-2 group rounded-lg">
              <span>Get In Touch</span>
              <svg
                className="w-5 h-5 transform transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
