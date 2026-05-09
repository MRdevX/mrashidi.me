"use client";

import { useThemeConfig } from "@/hooks/useThemeConfig";
import { ContactFormGate } from "./ContactFormGate";
import { ContactMotionFade } from "./ContactMotionFade";

interface ContactHeaderProps {
  description: string;
}

export function ContactHeader({ description }: ContactHeaderProps) {
  const { getTextColor } = useThemeConfig();

  return (
    <div className="space-y-12">
      <ContactMotionFade as="p" delay={0.18} className={`mb-8 ${getTextColor("secondary")}`}>
        {description}
      </ContactMotionFade>

      <ContactMotionFade delay={0.22}>
        <ContactFormGate />
      </ContactMotionFade>
    </div>
  );
}
