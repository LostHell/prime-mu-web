// Past this many keys, the keys with no use inside the window are dropped, so the map stays small.
const PRUNE_AT = 1000;

/**
 * Allows `limit` uses of a key in each `windowMs`, in this server process: a restart forgets them.
 * Returns a function that takes one use of the key and says whether it was allowed.
 */
export const createRateLimiter = ({
  limit,
  windowMs,
}: {
  limit: number;
  windowMs: number;
}) => {
  const uses = new Map<string, number[]>();

  return (key: string, now = Date.now()): boolean => {
    if (uses.size > PRUNE_AT) {
      for (const [other, times] of uses) {
        if (now - times[times.length - 1] >= windowMs) {
          uses.delete(other);
        }
      }
    }

    const recent = (uses.get(key) ?? []).filter(
      (time) => now - time < windowMs,
    );
    if (recent.length >= limit) {
      uses.set(key, recent);
      return false;
    }
    recent.push(now);
    uses.set(key, recent);
    return true;
  };
};
