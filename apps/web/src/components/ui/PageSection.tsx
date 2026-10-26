"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeInVariants, pageEnterTransition, reducedMotionFadeVariants } from "@/lib/animations";

interface PageSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function PageSection({ children, className = "", delay = 0 }: PageSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? reducedMotionFadeVariants : fadeInVariants;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={pageEnterTransition(prefersReducedMotion, { delay })}
      className={className}
    >
      <div className="page-section">{children}</div>
    </motion.div>
  );
}
