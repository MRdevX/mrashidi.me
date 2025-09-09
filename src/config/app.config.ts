export const APP_CONFIG = {
  name: "MR Portfolio",
  version: "0.1.22",
  description: "Mahdi Rashidi's Personal Portfolio",

  animations: {
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
  },

  layout: {
    maxWidth: "4xl",
    containerPadding: "1rem",
  },

  performance: {
    lazyLoadThreshold: 100,
    imageOptimization: true,
  },
} as const;
