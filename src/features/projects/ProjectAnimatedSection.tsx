"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { pageEnterTransition } from "@/lib/animations";
import { cn } from "@/lib/utils";

type ProjectAnimatedSectionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Search row fades in from 0 opacity; filters use full opacity start + vertical motion only */
  startOpaque?: boolean;
};

export function ProjectAnimatedSection({
  children,
  className,
  delay = 0,
  startOpaque = true,
}: ProjectAnimatedSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const initial = prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: startOpaque ? 1 : 0, y: 16 };

  return (
    <motion.div
      className={cn(className)}
      initial={initial}
      animate={{ opacity: 1, y: 0 }}
      transition={pageEnterTransition(prefersReducedMotion, { delay })}
    >
      {children}
    </motion.div>
  );
}
