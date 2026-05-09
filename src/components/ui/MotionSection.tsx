"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { fadeInVariants, PAGE_TRANSITION_EASE, reducedMotionFadeVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface MotionSectionProps {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
  /** Self-contained fade-in on a `section` (about pages). Default `div` for staggered page variants. */
  as?: "div" | "section";
}

export function MotionSection({ children, variants, className = "", delay = 0, as = "div" }: MotionSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  if (as === "section") {
    const sectionVariants: Variants = prefersReducedMotion ? reducedMotionFadeVariants : (variants ?? fadeInVariants);
    const transition = prefersReducedMotion
      ? { duration: 0, delay: 0 }
      : { delay, duration: 0.42, ease: PAGE_TRANSITION_EASE };

    return (
      <motion.section
        className={cn("mb-12", className)}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        transition={transition}
      >
        {children}
      </motion.section>
    );
  }

  const transition = prefersReducedMotion ? { duration: 0, delay: 0 } : { delay };

  return (
    <motion.div variants={variants} transition={transition} className={className}>
      {children}
    </motion.div>
  );
}
