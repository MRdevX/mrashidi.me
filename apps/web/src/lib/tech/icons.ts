import { ICON_ALIASES } from "./iconAliases";
import { ICON_DEFINITIONS, type IconDefinition } from "./iconDefinitions";

function findKey(candidates: string[], table: Record<string, string | IconDefinition>): string | undefined {
  return candidates.find((candidate) => candidate && table[candidate]);
}

function resolveIconKey(techName: string): string {
  const normalized = techName.toLowerCase().trim();
  const compact = normalized.replace(/[.\s/]+/g, "");
  const words = normalized.split(/[\s./]+/);

  const definitionKey = findKey([normalized, normalized.replace(/\s+/g, ""), compact, ...words], ICON_DEFINITIONS);
  if (definitionKey) {
    return definitionKey;
  }

  const aliasKey = findKey([normalized, ...words], ICON_ALIASES);
  return aliasKey ? ICON_ALIASES[aliasKey] : compact;
}

export function getTechIcon(techName: string): IconDefinition {
  return ICON_DEFINITIONS[resolveIconKey(techName)] || ICON_DEFINITIONS.default;
}
