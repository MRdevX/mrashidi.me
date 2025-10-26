"use client";

import { useLocalStorage as useLocalStorageHook } from "@uidotdev/usehooks";
import { logger } from "@/lib/core";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setValue] = useLocalStorageHook(key, initialValue);

  const setValueWithErrorHandling = (value: T | ((val: T) => T)) => {
    try {
      setValue(value);
    } catch (error) {
      logger.error({
        operation: "useLocalStorage",
        action: "setting",
        key,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  return [storedValue, setValueWithErrorHandling] as const;
}
