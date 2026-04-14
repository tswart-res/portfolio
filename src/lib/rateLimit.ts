// In-memory rate limiter - suitable for single-instance Docker deployments.
// Resets on process restart, which is acceptable for a personal portfolio.
// Limit: 3 requests per IP per 15 minutes.

interface RateEntry {
  count: number;
  resetAt: number;
}

const LIMIT = 3;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const store = new Map<string, RateEntry>();

// Sweep expired entries every 30 minutes to prevent unbounded Map growth.
// A personal portfolio will have a small number of unique IPs, but this is
// free insurance against memory accumulation over long uptimes.
const CLEANUP_INTERVAL_MS = 30 * 60 * 1000;
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of store) {
    if (now > entry.resetAt) store.delete(ip);
  }
}, CLEANUP_INTERVAL_MS).unref(); // .unref() so this timer doesn't keep the process alive

export function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    // First request in this window (or window expired)
    const newEntry: RateEntry = { count: 1, resetAt: now + WINDOW_MS };
    store.set(ip, newEntry);
    return { allowed: true, remaining: LIMIT - 1, resetAt: newEntry.resetAt };
  }

  if (entry.count >= LIMIT) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: LIMIT - entry.count,
    resetAt: entry.resetAt,
  };
}
