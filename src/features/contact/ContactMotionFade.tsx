"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { pageEnterTransition } from "@/lib/animations";

type ContactMotionFadeProps = {
  delay: number;
  className?: string;
  children: ReactNode;
  /** Default `div`; use `p` for introductory copy semantics */
  as?: "div" | "p";
};

export function ContactMotionFade({ delay, className = "", children, as = "div" }: ContactMotionFadeProps) {
  const prefersReducedMotion = useReducedMotion();
  const initial = prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 };
  const transition = pageEnterTransition(prefersReducedMotion, { delay });

  if (as === "p") {
    return (
      <motion.p className={className} initial={initial} animate={{ opacity: 1, y: 0 }} transition={transition}>
        {children}
      </motion.p>
    );
  }

  return (
    <motion.div className={className} initial={initial} animate={{ opacity: 1, y: 0 }} transition={transition}>
      {children}
    </motion.div>
  );
}
