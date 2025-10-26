"use client";

import { useCallback, useEffect, useState } from "react";
import { logger } from "@/lib/core";

export function useCache<T>(key: string, duration: number = 24 * 60 * 60 * 1000) {
  const [cachedData, setCachedData] = useState<{ data: T; timestamp: number } | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const parsed = JSON.parse(stored);
          setCachedData(parsed);
        }
      } catch {}
    }
  }, [key]);

  const loadFromCache = useCallback((): T | null => {
    if (!isClient || !cachedData) {
      return null;
    }

    try {
      if (Date.now() - cachedData.timestamp > duration) {
        setCachedData(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem(key);
        }
        return null;
      }
      return cachedData.data;
    } catch {
      return null;
    }
  }, [cachedData, duration, key, isClient]);

  const saveToCache = useCallback(
    (data: T) => {
      if (!isClient) {
        return;
      }

      try {
        const cacheData = { data, timestamp: Date.now() };
        setCachedData(cacheData);
        if (typeof window !== "undefined") {
          localStorage.setItem(key, JSON.stringify(cacheData));
        }
      } catch (error) {
        logger.warn({ operation: "useCache", action: "saving", key, error: String(error) });
      }
    },
    [key, isClient]
  );

  return { loadFromCache, saveToCache };
}
