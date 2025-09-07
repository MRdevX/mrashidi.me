"use client";

import { useState } from "react";
import { logger } from "@/lib/core";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      logger.error({
        operation: "useLocalStorage",
        action: "reading",
        key,
        error: error instanceof Error ? error.message : String(error),
      });
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      logger.error({
        operation: "useLocalStorage",
        action: "setting",
        key,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  return [storedValue, setValue] as const;
}
