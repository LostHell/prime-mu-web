import { refreshSessionToken } from "./session-token";

const stamps: Record<string, string | null> = {
  Knight: "current",
  Gone: null,
};
const getStamp = jest.fn(async (accountId: string) => stamps[accountId]);

beforeEach(() => {
  jest.clearAllMocks();
});

test("keeps the account and the stamp of its password on sign-in", async () => {
  expect(
    await refreshSessionToken({ name: "Knight" }, "Knight", getStamp),
  ).toEqual({ name: "Knight", sub: "Knight", pws: "current" });
});

test("keeps a session whose stamp is the account's", async () => {
  const token = { sub: "Knight", pws: "current" };

  expect(await refreshSessionToken(token, undefined, getStamp)).toBe(token);
});

test("ends a session made before a password change, for a gone account, or without a stamp", async () => {
  expect(
    await refreshSessionToken(
      { sub: "Knight", pws: "old" },
      undefined,
      getStamp,
    ),
  ).toBeNull();
  expect(
    await refreshSessionToken(
      { sub: "Gone", pws: "current" },
      undefined,
      getStamp,
    ),
  ).toBeNull();
  expect(
    await refreshSessionToken({ sub: "Knight" }, undefined, getStamp),
  ).toBeNull();
  expect(await refreshSessionToken({}, undefined, getStamp)).toBeNull();
});
