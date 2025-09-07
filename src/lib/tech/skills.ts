import { skills } from "@/data";
import { getTechIcon } from "./icons";
import type { TechStackItem } from "./types";

export function normalizeIconKey(skillName: string): string {
  return skillName
    .toLowerCase()
    .replace(/\s*\(.*\)/, "")
    .replace(/\./g, "")
    .replace(/\s+/g, "")
    .replace(/\+/, "p")
    .replace(/#/, "sharp");
}

export function getMainTechStack(): TechStackItem[] {
  const mainStack: TechStackItem[] = [];

  for (const category of skills) {
    for (const skill of category.skills) {
      if (skill.includeInMainStack) {
        let iconKey = normalizeIconKey(skill.name);

        if (iconKey.includes("azure")) {
          iconKey = "azure";
        }
        if (iconKey === "aws") {
          iconKey = "aws";
        }

        if (getTechIcon(iconKey)) {
          mainStack.push({ name: skill.name, iconKey });
        }
      }
    }
  }

  return Array.from(new Map(mainStack.map((item) => [item.name, item])).values());
}
