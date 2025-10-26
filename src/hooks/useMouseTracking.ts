"use client";

import { useEffect, useRef } from "react";

export const useMouseTracking = (selector: string) => {
  const selectorRef = useRef(selector);
  const elementsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    selectorRef.current = selector;

    elementsRef.current = Array.from(document.querySelectorAll(selector)) as HTMLElement[];

    const handleMouseMove = (event: MouseEvent) => {
      const elements = elementsRef.current;

      for (const element of elements) {
        const rect = element.getBoundingClientRect();
        const relativeX = event.clientX - rect.left;
        const relativeY = event.clientY - rect.top;

        const currentX = element.style.getPropertyValue("--mouse-x");
        const currentY = element.style.getPropertyValue("--mouse-y");
        const newX = `${relativeX}px`;
        const newY = `${relativeY}px`;

        if (currentX !== newX) {
          element.style.setProperty("--mouse-x", newX);
        }
        if (currentY !== newY) {
          element.style.setProperty("--mouse-y", newY);
        }
      }
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [selector]);

  useEffect(() => {
    elementsRef.current = Array.from(document.querySelectorAll(selectorRef.current)) as HTMLElement[];
  }, []);
};
