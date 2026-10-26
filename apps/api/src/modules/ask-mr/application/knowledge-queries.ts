import { ContentNotFoundError } from "#shared/content-not-found-error.ts";
import type { KnowledgeRepository } from "../domain/knowledge-repository.ts";

export function createKnowledgeQueries(repository: KnowledgeRepository) {
  return {
    async knowledge() {
      const knowledge = await repository.getKnowledge();
      if (!knowledge) {
        throw new ContentNotFoundError("Knowledge");
      }
      return knowledge;
    },
  };
}

export type KnowledgeQueries = ReturnType<typeof createKnowledgeQueries>;
