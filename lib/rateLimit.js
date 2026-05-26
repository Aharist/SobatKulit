/**
 * Simple in-memory rate limiter for API routes.
 * Tracks request counts per IP within a sliding time window.
 *
 * Usage:
 *   const limiter = createRateLimiter({ limit: 5, windowMs: 60_000 });
 *   // In your API handler:
 *   const ip = request.headers.get('x-forwarded-for') || 'unknown';
 *   if (!limiter.check(ip)) {
 *     return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
 *   }
 */

const limiters = new Map();

export function createRateLimiter({ limit = 5, windowMs = 60_000 } = {}) {
  const key = `${limit}-${windowMs}`;

  // Reuse existing limiter with same config to survive hot-reload
  if (limiters.has(key)) return limiters.get(key);

  const hits = new Map(); // ip -> { count, resetAt }

  // Periodic cleanup to prevent memory leaks (every 5 minutes)
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of hits) {
      if (now > entry.resetAt) hits.delete(ip);
    }
  }, 5 * 60_000);

  // Don't block process exit
  if (cleanupInterval.unref) cleanupInterval.unref();

  const limiter = {
    /**
     * Check if the given identifier (IP) is within rate limits.
     * @param {string} identifier - Usually the client IP address.
     * @returns {boolean} true if allowed, false if rate-limited.
     */
    check(identifier) {
      const now = Date.now();
      const entry = hits.get(identifier);

      if (!entry || now > entry.resetAt) {
        hits.set(identifier, { count: 1, resetAt: now + windowMs });
        return true;
      }

      entry.count += 1;
      return entry.count <= limit;
    },
  };

  limiters.set(key, limiter);
  return limiter;
}
