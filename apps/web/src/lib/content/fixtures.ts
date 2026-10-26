import { fixtureContent, fixtureReadModels } from "@mrashidi/types/fixtures";
import type { SiteContent } from "./types";

const { knowledge: _knowledge, ...publicContent } = fixtureContent;

export const fixtureSiteContent: SiteContent = { ...publicContent, ...fixtureReadModels };
