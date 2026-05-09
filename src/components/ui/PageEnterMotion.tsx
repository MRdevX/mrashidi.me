"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { pageEnterTransition } from "@/lib/animations";
import { cn } from "@/lib/utils";

type PageEnterMotionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /**
   * When true (default), motion starts fully opaque — only subtle vertical slide.
   * When false, fades from transparent (projects search row, contact lead-in).
   */
  startOpaque?: boolean;
  as?: "div" | "p";
};

/** Shared slide/fade entrance used across routes (projects blocks, contact lead copy, etc.) */
export function PageEnterMotion({
  children,
  className,
  delay = 0,
  startOpaque = true,
  as = "div",
}: PageEnterMotionProps) {
  const prefersReducedMotion = useReducedMotion();
  const initial = prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: startOpaque ? 1 : 0, y: 16 };
  const transition = pageEnterTransition(prefersReducedMotion, { delay });
  const shared = {
    initial,
    animate: { opacity: 1, y: 0 } as const,
    transition,
    className: cn(className),
    children,
  };

  if (as === "p") {
    return <motion.p {...shared} />;
  }

  return <motion.div {...shared} />;
}
