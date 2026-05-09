"use client";

import type { ReactNode } from "react";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { cn } from "@/lib/utils";

export function useAboutCardSurface(extraClassName?: string) {
  const { getCardPattern } = useThemeConfig();
  return cn(getCardPattern(), "relative isolate z-0", extraClassName);
}

export function AboutCardSurface({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={useAboutCardSurface(className)}>{children}</div>;
}
