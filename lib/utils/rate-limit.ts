// The most keys kept: past it the key used longest ago is dropped, so neither the memory nor the
// time of a use grows with the number of keys (an address header that a request can set itself).
const MAX_KEYS = 10_000;

/**
 * Allows `limit` uses of a key in each `windowMs`, in this server process: a restart forgets them.
 * `take` takes one use of the key and says whether it was allowed; `giveBack` returns the last one
 * taken, for work that did not happen after all.
 */
export const createRateLimiter = ({
  limit,
  windowMs,
}: {
  limit: number;
  windowMs: number;
}) => {
  // In the order of their last use: the first key is the one used longest ago.
  const uses = new Map<string, number[]>();

  const take = (key: string, now = Date.now()): boolean => {
    const recent = (uses.get(key) ?? []).filter(
      (time) => now - time < windowMs,
    );
    uses.delete(key);
    if (uses.size >= MAX_KEYS) {
      uses.delete(uses.keys().next().value!);
    }

    const allowed = recent.length < limit;
    if (allowed) {
      recent.push(now);
    }
    uses.set(key, recent);
    return allowed;
  };

  const giveBack = (key: string) => {
    uses.get(key)?.pop();
  };

  return { take, giveBack };
};
