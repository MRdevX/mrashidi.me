"use client";

import type { Variants } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import {
  pageContainerVariants,
  pageItemVariants,
  reducedMotionPageContainerVariants,
  reducedMotionPageItemVariants,
} from "@/lib/animations";

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
