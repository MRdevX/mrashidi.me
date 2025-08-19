"use client";

import { useEffect } from "react";

export const useMouseTracking = (selector: string) => {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (element as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
        (element as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [selector]);
};
