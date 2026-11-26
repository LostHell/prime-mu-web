import { createRateLimiter } from "./rate-limit";

test("allows a key up to its limit inside the window and refuses the next use", () => {
  const take = createRateLimiter({ limit: 2, windowMs: 1000 });

  expect(take("a", 0)).toBe(true);
  expect(take("a", 10)).toBe(true);
  expect(take("a", 20)).toBe(false);
});

test("allows a key again once its first use is older than the window", () => {
  const take = createRateLimiter({ limit: 1, windowMs: 1000 });

  expect(take("a", 0)).toBe(true);
  expect(take("a", 999)).toBe(false);
  expect(take("a", 1000)).toBe(true);
});

test("counts every key on its own", () => {
  const take = createRateLimiter({ limit: 1, windowMs: 1000 });

  expect(take("a", 0)).toBe(true);
  expect(take("b", 0)).toBe(true);
  expect(take("a", 1)).toBe(false);
});

test("does not count a refused use", () => {
  const take = createRateLimiter({ limit: 1, windowMs: 1000 });

  expect(take("a", 0)).toBe(true);
  expect(take("a", 500)).toBe(false);
  // Only the use at 0 counted: free again at 1000, not at 1500.
  expect(take("a", 1000)).toBe(true);
});

test("still limits a key that is in use after many others were dropped", () => {
  const take = createRateLimiter({ limit: 1, windowMs: 1000 });

  for (let n = 0; n < 1100; n++) {
    take(`old${n}`, 0);
  }
  expect(take("busy", 5000)).toBe(true);
  for (let n = 0; n < 1100; n++) {
    take(`new${n}`, 5001);
  }

  expect(take("busy", 5002)).toBe(false);
});
