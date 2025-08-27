"use client";

import { motion } from "framer-motion";
import { Activity, ArrowRight, Code2, Mail, MapPin, MessageCircle, Send, Terminal as TerminalIcon } from "lucide-react";
import Link from "next/link";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { CyberpunkButton, PageWrapper } from "@/components/ui";
import { LoadingAnimation } from "@/components/ui/LoadingAnimation";
import { personalInfo, skills } from "@/data";
import techIconMap, { getTechIcon } from "@/lib/techIconMap";

const ContributionGraph = lazy(() =>
  import("@/components/ui/ContributionGraph").then((module) => ({
    default: module.ContributionGraph,
  }))
);
const Terminal = lazy(() =>
  import("@/components/terminal/Terminal").then((module) => ({
    default: module.Terminal,
  }))
);

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

  const uniqueMainStack = useMemo(() => {
    const mainStack: { name: string; iconKey: string }[] = [];
    for (const cat of skills) {
      for (const skill of cat.skills) {
        if (skill.includeInMainStack) {
          let iconKey = skill.name
            .toLowerCase()
            .replace(/\s*\(.*\)/, "")
            .replace(/\./g, "")
            .replace(/\s+/g, "")
            .replace(/\+/, "p")
            .replace(/#/, "sharp");
          if (iconKey.includes("azure")) {
            iconKey = "azure";
          }
          if (iconKey === "aws") {
            iconKey = "aws";
          }
          if (techIconMap[iconKey]) {
            mainStack.push({ name: skill.name, iconKey });
          }
        }
      }
    }
    return Array.from(new Map(mainStack.map((item) => [item.name, item])).values());
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <PageWrapper>
      <motion.div initial="hidden" animate="show" variants={container}>
        <motion.div className="text-center mb-12 glass-card p-8 relative overflow-hidden" variants={item}>
          <div className="absolute inset-0 bg-linear-to-b from-orange-500/10 to-transparent opacity-50" />
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-orange-500 to-orange-300 font-cyberpunk glow-text relative z-10">
            {personalInfo.name}
          </h1>
          <p className="text-2xl text-gray-700 dark:text-gray-300 mb-3 font-terminal relative z-10">
            {personalInfo.title}
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 relative z-10 max-w-3xl mx-auto leading-relaxed font-albert">
            {personalInfo.intro}
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 relative z-10 flex items-center justify-center gap-2 font-albert">
            <MapPin className="w-5 h-5 text-orange-500" />
            {personalInfo.location}
          </p>

          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a href={`mailto:${personalInfo.email}`} className="block">
                <CyberpunkButton variant="neon" icon={<Mail className="w-4 h-4" />} className="w-full sm:w-auto">
                  Email
                </CyberpunkButton>
              </a>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a href={personalInfo.social.github} target="_blank" rel="noopener noreferrer" className="block">
                <CyberpunkButton variant="neon" icon={<FaGithub className="w-4 h-4" />} className="w-full sm:w-auto">
                  GitHub
                </CyberpunkButton>
              </a>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a href={personalInfo.social.linkedin} target="_blank" rel="noopener noreferrer" className="block">
                <CyberpunkButton variant="neon" icon={<FaLinkedin className="w-4 h-4" />} className="w-full sm:w-auto">
                  LinkedIn
                </CyberpunkButton>
              </a>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a href={personalInfo.social.telegram} target="_blank" rel="noopener noreferrer" className="block">
                <CyberpunkButton variant="neon" icon={<Send className="w-4 h-4" />} className="w-full sm:w-auto">
                  Telegram
                </CyberpunkButton>
              </a>
            </motion.div>
          </div>

          <div className="scanline absolute inset-0 pointer-events-none" />
        </motion.div>

        <motion.div className="mb-16" variants={item}>
          <div className="flex items-center justify-center gap-3 mb-6">
            <TerminalIcon className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold text-orange-500 font-cyberpunk glow-text">Interact with Terminal</h2>
          </div>
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
          <div className="flex items-center justify-center gap-3 mb-8">
            <Code2 className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold text-orange-500 font-cyberpunk glow-text">My Tech Stack</h2>
          </div>
          <div className="glass-card p-8 flex flex-col items-center border border-orange-500/20 shadow-lg rounded-lg">
            <div className="flex flex-wrap justify-center gap-6">
              {uniqueMainStack.map((tech) => {
                const { Icon, colorClass } = getTechIcon(tech.iconKey);
                return (
                  <div
                    key={tech.name}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/30 dark:bg-black/30 border border-orange-500/10 shadow hover:shadow-orange-500/20 transition-all min-w-[90px]"
                  >
                    <Icon className={`w-10 h-10 ${colorClass}`} />
                    <span className="text-xs text-gray-700 dark:text-gray-200 font-mono text-center mt-1">
                      {tech.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div className="mb-16" variants={item}>
          <div className="flex items-center justify-center gap-3 mb-6">
            <Activity className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold text-orange-500 font-cyberpunk glow-text">GitHub Activity</h2>
          </div>
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
            <div className="absolute inset-0 bg-linear-to-r from-orange-500/10 via-transparent to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex items-center justify-center gap-3 mb-6">
              <MessageCircle className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl md:text-3xl font-bold text-orange-500 font-cyberpunk glow-text">
                {personalInfo.contactCta}
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto font-albert leading-relaxed">
              {personalInfo.contactDescription}
            </p>
            <Link href="/contact" className="block relative z-10">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <CyberpunkButton
                  variant="neon"
                  icon={<ArrowRight className="w-5 h-5" />}
                  iconPosition="right"
                  className="text-lg px-8 py-3"
                >
                  Get In Touch
                </CyberpunkButton>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
}
