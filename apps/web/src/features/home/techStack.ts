import type { TieredSkill } from "@mrashidi/types";
import { getTechIcon, type TechStackItem } from "@/lib/tech";

export function normalizeIconKey(skillName: string): string {
  return skillName
    .toLowerCase()
    .replace(/\s*\(.*\)/, "")
    .replace(/\./g, "")
    .replace(/\s+/g, "")
    .replace(/\+/, "p")
    .replace(/#/, "sharp");
}

function iconKeyOf(skillName: string): string {
  const key = normalizeIconKey(skillName);
  return key.includes("azure") ? "azure" : key;
}

export function getMainTechStack(featured: readonly TieredSkill[]): TechStackItem[] {
  return featured
    .map((skill) => ({ name: skill.name, iconKey: iconKeyOf(skill.name) }))
    .filter((item) => getTechIcon(item.iconKey));
}
