import { Redis } from "@upstash/redis";
import { getEnv } from "@/lib/core";

let client: Redis | null | undefined;

export function getRedis(): Redis | null {
  if (client === undefined) {
    const url = getEnv("UPSTASH_REDIS_REST_URL");
    const token = getEnv("UPSTASH_REDIS_REST_TOKEN");
    client = url && token ? new Redis({ url, token }) : null;
  }
  return client;
}
