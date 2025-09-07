"use client";

import { useCallback } from "react";
import { logger } from "@/lib/logger";

export function useCache<T>(key: string, duration: number = 24 * 60 * 60 * 1000) {
  const loadFromCache = useCallback((): T | null => {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp > duration) {
        localStorage.removeItem(key);
        return null;
      }
      return parsed.data;
    } catch {
      return null;
    }
  }, [key, duration]);

  const saveToCache = useCallback(
    (data: T) => {
      try {
        localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
      } catch (error) {
        logger.warn({ operation: "useCache", action: "saving", key, error: String(error) });
      }
    },
    [key]
  );

  return { loadFromCache, saveToCache };
}
