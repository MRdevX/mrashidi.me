import type { Profile } from "@mrashidi/types";
import { orNotFound } from "#shared/content-not-found-error.ts";
import type { ProfileRepository } from "./ports.ts";

export function createProfileQueries(repository: ProfileRepository) {
  async function profile() {
    return orNotFound(await repository.getProfile(), "Profile");
  }

  return {
    profile,
    async socialUrl(network: keyof Profile["social"]) {
      return (await profile()).social[network];
    },
    async about() {
      return orNotFound(await repository.getAbout(), "About");
    },
  };
}

export type ProfileQueries = ReturnType<typeof createProfileQueries>;
