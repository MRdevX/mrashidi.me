import { cacheControl } from "./cache-control.ts";

export const publicCache = cacheControl("public, max-age=60, s-maxage=300, stale-while-revalidate=86400");
