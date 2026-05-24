// In-memory sliding-window rate limiter.
// Good enough for single-instance dev/SMB; replace with Redis (e.g. Upstash)
// when deploying horizontally — same API surface.

type Bucket = { hits: number[]; lastSweep: number };

const buckets = new Map<string, Bucket>();
const SWEEP_INTERVAL_MS = 60_000;

function sweep(now: number) {
  // Cheap janitor — runs at most once per minute on access
  for (const [key, b] of buckets) {
    if (now - b.lastSweep < SWEEP_INTERVAL_MS) continue;
    const cutoff = now - 24 * 60 * 60 * 1000; // drop anything > 24h
    b.hits = b.hits.filter((t) => t > cutoff);
    b.lastSweep = now;
    if (b.hits.length === 0) buckets.delete(key);
  }
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSec?: number;
};

/**
 * Sliding-window check. Counts requests in the trailing `windowMs` window.
 * Records this request as a hit (whether allowed or not — failed attempts
 * still count toward the limit).
 */
export function rateLimit(
  key: string,
  { maxAttempts, windowMs }: { maxAttempts: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const bucket = buckets.get(key) ?? { hits: [], lastSweep: now };
  bucket.hits = bucket.hits.filter((t) => t > now - windowMs);

  if (bucket.hits.length >= maxAttempts) {
    const oldest = bucket.hits[0];
    const retryAfterSec = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    buckets.set(key, bucket);
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  bucket.hits.push(now);
  buckets.set(key, bucket);
  return { allowed: true, remaining: Math.max(0, maxAttempts - bucket.hits.length) };
}

/** Clear a key (use on successful login to reset the user's failure count). */
export function resetRateLimit(key: string) {
  buckets.delete(key);
}

/** Best-effort client IP from common proxy headers. Falls back to "unknown". */
export function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  const cfIp = req.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();
  return 'unknown';
}
