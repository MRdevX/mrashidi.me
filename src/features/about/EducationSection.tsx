import { ExternalLink, GraduationCap } from "lucide-react";
import { AnimatedSection, SectionHeader } from "@/components/ui";
import { education } from "@/data";
import { useThemeConfig } from "@/hooks/useThemeConfig";

export function EducationSection() {
  const { getCardPattern, getTextColor } = useThemeConfig();

  return (
    <AnimatedSection delay={1.2}>
      <SectionHeader icon={GraduationCap} title="Education" size="sm" />
      {education.map((edu) => (
        <div className={`${getCardPattern()} mb-4`} key={edu.degree + edu.institution}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-orange-500 group-hover:text-orange-400 transition-colors">
                {edu.degree}
              </h3>
              {edu.url ? (
                <button
                  type="button"
                  className={`${getTextColor("secondary")} group-hover:${getTextColor(
                    "primary"
                  )} transition-colors mt-2 flex items-center relative z-10 cursor-pointer hover:text-orange-400`}
                  onClick={() => window.open(edu.url, "_blank")}
                >
                  <span>{edu.institution}</span>
                  <ExternalLink className="w-4 h-4 ml-2 text-orange-500 shrink-0" />
                </button>
              ) : (
                <div
                  className={`${getTextColor("secondary")} group-hover:${getTextColor(
                    "primary"
                  )} transition-colors mt-2 flex items-center relative z-10`}
                >
                  <span>{edu.institution}</span>
                </div>
              )}
            </div>
            <div className={`text-sm ${getTextColor("secondary")} text-right ml-4`}>
              <div>{edu.location}</div>
              <div className={`text-xs ${getTextColor("muted")}`}>{edu.period}</div>
            </div>
          </div>
        </div>
      ))}
    </AnimatedSection>
  );
}
