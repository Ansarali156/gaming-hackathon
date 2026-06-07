import { Ratelimit } from "@upstash/ratelimit";
import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "./redis";

// ---------------------------------------------------------------------------
// Preconfigured rate limiters
// ---------------------------------------------------------------------------

function makeRatelimiter(requests: number, windowSeconds: number) {
  const redis = getRedis();
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, `${windowSeconds} s`),
    analytics: true,
  });
}

// Strict — registration / payments (10 req / 60s per IP)
export const registrationLimiter = makeRatelimiter(10, 60);

// Medium — login / forgot-password (20 req / 60s per IP)
export const authLimiter = makeRatelimiter(20, 60);

// Light — public API / stats (100 req / 60s per IP)
export const publicLimiter = makeRatelimiter(100, 60);

// ---------------------------------------------------------------------------
// Helper: extract real IP from Vercel headers
// ---------------------------------------------------------------------------
function getIP(req: NextRequest): string {
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "127.0.0.1"
  );
}

// ---------------------------------------------------------------------------
// applyRateLimit — wrap any route handler
//
// Usage:
//   export async function POST(req: NextRequest) {
//     const limited = await applyRateLimit(req, registrationLimiter);
//     if (limited) return limited;
//     // ... rest of handler
//   }
// ---------------------------------------------------------------------------
export async function applyRateLimit(
  req: NextRequest,
  limiter: Ratelimit | null
): Promise<NextResponse | null> {
  if (!limiter) return null; // Redis not configured — skip silently

  const ip = getIP(req);
  const { success, limit, remaining, reset } = await limiter.limit(ip);

  if (!success) {
    return NextResponse.json(
      {
        error: "Too many requests. Please slow down and try again.",
        retryAfter: Math.ceil((reset - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": String(remaining),
          "X-RateLimit-Reset": String(reset),
          "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
        },
      }
    );
  }

  return null; // Not rate limited — proceed
}
