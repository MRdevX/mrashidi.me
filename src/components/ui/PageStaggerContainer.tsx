"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { usePageStaggerVariants } from "@/hooks/usePageStaggerVariants";

export type PageStaggerRenderProps = {
  itemVariants: Variants;
  prefersReducedMotion: boolean | null;
};

type PageStaggerContainerProps = {
  children: (ctx: PageStaggerRenderProps) => ReactNode;
};

/** Outer stagger + single `usePageStaggerVariants` for home/projects style pages. */
export function PageStaggerContainer({ children }: PageStaggerContainerProps) {
  const { containerVariants, itemVariants, prefersReducedMotion } = usePageStaggerVariants();

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants}>
      {children({ itemVariants, prefersReducedMotion })}
    </motion.div>
  );
}
