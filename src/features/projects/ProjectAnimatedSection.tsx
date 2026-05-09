"use client";

import type { ComponentProps } from "react";
import { PageEnterMotion } from "@/components/ui/PageEnterMotion";

type ProjectAnimatedSectionProps = Omit<ComponentProps<typeof PageEnterMotion>, "as">;

export function ProjectAnimatedSection(props: ProjectAnimatedSectionProps) {
  return <PageEnterMotion {...props} />;
}
