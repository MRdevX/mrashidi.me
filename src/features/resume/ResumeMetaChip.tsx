"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const resumeMetaChipClass =
  "inline-flex w-fit max-w-full shrink-0 items-center gap-2 rounded-md border border-orange-500/15 bg-orange-500/5 px-2.5 py-1.5 text-xs font-medium leading-tight tracking-tight text-foreground dark:border-orange-500/25 dark:bg-orange-500/10 sm:text-sm";

export const resumeMetaChipIconClass = "size-4 shrink-0 text-orange-500/80 dark:text-orange-400/90";

/** Icons in company / location rows under the job title */
export const resumeDetailRowIconClass = "size-4 shrink-0 text-orange-500/70 dark:text-orange-400/85";

type ResumeMetaChipProps = {
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
};

export function ResumeMetaChip({ icon: Icon, children, className }: ResumeMetaChipProps) {
  return (
    <div className={cn(resumeMetaChipClass, className)}>
      <Icon className={resumeMetaChipIconClass} aria-hidden />
      {children}
    </div>
  );
}
