/** Remembers a value for `ttlMs` and shares one in-flight load across callers. A failed load is not remembered. */
export function cacheFor<T>(
  ttlMs: number,
  load: () => Promise<T>,
): () => Promise<T> {
  let cached: { value: T; fetchedAt: number } | null = null;
  let request: Promise<T> | null = null;

  return () => {
    const now = Date.now();
    if (cached && now - cached.fetchedAt < ttlMs) {
      return Promise.resolve(cached.value);
    }

    if (!request) {
      request = load()
        .then((value) => {
          cached = { value, fetchedAt: Date.now() };
          return value;
        })
        .finally(() => {
          request = null;
        });
    }

    return request;
  };
}
