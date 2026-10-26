"use client";

import type { ReactNode } from "react";
import { PageSection } from "@/components/ui";
import { cn } from "@/lib/utils";

type ContactSectionShellProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  delay?: number;
};

export function ContactSectionShell({ children, className = "", innerClassName, delay = 0 }: ContactSectionShellProps) {
  return (
    <PageSection delay={delay} className={className}>
      <div className={cn("content-section", innerClassName)}>{children}</div>
    </PageSection>
  );
}
