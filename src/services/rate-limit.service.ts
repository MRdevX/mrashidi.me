import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { API_CONFIG } from "@/lib/core";

const redis = Redis.fromEnv();

export const rateLimiters = {
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
    limiter: Ratelimit.slidingWindow(API_CONFIG.RATE_LIMIT.CV_UPLOAD.requests, API_CONFIG.RATE_LIMIT.CV_UPLOAD.window),
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
} as const;

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
