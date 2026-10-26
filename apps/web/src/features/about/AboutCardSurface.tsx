"use client";

import type { ReactNode } from "react";
import { SurfaceCard } from "@/components/ui";
import { getThemeConfig } from "@/config/theme.config";
import { cn } from "@/lib/utils";

export function useAboutCardSurface(extraClassName?: string) {
  const { getCardPattern } = getThemeConfig();
  return cn(getCardPattern(), "relative isolate z-0", extraClassName);
}

export function AboutCardSurface({ children, className }: { children: ReactNode; className?: string }) {
  return <SurfaceCard className={className}>{children}</SurfaceCard>;
}
