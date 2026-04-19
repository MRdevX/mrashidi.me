"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { fadeInVariants } from "@/lib/animations";
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
  if (as === "section") {
    return (
      <motion.section
        className={cn("mb-12", className)}
        initial="hidden"
        animate="visible"
        variants={variants ?? fadeInVariants}
        transition={{ delay }}
      >
        {children}
      </motion.section>
    );
  }

  return (
    <motion.div variants={variants} transition={{ duration: 0.5, delay }} className={className}>
      {children}
    </motion.div>
  );
}
