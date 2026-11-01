import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  /** Optional comma-separated browser origins for APIs using `.cors()` — each entry must include a scheme (`https://...`). */
  CORS_ALLOWED_ORIGINS: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  RECAPTCHA_SECRET_KEY: z.string().optional(),
  RECAPTCHA_SITE_KEY: z.string().optional(),
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().optional(),

  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  CV_LINK_SECRET: z.string().min(32).optional(),
  CV_UPLOAD_TOKEN: z.string().optional(),
  /** Content API (apps/api). Unset outside Vercel production means the fixture dataset is served. */
  CONTENT_API_URL: z.string().url().optional(),
  CONTENT_API_TOKEN: z.string().optional(),
  REVALIDATE_SECRET: z.string().optional(),
  VERCEL_ENV: z.enum(["production", "preview", "development"]).optional(),
  NEXT_PUBLIC_APP_VERSION: z.string().optional(),

  /** Vercel AI Gateway key for local dev; on Vercel the gateway authenticates via OIDC instead. */
  ASK_MR_DAILY_BUDGET: z.coerce.number().int().positive().default(120),
  ASK_MR_ENABLED: z.stringbool().default(true),
  /** Hides the Ask MR UI when "false" (read directly from `process.env` in client code). */
  NEXT_PUBLIC_ASK_MR_ENABLED: z.stringbool().default(true),
});

export const env = EnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  CORS_ALLOWED_ORIGINS: process.env.CORS_ALLOWED_ORIGINS,
  SENTRY_DSN: process.env.SENTRY_DSN,
  SENTRY_ORG: process.env.SENTRY_ORG,
  SENTRY_PROJECT: process.env.SENTRY_PROJECT,
  SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
  RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
  RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  CV_LINK_SECRET: process.env.CV_LINK_SECRET,
  CV_UPLOAD_TOKEN: process.env.CV_UPLOAD_TOKEN,
  CONTENT_API_URL: process.env.CONTENT_API_URL,
  CONTENT_API_TOKEN: process.env.CONTENT_API_TOKEN,
  REVALIDATE_SECRET: process.env.REVALIDATE_SECRET,
  VERCEL_ENV: process.env.VERCEL_ENV,
  NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
  ASK_MR_DAILY_BUDGET: process.env.ASK_MR_DAILY_BUDGET,
  ASK_MR_ENABLED: process.env.ASK_MR_ENABLED,
  NEXT_PUBLIC_ASK_MR_ENABLED: process.env.NEXT_PUBLIC_ASK_MR_ENABLED,
});

export type Env = z.infer<typeof EnvSchema>;

export function getEnv<K extends keyof Env>(key: K): Env[K] {
  return env[key];
}

export function getRequiredEnv<K extends keyof Env>(key: K): NonNullable<Env[K]> {
  const value = env[key];
  if (value === undefined || value === null) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value as NonNullable<Env[K]>;
}

export const isDevelopment = env.NODE_ENV === "development";

export const isProduction = env.NODE_ENV === "production";
