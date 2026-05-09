"use client";

import type { Variants } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import {
  pageContainerVariants,
  pageItemVariants,
  reducedMotionPageContainerVariants,
  reducedMotionPageItemVariants,
} from "@/lib/animations";

/** Page-level stagger presets for home/projects style layouts (respects reduced motion). */
export function usePageStaggerVariants(): {
  containerVariants: Variants;
  itemVariants: Variants;
  prefersReducedMotion: boolean | null;
} {
  const prefersReducedMotion = useReducedMotion();
  const containerVariants = prefersReducedMotion ? reducedMotionPageContainerVariants : pageContainerVariants;
  const itemVariants = prefersReducedMotion ? reducedMotionPageItemVariants : pageItemVariants;

  return { containerVariants, itemVariants, prefersReducedMotion };
}
