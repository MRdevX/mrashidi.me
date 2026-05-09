"use client";

import type { ComponentProps } from "react";
import { PageEnterMotion } from "@/components/ui/PageEnterMotion";

type ContactMotionFadeProps = Omit<ComponentProps<typeof PageEnterMotion>, "startOpaque">;

/** Contact hero copy + form: always fade from zero opacity (opaque slide would feel flat here). */
export function ContactMotionFade(props: ContactMotionFadeProps) {
  return <PageEnterMotion {...props} startOpaque={false} />;
}
