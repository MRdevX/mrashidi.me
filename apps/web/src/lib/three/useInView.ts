"use client";

import { type RefObject, useEffect, useState, useSyncExternalStore } from "react";

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

export function useInView(ref: RefObject<Element | null>): boolean {
  const [intersecting, setIntersecting] = useState(false);
  const pageVisible = useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === "visible",
    () => false
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setIntersecting(entry?.isIntersecting ?? false));
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return intersecting && pageVisible;
}
