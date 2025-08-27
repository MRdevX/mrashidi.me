export const cssAnimations = {
  fadeIn: "animate-fade-in",
  slideUp: "animate-slide-up",
  slideDown: "animate-slide-down",
  scaleIn: "animate-scale-in",
  bounce: "animate-bounce",
  pulse: "animate-pulse",
} as const;

export const animationClasses = {
  fadeIn: "opacity-0 animate-[fadeIn_0.3s_ease-in-out_forwards]",
  slideUp: "opacity-0 translate-y-4 animate-[slideUp_0.3s_ease-out_forwards]",
  slideDown: "opacity-0 -translate-y-4 animate-[slideDown_0.3s_ease-out_forwards]",
  scaleIn: "opacity-0 scale-95 animate-[scaleIn_0.2s_ease-out_forwards]",
  stagger: (delay: number) => `opacity-0 translate-y-4 animate-[slideUp_0.3s_ease-out_${delay}s_forwards]`,
} as const;

export const staggerDelays = {
  fast: 0.1,
  normal: 0.2,
  slow: 0.3,
} as const;

export const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const slideInVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export const scaleVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export const slideInRightVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
};

export const pageContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export const pageItemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};
