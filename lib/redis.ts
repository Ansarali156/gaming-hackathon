import { Redis } from "@upstash/redis";

// Upstash Redis client — HTTP based, works perfectly with Vercel serverless.
// Set these in Vercel env vars (and .env.local for local dev):
//   UPSTASH_REDIS_REST_URL
//   UPSTASH_REDIS_REST_TOKEN
// Get them free at: https://console.upstash.com

let redis: Redis | null = null;

export function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    // Redis not configured — graceful fallback (no crash)
    return null;
  }

  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  return redis;
}
