import type { About, Profile } from "@mrashidi/types";

export interface ProfileRepository {
  getProfile(): Promise<Profile | null>;
  getAbout(): Promise<About | null>;
}
