import { Code2 } from "lucide-react";
import { AnimatedSection, SectionHeader } from "@/components/ui";
import { skills } from "@/data";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { getTechIcon } from "@/lib/tech";

const levelConfig = {
  expert: { color: "#9A3412", label: "Expert" },
  proficient: { color: "#EA580C", label: "Proficient" },
  experienced: { color: "#FBBF24", label: "Experienced" },
  familiar: { color: "#FEF9C3", label: "Familiar" },
  unspecified: { color: "#6B7280", label: "Tools & Concepts" },
};

export function SkillsSection() {
  const { getCardPattern, getTextColor, getBackgroundColor, getBorderColor } = useThemeConfig();

  const allSkills = skills.flatMap((cat) => cat.skills.map((skill) => ({ ...skill, category: cat.category })));
  const skillsByLevel = {
    expert: allSkills.filter((skill) => skill.level === "expert"),
    proficient: allSkills.filter((skill) => skill.level === "proficient"),
    experienced: allSkills.filter((skill) => skill.level === "experienced"),
    familiar: allSkills.filter((skill) => skill.level === "familiar"),
    unspecified: allSkills.filter((skill) => !skill.level),
  };

  return (
    <AnimatedSection delay={0.4}>
      <SectionHeader icon={Code2} title="Skills & Technologies" size="sm" />

      <div className="space-y-8">
        {Object.entries(skillsByLevel).map(([level, skills]) => {
          if (skills.length === 0) {
            return null;
          }
          const config = levelConfig[level as keyof typeof levelConfig];

          return (
            <div
              key={level}
              className={`${getCardPattern()} p-6 ${getBackgroundColor("glass")} border ${getBorderColor(
                "primary"
              )} rounded-xl`}
            >
              <div className="flex items-center gap-3 mb-4">
                <h3 className={`text-xl font-bold ${getTextColor("primary")}`} style={{ color: config.color }}>
                  {config.label}
                </h3>
                <span className={`${getTextColor("secondary")} text-sm`}>({skills.length})</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => {
                  const { Icon, colorClass } = getTechIcon(skill.name);

                  return (
                    <span
                      key={`${skill.name}-${skill.category}`}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm ${getBackgroundColor(
                        "muted"
                      )} ${getTextColor("primary")} border ${getBorderColor("secondary")} hover:${getBackgroundColor(
                        "secondary"
                      )} transition-colors`}
                      style={{ boxShadow: `0 0 8px 1px ${config.color}` }}
                      title={skill.name}
                    >
                      <Icon className={`w-4 h-4 ${colorClass}`} />
                      <span>{skill.name}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </AnimatedSection>
  );
}
