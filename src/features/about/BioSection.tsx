"use client";

import { personalInfo } from "@/data";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { AboutSection } from "./AboutSection";
import { ProfileImage } from "./ProfileImage";

export function BioSection() {
  const { getTextColor } = useThemeConfig();

  return (
    <AboutSection delay={0.2}>
      <div className="relative">
        <ProfileImage src="/profile.jpeg" alt="Mahdi Rashidi" />
        <p className={`text-justify font-albert text-lg leading-relaxed ${getTextColor("secondary")}`}>
          {personalInfo.bio}
        </p>
      </div>
    </AboutSection>
  );
}
