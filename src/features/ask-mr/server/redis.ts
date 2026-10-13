import { Redis } from "@upstash/redis";
import { getEnv, logger } from "@/lib/core";

let client: Redis | null | undefined;

/** Shared Upstash client for Ask MR budget counters and logs; `null` when Redis isn't configured. */
export function getAskMrRedis(): Redis | null {
  if (client !== undefined) {
    return client;
  }
  const url = getEnv("UPSTASH_REDIS_REST_URL");
  const token = getEnv("UPSTASH_REDIS_REST_TOKEN");
  if (!url || !token) {
    logger.warn("Ask MR: Upstash Redis not configured; budget cap and chat logs are disabled");
    client = null;
    return client;
  }
  client = new Redis({ url, token });
  return client;
}
