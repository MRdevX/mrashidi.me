import { AskMrKnowledgeSchema } from "@mrashidi/types";
import type { Db } from "#db/index.ts";
import { readSection } from "#db/sections.ts";
import type { KnowledgeRepository } from "../application/ports.ts";

export function createD1KnowledgeRepository(db: Db): KnowledgeRepository {
  return {
    getKnowledge: () => readSection(db, "knowledge", AskMrKnowledgeSchema),
  };
}
