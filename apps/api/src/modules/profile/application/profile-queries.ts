import { ContentNotFoundError } from "#shared/content-not-found-error.ts";
import type { ProfileRepository } from "./ports.ts";

export function createProfileQueries(repository: ProfileRepository) {
  return {
    async profile() {
      return (await repository.getProfile()) ?? notFound("Profile");
    },
    async about() {
      return (await repository.getAbout()) ?? notFound("About");
    },
  };
}

function notFound(what: string): never {
  throw new ContentNotFoundError(what);
}

export type ProfileQueries = ReturnType<typeof createProfileQueries>;
