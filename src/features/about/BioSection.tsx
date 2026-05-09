"use client";

import { ABOUT_BIO_PIECES, type AboutBioStyle } from "@/data/profile/aboutBio";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { cn } from "@/lib/utils";
import { AboutSection } from "./AboutSection";
import { ProfileImage } from "./ProfileImage";

const bioStyleClasses: Record<AboutBioStyle, string> = {
  prominent: "font-semibold tracking-tight text-foreground",
  subtle: "italic text-muted-foreground",
  brand: "font-medium text-orange-600 dark:text-orange-400",
};

export function BioSection() {
  const { getTextColor } = useThemeConfig();

  return (
    <AboutSection delay={0.2}>
      <div className="relative">
        <ProfileImage src="/profile.jpeg" alt="Mahdi Rashidi" />
        <p
          className={cn(
            "max-w-prose text-balance font-albert text-lg leading-relaxed lg:leading-[1.7]",
            "text-left",
            getTextColor("secondary")
          )}
        >
          {ABOUT_BIO_PIECES.map(({ id, text, style }) => (
            <span key={id} className={style ? bioStyleClasses[style] : undefined}>
              {text}
            </span>
          ))}
        </p>
      </div>
    </AboutSection>
  );
}
