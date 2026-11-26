import { createRateLimiter } from "./rate-limit";

test("allows a key up to its limit inside the window and refuses the next use", () => {
  const { take } = createRateLimiter({ limit: 2, windowMs: 1000 });

  expect(take("a", 0)).toBe(true);
  expect(take("a", 10)).toBe(true);
  expect(take("a", 20)).toBe(false);
});

test("allows a key again once its first use is older than the window", () => {
  const { take } = createRateLimiter({ limit: 1, windowMs: 1000 });

  expect(take("a", 0)).toBe(true);
  expect(take("a", 999)).toBe(false);
  expect(take("a", 1000)).toBe(true);
});

test("counts every key on its own", () => {
  const { take } = createRateLimiter({ limit: 1, windowMs: 1000 });

  expect(take("a", 0)).toBe(true);
  expect(take("b", 0)).toBe(true);
  expect(take("a", 1)).toBe(false);
});

test("does not count a refused use", () => {
  const { take } = createRateLimiter({ limit: 1, windowMs: 1000 });

  expect(take("a", 0)).toBe(true);
  expect(take("a", 500)).toBe(false);
  // Only the use at 0 counted: free again at 1000, not at 1500.
  expect(take("a", 1000)).toBe(true);
});

test("gives back the last use taken, and only that one", () => {
  const { take, giveBack } = createRateLimiter({ limit: 2, windowMs: 1000 });

  expect(take("a", 0)).toBe(true);
  expect(take("a", 10)).toBe(true);
  giveBack("a");
  expect(take("a", 20)).toBe(true);
  expect(take("a", 30)).toBe(false);
  giveBack("unknown");
});

test("keeps a key in use while a flood of new keys drops the ones used longest ago", () => {
  const { take } = createRateLimiter({ limit: 1, windowMs: 60_000 });

  expect(take("busy", 0)).toBe(true);
  expect(take("idle", 0)).toBe(true);
  for (let n = 0; n < 9_998; n++) {
    take(`flood${n}`, 1);
  }
  // Used again, it is the newest: the next new keys drop "idle" and the flood, not it.
  expect(take("busy", 2)).toBe(false);
  for (let n = 0; n < 5_000; n++) {
    take(`more${n}`, 3);
  }

  expect(take("busy", 4)).toBe(false);
  expect(take("idle", 4)).toBe(true);
});
