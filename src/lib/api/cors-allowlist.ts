/**
 * Builds the set of browser Origins allowed for `Access-Control-Allow-Origin` reflection.
 */

import { env, isDevelopment, isProduction } from "@/lib/core";
import { logger } from "@/lib/core/logger";

/** Parses `CORS_ALLOWED_ORIGINS`; trims; drops empties; returns validated canonical origins. */
export function parseCommaSeparatedOrigins(csv: string | undefined): string[] {
  if (!csv?.trim()) {
    return [];
  }
  const origins: string[] = [];
  for (const chunk of csv.split(",")) {
    const raw = chunk.trim();
    if (!raw) {
      continue;
    }
    if (!raw.includes("://")) {
      logger.warn({ cors: true }, "CORS_ALLOWED_ORIGINS entries must include a scheme (e.g. https://example.com)");
      continue;
    }
    const origin = canonicalOrigin(raw);
    if (origin) {
      origins.push(origin);
    } else {
      logger.warn({ cors: true, invalidOrigin: raw }, "Skipping invalid CORS_ALLOWED_ORIGINS entry");
    }
  }
  return origins;
}

/** Canonical `scheme://host[:port]` for URL strings. */
export function canonicalOrigin(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  try {
    return new URL(trimmed).origin;
  } catch {
    return null;
  }
}

function vercelPreviewOrigins(): string[] {
  if (process.env.VERCEL !== "1") {
    return [];
  }
  const out: string[] = [];
  const host = process.env.VERCEL_URL;
  if (host) {
    const o = canonicalOrigin(`https://${host}`);
    if (o) {
      out.push(o);
    }
  }
  const branch = process.env.VERCEL_BRANCH_URL;
  if (branch) {
    const o = canonicalOrigin(branch.includes("://") ? branch : `https://${branch}`);
    if (o) {
      out.push(o);
    }
  }
  return out;
}

function devOrigins(): string[] {
  if (!isDevelopment) {
    return [];
  }
  return ["http://localhost:3000", "http://127.0.0.1:3000"];
}

export function computeCorsAllowedOrigins(config: {
  nextPublicSiteUrl: string | undefined;
  corsAllowedOriginsCsv: string | undefined;
}): ReadonlySet<string> {
  const set = new Set<string>();

  for (const o of parseCommaSeparatedOrigins(config.corsAllowedOriginsCsv)) {
    set.add(o);
  }

  if (config.nextPublicSiteUrl?.trim()) {
    const siteOrigin = canonicalOrigin(config.nextPublicSiteUrl.trim());
    if (siteOrigin) {
      set.add(siteOrigin);
    }
  }

  for (const o of vercelPreviewOrigins()) {
    set.add(o);
  }

  for (const o of devOrigins()) {
    set.add(o);
  }

  return set;
}

export function reflectOriginAgainstAllowlist(
  requestOriginHeader: string | null,
  allowedOrigins: ReadonlySet<string>
): string | null {
  if (!requestOriginHeader?.trim()) {
    return null;
  }

  const requestCanon = canonicalOrigin(requestOriginHeader.trim());
  if (!requestCanon || !allowedOrigins.has(requestCanon)) {
    return null;
  }

  return requestCanon;
}

/** Avoid spamming multi-worker build logs when NEXT_PUBLIC_SITE_URL is injected only at runtime deploy. */
function isNextProductionBuildPhase(): boolean {
  return process.env.NEXT_PHASE === "phase-production-build";
}

const corsAllowedOriginsGlobal = computeCorsAllowedOrigins({
  nextPublicSiteUrl: env.NEXT_PUBLIC_SITE_URL,
  corsAllowedOriginsCsv: env.CORS_ALLOWED_ORIGINS,
});

if (isProduction && !isNextProductionBuildPhase()) {
  if (corsAllowedOriginsGlobal.size === 0) {
    logger.error(
      { cors: true },
      "CORS allowlist is empty in production — cross-origin `/api/blog` requests will lack ACAO unless Origins exist. Set NEXT_PUBLIC_SITE_URL and/or CORS_ALLOWED_ORIGINS."
    );
  }

  if (!env.NEXT_PUBLIC_SITE_URL?.trim()) {
    logger.warn(
      { cors: true },
      "NEXT_PUBLIC_SITE_URL is unset in production — set it to your canonical site origin so CORS matches the real domain."
    );
  }
}

export function reflectedCorsOrigin(requestOriginHeader: string | null): string | null {
  return reflectOriginAgainstAllowlist(requestOriginHeader, corsAllowedOriginsGlobal);
}
