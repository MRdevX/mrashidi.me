"use client";

import type { ReactNode } from "react";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { cn } from "@/lib/utils";

type SurfaceCardProps = {
  children: ReactNode;
  className?: string;
  /** Keep the hover glow but skip the lift/scale; use for tall, text-heavy cards. */
  static?: boolean;
  as?: "div" | "article" | "section";
};

/** Design-system card surface (`feature-card` pattern) for content blocks. */
export function SurfaceCard({ children, className, static: isStatic = false, as: Tag = "div" }: SurfaceCardProps) {
  const { getCardPattern } = useThemeConfig();

  return (
    <Tag className={cn(getCardPattern(), "relative isolate z-0", isStatic && "feature-card--static", className)}>
      {children}
    </Tag>
  );
}
