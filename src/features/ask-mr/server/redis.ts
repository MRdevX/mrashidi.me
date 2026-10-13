import type { Redis } from "@upstash/redis";
import { logger } from "@/lib/core";
import { getRedis } from "@/lib/services/redis";

let warned = false;

export function getAskMrRedis(): Redis | null {
  const redis = getRedis();
  if (!redis && !warned) {
    logger.warn("Ask MR: Upstash Redis not configured; budget cap and chat logs are disabled");
    warned = true;
  }
  return redis;
}
