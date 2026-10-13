import type { Variants } from "framer-motion";

/** Comfortable easing for UI entrances (approx. ease-out-expo). */
export const PAGE_TRANSITION_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function pageEnterTransition(
  prefersReducedMotion: boolean | null,
  options?: { delay?: number; duration?: number }
) {
  const delay = options?.delay ?? 0;
  const duration = options?.duration ?? 0.42;
  if (prefersReducedMotion) {
    return { duration: 0, delay: 0 };
  }
  return { duration, delay, ease: PAGE_TRANSITION_EASE };
}

export const fadeInVariants = {
  /** Opacity stays 1 so nested motion + axe color-contrast does not blend fg/bg mid-animation */
  hidden: { opacity: 1, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: PAGE_TRANSITION_EASE },
  },
};

export const reducedMotionFadeVariants: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

export const slideInVariants = {
  hidden: { opacity: 1, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export const slideInRightVariants = {
  hidden: { opacity: 1, x: 20 },
  visible: { opacity: 1, x: 0 },
};

export const pageContainerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.03,
    },
  },
};

/** Stable layout when user prefers reduced motion */
export const reducedMotionPageContainerVariants: Variants = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0 } },
};

export const pageItemVariants = {
  hidden: { opacity: 1, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.44, ease: PAGE_TRANSITION_EASE },
  },
};

export const reducedMotionPageItemVariants: Variants = {
  hidden: { opacity: 1, y: 0 },
  show: { opacity: 1, y: 0 },
};

/** Blog grid: tighter stagger than full-page sections */
export const blogGridContainerVariants: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.065,
      delayChildren: 0.02,
    },
  },
};

export const reducedMotionBlogGridContainerVariants: Variants = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0 } },
};
