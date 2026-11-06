import { Ratelimit } from "@upstash/ratelimit";
import { API_CONFIG, isProduction, logger } from "@/lib/core";
import { APIError } from "@/lib/errors";
import { getRedis } from "@/lib/services/redis";

const { RATE_LIMIT } = API_CONFIG;

const LIMITERS = {
  contactForm: { ...RATE_LIMIT.CONTACT_FORM, prefix: "contact", spends: true },
  resumeRequest: { ...RATE_LIMIT.RESUME_REQUEST, prefix: "resume", spends: true },
  mailRecipient: { ...RATE_LIMIT.MAIL_RECIPIENT, prefix: "mail-recipient", spends: true },
  cvUpload: { ...RATE_LIMIT.CV_UPLOAD, prefix: "cv", spends: false },
  generalApi: { ...RATE_LIMIT.GENERAL_API, prefix: "api", spends: false },
  askMr: { ...RATE_LIMIT.ASK_MR, prefix: "askmr", spends: true },
  askMrDaily: { ...RATE_LIMIT.ASK_MR_DAILY, prefix: "askmr-daily", spends: true },
  askMrFeedback: { ...RATE_LIMIT.ASK_MR_FEEDBACK, prefix: "askmr-feedback", spends: false },
} as const;

export type RateLimiterType = keyof typeof LIMITERS;

type Duration = `${number} ${"s" | "m" | "h" | "d"}`;

interface LimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: Date;
}

const UNIT_MS = { s: 1_000, m: 60_000, h: 3_600_000, d: 86_400_000 } as const;

function windowMs(window: Duration): number {
  const [value, unit] = window.split(" ") as [string, keyof typeof UNIT_MS];
  return Number(value) * UNIT_MS[unit];
}

const inMemoryLimits = new Map<string, { count: number; resetTime: number }>();

function limitInMemory(type: RateLimiterType, identifier: string): LimitResult {
  const { requests, window } = LIMITERS[type];
  const now = Date.now();
  const key = `${type}:${identifier}`;
  const entry = inMemoryLimits.get(key);

  if (!entry || now >= entry.resetTime) {
    const resetTime = now + windowMs(window);
    inMemoryLimits.set(key, { count: 1, resetTime });
    return { success: true, limit: requests, remaining: requests - 1, reset: new Date(resetTime) };
  }

  if (entry.count >= requests) {
    return { success: false, limit: requests, remaining: 0, reset: new Date(entry.resetTime) };
  }

  entry.count++;
  return { success: true, limit: requests, remaining: requests - entry.count, reset: new Date(entry.resetTime) };
}

const redis = getRedis();

const redisLimiters = redis
  ? (Object.fromEntries(
      Object.entries(LIMITERS).map(([type, { requests, window, prefix }]) => [
        type,
        new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(requests, window),
          analytics: true,
          prefix: `ratelimit:${prefix}`,
        }),
      ])
    ) as Record<RateLimiterType, Ratelimit>)
  : null;

if (!redisLimiters) {
  logger.warn("Redis not available, using in-memory rate limiting fallback");
}

// Vercel sets x-real-ip to the connecting address and overwrites any value the client sends.
export function getClientIdentifier(request: Request): string {
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function checkRateLimit(type: RateLimiterType, identifier: string): Promise<LimitResult> {
  if (redisLimiters) {
    const result = await redisLimiters[type].limit(identifier);
    return { success: result.success, limit: result.limit, remaining: result.remaining, reset: new Date(result.reset) };
  }

  // An in-memory count only covers one serverless instance, so it caps nothing that costs money.
  if (isProduction && LIMITERS[type].spends) {
    logger.error({ limiter: type }, "Refusing a rate-limited request: Upstash Redis is not configured");
    throw new APIError("This service is temporarily unavailable", 503);
  }

  return limitInMemory(type, identifier);
}
