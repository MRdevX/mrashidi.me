"use client";

import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { SocialButtonsRow } from "@/components/ui";
import { TypingAnimation } from "@/components/ui/TypingAnimation";
import { config } from "@/data";
import { isAskMrEnabled } from "@/features/ask-mr";

type HomeHeroProps = {
  variants: Variants;
};

export function HomeHero({ variants }: HomeHeroProps) {
  return (
    <motion.div className="hero-section content-section relative overflow-hidden" variants={variants}>
      <div className="hero-background" />
      <div className="hero-gradient-bg absolute inset-0 animate-gradient-shift bg-gradient-to-br from-orange-500/10 via-transparent to-orange-400/5" />
      <div className="relative z-10">
        <h1 className="cyberpunk-h1">{config.person.name}</h1>
        <p className="hero-subtitle text-body">
          <TypingAnimation
            strings={[
              config.person.title,
              "Cloud Practitioner",
              "Node.js & TypeScript Specialist",
              "Open Source Contributor",
            ]}
            typeSpeed={80}
            deleteSpeed={40}
            pauseAtEnd={1500}
            className="font-terminal text-orange-400"
          />
        </p>
        <p className="hero-description text-body">{config.site.description}</p>
        <p className="hero-location text-body">
          <MapPin className="icon-primary size-5" aria-hidden />
          {config.person.location}
        </p>

        <SocialButtonsRow />
        {isAskMrEnabled() && (
          <a
            href="#ask"
            className="mt-5 inline-block font-terminal text-sm text-gray-600 transition-colors hover:text-orange-500 dark:text-gray-400"
          >
            › or ask the terminal anything ↓
          </a>
        )}
      </div>
    </motion.div>
  );
}
