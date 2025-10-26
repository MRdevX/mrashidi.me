"use client";

import { useMouse } from "@uidotdev/usehooks";
import { useEffect } from "react";

export const useMouseTracking = (selector: string) => {
  const [mousePosition] = useMouse();

  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
      const rect = element.getBoundingClientRect();
      const relativeX = (mousePosition.x || 0) - rect.left;
      const relativeY = (mousePosition.y || 0) - rect.top;
      (element as HTMLElement).style.setProperty("--mouse-x", `${relativeX}px`);
      (element as HTMLElement).style.setProperty("--mouse-y", `${relativeY}px`);
    }
  }, [mousePosition.x, mousePosition.y, selector]);
};
