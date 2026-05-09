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
      <div className="flex flex-col gap-8 lg:flex-row-reverse lg:items-start lg:gap-10 xl:gap-14">
        <ProfileImage src="/profile.jpeg" alt="Mahdi Rashidi" className="mx-auto w-fit lg:mx-0 lg:mt-1" />

        <div className="min-w-0 flex-1 lg:min-h-0">
          <p
            className={cn(
              "w-full max-w-prose hyphens-none font-albert text-lg leading-relaxed lg:leading-[1.7]",
              "text-justify [text-align-last:left]",
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
      </div>
    </AboutSection>
  );
}
