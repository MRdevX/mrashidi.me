import { orNotFound } from "#shared/content-not-found-error.ts";
import type { ProfileRepository } from "./ports.ts";

export function createProfileQueries(repository: ProfileRepository) {
  return {
    async profile() {
      return orNotFound(await repository.getProfile(), "Profile");
    },
    async about() {
      return orNotFound(await repository.getAbout(), "About");
    },
  };
}

export type ProfileQueries = ReturnType<typeof createProfileQueries>;
