import { AnimatedSection } from "@/components/ui";
import { personalInfo } from "@/data";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { ProfileImage } from "./ProfileImage";

export function BioSection() {
  const { getTextColor } = useThemeConfig();

  return (
    <AnimatedSection delay={0.2}>
      <div className="relative">
        <ProfileImage src="/profile.jpeg" alt="Mahdi Rashidi" />
        <p className={`text-lg leading-relaxed ${getTextColor("secondary")} font-albert text-justify`}>
          {personalInfo.bio}
        </p>
      </div>
    </AnimatedSection>
  );
}
