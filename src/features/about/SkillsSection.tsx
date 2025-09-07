import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import { skills } from "@/data";
import { useThemeConfig } from "@/hooks/useThemeConfig";
import { fadeInVariants } from "@/lib/animations";
import { getTechIcon } from "@/lib/techIconMap";

const levelConfig = {
  expert: { color: "#9A3412", label: "Expert" },
  proficient: { color: "#EA580C", label: "Proficient" },
  experienced: { color: "#FBBF24", label: "Experienced" },
  familiar: { color: "#FEF9C3", label: "Familiar" },
  unspecified: { color: "#6B7280", label: "Tools & Concepts" },
};

export function SkillsSection() {
  const { getSectionHeader, getSectionTitle, getCardPattern, getTextColor, getBackgroundColor, getBorderColor } =
    useThemeConfig();

  const allSkills = skills.flatMap((cat) => cat.skills.map((skill) => ({ ...skill, category: cat.category })));
  const skillsByLevel = {
    expert: allSkills.filter((skill) => skill.level === "expert"),
    proficient: allSkills.filter((skill) => skill.level === "proficient"),
    experienced: allSkills.filter((skill) => skill.level === "experienced"),
    familiar: allSkills.filter((skill) => skill.level === "familiar"),
    unspecified: allSkills.filter((skill) => !skill.level),
  };

  return (
    <motion.section
      className="mb-12"
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
      transition={{ delay: 0.4 }}
    >
      <div className={getSectionHeader()}>
        <Code2 className="w-8 h-8 text-orange-500" />
        <h2 className={getSectionTitle()}>Skills & Technologies</h2>
      </div>

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
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg font-bold text-sm ${getBackgroundColor(
                    "muted"
                  )} ${getTextColor("primary")} border ${getBorderColor("secondary")}`}
                  style={{ boxShadow: `0 0 12px 2px ${config.color}` }}
                >
                  {config.label}
                </span>
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
    </motion.section>
  );
}
