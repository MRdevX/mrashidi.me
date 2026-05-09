"use client";

import type { Variants } from "framer-motion";
import type { ComponentProps, ReactNode } from "react";
import { MotionSection, SectionHeader } from "@/components/ui";
import { cn } from "@/lib/utils";

type SectionIconName = ComponentProps<typeof SectionHeader>["iconName"];

type HomeMarkedSectionProps = {
  variants: Variants;
  iconName: SectionIconName;
  title: string;
  /** Default `mb-16` matches historical homepage spacing between blocks */
  sectionClassName?: string;
  children: ReactNode;
};

export function HomeMarkedSection({
  variants,
  iconName,
  title,
  sectionClassName = "mb-16",
  children,
}: HomeMarkedSectionProps) {
  return (
    <MotionSection className={cn(sectionClassName)} variants={variants}>
      <SectionHeader iconName={iconName} title={title} size="sm" className="justify-center" />
      {children}
    </MotionSection>
  );
}
