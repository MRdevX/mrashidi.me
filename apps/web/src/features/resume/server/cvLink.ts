import { createHmac, timingSafeEqual } from "node:crypto";
import { SITE_URL } from "@/data";
import { getRequiredEnv } from "@/lib/core";

export const CV_LINK_TTL_MS = 24 * 60 * 60 * 1000;

export type CvTokenCheck = { ok: true } | { ok: false; reason: "expired" | "invalid" };

function sign(expiresAt: string): string {
  return createHmac("sha256", getRequiredEnv("CV_LINK_SECRET")).update(`cv:${expiresAt}`).digest("base64url");
}

export function createCvToken(now: number): string {
  const expiresAt = String(now + CV_LINK_TTL_MS);
  return `${expiresAt}.${sign(expiresAt)}`;
}

export function createCvLink(now: number): string {
  const url = new URL("/api/cv/download", SITE_URL);
  url.searchParams.set("token", createCvToken(now));
  return url.toString();
}

export function verifyCvToken(token: string | null, now: number): CvTokenCheck {
  const [expiresAt, signature, ...rest] = token?.split(".") ?? [];
  if (!expiresAt || !signature || rest.length > 0 || !/^\d+$/.test(expiresAt)) {
    return { ok: false, reason: "invalid" };
  }

  const expected = Buffer.from(sign(expiresAt));
  const provided = Buffer.from(signature);
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) {
    return { ok: false, reason: "invalid" };
  }

  return Number(expiresAt) < now ? { ok: false, reason: "expired" } : { ok: true };
}
