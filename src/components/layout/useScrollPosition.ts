"use client";

import { useWindowScroll } from "@uidotdev/usehooks";

export const useScrollPosition = (threshold: number = 10) => {
  const [scrollPosition] = useWindowScroll();
  return (scrollPosition.y || 0) > threshold;
};
