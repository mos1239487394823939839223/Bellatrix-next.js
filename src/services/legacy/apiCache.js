/**
 * Simple in-memory API cache with TTL (Time To Live).
 * Prevents the same endpoint from being fetched multiple times
 * while the page is open, which is especially useful when several
 * components on the same route call the same API (e.g. /Pages?slug=home).
 */

const cache = new Map();

/**
 * @param {string}   key        - Unique cache key (typically the URL + params)
 * @param {Function} fetcher    - Async function that performs the actual request
 * @param {number}   ttl        - Time to live in milliseconds (default 60 seconds)
 * @returns {Promise<any>}
 */
export async function cachedFetch(key, fetcher, ttl = 60_000) {
  const now = Date.now();
  const cached = cache.get(key);

  if (cached && now - cached.ts < ttl) {
    return cached.data;
  }

  // Remove stale entry if present
  if (cached) cache.delete(key);

  const data = await fetcher();
  cache.set(key, { data, ts: now });
  return data;
}

/**
 * Invalidate a specific cache entry (call after a successful save).
 */
export function invalidateCache(key) {
  cache.delete(key);
}

/**
 * Invalidate all entries whose key includes a given substring.
 */
export function invalidateCacheByPrefix(prefix) {
  for (const key of cache.keys()) {
    if (key.includes(prefix)) cache.delete(key);
  }
}

/**
 * Clear the entire cache (e.g., on logout).
 */
export function clearCache() {
  cache.clear();
}
