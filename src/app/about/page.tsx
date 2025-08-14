"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";
import { useMouseTracking } from "@/hooks/useMouseTracking";
import { fadeInVariants } from "@/lib/animations";
import { BioSection, SkillsSection, LanguagesSection, EducationSection } from "@/components/about";

export default function About() {
  useMouseTracking(".glitch-image");

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial="hidden" animate="visible" variants={fadeInVariants} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-8">
            <User className="w-8 h-8 text-orange-500" />
            <h1 className="text-4xl font-bold text-orange-500 font-cyberpunk glow-text">About Me</h1>
          </div>
        </motion.div>

        <div className="prose dark:prose-invert max-w-none">
          <BioSection />
          <SkillsSection />
          <LanguagesSection />
          <EducationSection />
        </div>
      </div>
    </div>
  );
}
