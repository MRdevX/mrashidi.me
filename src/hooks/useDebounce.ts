"use client";

import { useDebounce as useDebounceHook } from "@uidotdev/usehooks";

export function useDebounce<T>(value: T, delay: number): T {
  return useDebounceHook(value, delay);
}
