"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { cn } from "@/lib/utils";
import { ResumeFilamentDivider } from "./ResumeFilamentDivider";

type ResumeHeadingBlockProps = {
  icon: LucideIcon;
  title: string;
  variant?: "section" | "hero";
  actions?: ReactNode;
  className?: string;
};

export function ResumeHeadingBlock({
  icon: Icon,
  title,
  variant = "section",
  actions,
  className,
}: ResumeHeadingBlockProps) {
  const { getSectionTitle } = useThemeConfig();
  const isHero = variant === "hero";
  const TitleTag = isHero ? "h1" : "h2";
  const titleClassName = isHero
    ? cn("text-3xl font-bold sm:text-4xl", getSectionTitle(), "text-center sm:text-left")
    : getSectionTitle();
  const headerMb = isHero ? "mb-12" : "mb-8";

  const titleRow = (
    <>
      <Icon className="size-8 shrink-0 text-orange-500" aria-hidden />
      <TitleTag className={titleClassName}>{title}</TitleTag>
    </>
  );

  return (
    <header className={cn(headerMb, "space-y-5", className)}>
      {actions ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">{titleRow}</div>
          {actions}
        </div>
      ) : (
        <div className="flex items-center gap-3">{titleRow}</div>
      )}
      <ResumeFilamentDivider />
    </header>
  );
}

type ResumeSubsectionHeadingProps = {
  title: string;
  className?: string;
};

export function ResumeSubsectionHeading({ title, className }: ResumeSubsectionHeadingProps) {
  return (
    <div className={cn("mb-6 space-y-3", className)}>
      <h3 className="text-2xl font-semibold text-orange-500 transition-colors group-hover:text-orange-400">{title}</h3>
      <ResumeFilamentDivider />
    </div>
  );
}
