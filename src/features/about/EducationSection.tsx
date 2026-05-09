"use client";

import { ExternalLink } from "lucide-react";
import type { Education } from "@/data";
import { education } from "@/data";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { AboutCardSurface } from "./AboutCardSurface";
import { AboutSection } from "./AboutSection";

function InstitutionBlock({ edu }: { edu: Education }) {
  const { getTextColor } = useThemeConfig();
  const secondaryRow = `${getTextColor("secondary")} group-hover:${getTextColor("primary")} transition-colors`;

  return edu.url ? (
    <button
      type="button"
      className={`relative z-10 mt-2 flex cursor-pointer items-center hover:text-orange-400 ${secondaryRow}`}
      onClick={() => window.open(edu.url, "_blank")}
      aria-label={`${edu.institution} (opens in new tab)`}
    >
      <span>{edu.institution}</span>
      <ExternalLink className="ml-2 size-4 shrink-0 text-orange-500" aria-hidden />
    </button>
  ) : (
    <div className={`relative z-10 mt-2 flex items-center ${secondaryRow}`}>
      <span>{edu.institution}</span>
    </div>
  );
}

export function EducationSection() {
  const { getTextColor } = useThemeConfig();

  return (
    <AboutSection delay={1.2} iconName="GraduationCap" title="Education">
      {education.map((edu) => (
        <AboutCardSurface key={edu.degree + edu.institution} className="mb-4">
          <div className="relative z-10 flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-bold text-orange-500 transition-colors group-hover:text-orange-400">
                {edu.degree}
              </h3>
              <InstitutionBlock edu={edu} />
            </div>
            <div className={`ml-4 shrink-0 text-right text-sm ${getTextColor("secondary")}`}>
              <div>{edu.location}</div>
              <div className={`text-xs ${getTextColor("muted")}`}>{edu.period}</div>
            </div>
          </div>
        </AboutCardSurface>
      ))}
    </AboutSection>
  );
}
