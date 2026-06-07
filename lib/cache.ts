import { getRedis } from "./redis";

// ---------------------------------------------------------------------------
// Generic Redis Cache Utility
//
// Usage:
//   const data = await getCached("analytics:main", 60, () => fetchFromDB());
// ---------------------------------------------------------------------------

/**
 * Get a cached value or compute + store it.
 * @param key     Redis cache key
 * @param ttlSecs Time-to-live in seconds
 * @param fetcher Function to call if cache miss
 */
export async function getCached<T>(
  key: string,
  ttlSecs: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const redis = getRedis();

  if (redis) {
    try {
      const cached = await redis.get<T>(key);
      if (cached !== null && cached !== undefined) {
        console.log(`[Cache HIT] ${key}`);
        return cached;
      }
      console.log(`[Cache MISS] ${key} — fetching from DB`);
    } catch (e) {
      console.warn(`[Cache ERROR] Redis get failed for ${key}:`, e);
    }
  }

  // Fetch fresh data
  const data = await fetcher();

  if (redis) {
    try {
      await redis.setex(key, ttlSecs, JSON.stringify(data));
      console.log(`[Cache SET] ${key} (TTL: ${ttlSecs}s)`);
    } catch (e) {
      console.warn(`[Cache ERROR] Redis set failed for ${key}:`, e);
    }
  }

  return data;
}

/**
 * Invalidate (delete) a cache key.
 * Call this when data changes (e.g. new registration, payment success).
 */
export async function invalidateCache(...keys: string[]): Promise<void> {
  const redis = getRedis();
  if (!redis || keys.length === 0) return;
  try {
    await redis.del(...keys);
    console.log(`[Cache INVALIDATED] ${keys.join(", ")}`);
  } catch (e) {
    console.warn(`[Cache ERROR] Redis del failed:`, e);
  }
}

// ---------------------------------------------------------------------------
// Predefined cache keys — use these everywhere for consistency
// ---------------------------------------------------------------------------
export const CACHE_KEYS = {
  ANALYTICS:     "analytics:main",
  PARTICIPANTS:  "participants:all",
  PAYMENTS:      "payments:all",
  SPONSORS:      "sponsors:active",
  STATS_PUBLIC:  "stats:public",
};

// Cache TTL presets (seconds)
export const CACHE_TTL = {
  ANALYTICS:    60,   // 1 minute  — admin sees near-realtime data
  PARTICIPANTS: 30,   // 30 seconds
  PAYMENTS:     30,   // 30 seconds
  SPONSORS:     300,  // 5 minutes — sponsors rarely change
  STATS_PUBLIC: 120,  // 2 minutes — homepage stats
};
