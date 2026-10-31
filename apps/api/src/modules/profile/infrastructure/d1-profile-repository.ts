import { AboutSchema, ProfileSchema } from "@mrashidi/types";
import type { Db } from "#db/index.ts";
import { readSection } from "#db/sections.ts";
import type { ProfileRepository } from "../application/ports.ts";

export function createD1ProfileRepository(db: Db): ProfileRepository {
  return {
    getProfile: () => readSection(db, "profile", ProfileSchema),
    getAbout: () => readSection(db, "about", AboutSchema),
  };
}
