import type { AskMrKnowledge } from "@mrashidi/types";

export interface KnowledgeRepository {
  getKnowledge(): Promise<AskMrKnowledge | null>;
}
