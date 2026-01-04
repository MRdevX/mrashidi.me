"use client";

import { useCallback } from "react";
import { logger } from "@/lib/core";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export function useCache<T>(key: string, duration: number = 24 * 60 * 60 * 1000) {
  const loadFromCache = useCallback((): T | null => {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const stored = localStorage.getItem(key);
      if (!stored) {
        return null;
      }

      const entry: CacheEntry<T> = JSON.parse(stored);
      const isExpired = Date.now() - entry.timestamp > duration;

      if (isExpired) {
        localStorage.removeItem(key);
        return null;
      }

      return entry.data;
    } catch (error) {
      logger.warn({ operation: "useCache", action: "loading", key, error: String(error) });
      return null;
    }
  }, [key, duration]);

  const saveToCache = useCallback(
    (data: T) => {
      if (typeof window === "undefined") {
        return;
      }

      try {
        const entry: CacheEntry<T> = { data, timestamp: Date.now() };
        localStorage.setItem(key, JSON.stringify(entry));
      } catch (error) {
        logger.warn({ operation: "useCache", action: "saving", key, error: String(error) });
      }
    },
    [key]
  );

  return { loadFromCache, saveToCache };
}
