"use client";

import type { ComponentProps, ReactNode } from "react";
import { MotionSection, SectionHeader } from "@/components/ui";

type SectionIconName = ComponentProps<typeof SectionHeader>["iconName"];

type AboutSectionProps = {
  delay: number;
  className?: string;
  /** When both are set, a section header row is rendered above children */
  iconName?: SectionIconName;
  title?: string;
  headerClassName?: string;
  children: ReactNode;
};

export function AboutSection({ delay, className, iconName, title, headerClassName, children }: AboutSectionProps) {
  const showHeader = iconName !== undefined && title !== undefined && title !== "";

  return (
    <MotionSection as="section" delay={delay} className={className}>
      {showHeader ? (
        <SectionHeader iconName={iconName} title={title} size="sm" className={headerClassName ?? ""} />
      ) : null}
      {children}
    </MotionSection>
  );
}
