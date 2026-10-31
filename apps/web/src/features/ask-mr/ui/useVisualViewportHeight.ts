"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Visible viewport height, so the mobile composer stays above the on-screen keyboard. */
export function useVisualViewportHeight(enabled: boolean): number | undefined {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const vv = window.visualViewport;
      if (!enabled || !vv) {
        return () => undefined;
      }
      vv.addEventListener("resize", onChange);
      return () => vv.removeEventListener("resize", onChange);
    },
    [enabled]
  );
  return useSyncExternalStore(
    subscribe,
    () => (enabled ? window.visualViewport?.height : undefined),
    () => undefined
  );
}
