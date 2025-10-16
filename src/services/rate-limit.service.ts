import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { API_CONFIG, logger } from "@/lib/core";

let redis: Redis | null = null;
let redisAvailable = false;

try {
  redis = Redis.fromEnv();
  redisAvailable = true;
  logger.info("Redis rate limiting initialized successfully");
} catch (error) {
  logger.warn({ error }, "Redis not available, using in-memory rate limiting fallback");
  redisAvailable = false;
}

const inMemoryLimits = new Map<string, { count: number; resetTime: number }>();

function createInMemoryRateLimit(requests: number, windowMs: number) {
  return {
    limit: async (identifier: string) => {
      const now = Date.now();
      const key = identifier;
      const limit = inMemoryLimits.get(key);

      if (!limit || now > limit.resetTime) {
        inMemoryLimits.set(key, { count: 1, resetTime: now + windowMs });
        return { success: true, limit: requests, remaining: requests - 1, reset: new Date(now + windowMs) };
      }

      if (limit.count >= requests) {
        return { success: false, limit: requests, remaining: 0, reset: new Date(limit.resetTime) };
      }

      limit.count++;
      return { success: true, limit: requests, remaining: requests - limit.count, reset: new Date(limit.resetTime) };
    },
  };
}

export const rateLimiters =
  redisAvailable && redis
    ? {
        contactForm: new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(
            API_CONFIG.RATE_LIMIT.CONTACT_FORM.requests,
            API_CONFIG.RATE_LIMIT.CONTACT_FORM.window
          ),
          analytics: true,
          prefix: "ratelimit:contact",
        }),

        cvUpload: new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(
            API_CONFIG.RATE_LIMIT.CV_UPLOAD.requests,
            API_CONFIG.RATE_LIMIT.CV_UPLOAD.window
          ),
          analytics: true,
          prefix: "ratelimit:cv",
        }),

        generalApi: new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(
            API_CONFIG.RATE_LIMIT.GENERAL_API.requests,
            API_CONFIG.RATE_LIMIT.GENERAL_API.window
          ),
          analytics: true,
          prefix: "ratelimit:api",
        }),
      }
    : ({
        contactForm: createInMemoryRateLimit(API_CONFIG.RATE_LIMIT.CONTACT_FORM.requests, 60 * 1000),
        cvUpload: createInMemoryRateLimit(API_CONFIG.RATE_LIMIT.CV_UPLOAD.requests, 60 * 60 * 1000),
        generalApi: createInMemoryRateLimit(API_CONFIG.RATE_LIMIT.GENERAL_API.requests, 60 * 1000),
      } as const);

export type RateLimiterType = keyof typeof rateLimiters;

export function getClientIdentifier(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");

  const ip = forwardedFor?.split(",")[0] || realIp || cfConnectingIp;

  return ip || "unknown";
}

export async function checkRateLimit(
  rateLimiterType: RateLimiterType,
  identifier: string
): Promise<{ success: boolean; limit: number; remaining: number; reset: Date }> {
  const rateLimiter = rateLimiters[rateLimiterType];
  const result = await rateLimiter.limit(identifier);

  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: new Date(result.reset),
  };
}
