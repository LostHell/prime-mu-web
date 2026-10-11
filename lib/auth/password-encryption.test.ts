/**
 * @jest-environment node
 */
import {
  PASSWORD_ENCRYPTION,
  encodePassword,
  makeAccountKey,
  verifyPassword,
} from "./password-encryption";

jest.mock("@/lib/game/server-config", () =>
  jest.requireActual("@/lib/test-utils/server-config"),
);

// Expected values come from the game server's own code: the JoinServer's
// MD5.cpp (MD5_EncodeKey / MD5_EncodeKeyVal) and Util.cpp (MakeAccountKey),
// compiled and run on these accounts.
const REFERENCE = [
  {
    account: "test1",
    password: "test1",
    key: 155,
    md5: "5a105e8b9d40e1329780d62ea2265d8a",
    webzen: "87aadb30d0e7e192e0bcaea1ec8d5752",
  },
  {
    account: "Barton",
    password: "secret99",
    key: 16,
    md5: "a7e938134bb0fb0d90a7c7f81dc32ddf",
    webzen: "9a7fee43deb46e010929feead7530949",
  },
  {
    account: "a",
    password: "1234",
    key: 11,
    md5: "81dc9bdb52d04dc20036dbd8313ed055",
    webzen: "b0a3e4569c7166a86352ab85185a09d2",
  },
  {
    account: "abcdefghij",
    password: "0123456789",
    key: 161,
    md5: "781e5e245d69b566979b86e28d23f2c7",
    webzen: "188e261ad59d12b92d1913afb82d2bfc",
  },
  {
    account: "Admin_01",
    password: "P@ss w0rd",
    key: 83,
    md5: "37058c0209fb0fc7bbd4cc2017af0169",
    webzen: "c0f3b4cd1bbd49ef877a73cb84dc73f6",
  },
];

const hex = (bytes: Uint8Array) => Buffer.from(bytes).toString("hex");

test.each(REFERENCE)(
  "matches the JoinServer for $account",
  ({ account, password, key, md5, webzen }) => {
    expect(makeAccountKey(account)).toBe(key);
    expect(
      hex(encodePassword(account, password, PASSWORD_ENCRYPTION.default)),
    ).toBe(md5);
    expect(
      hex(encodePassword(account, password, PASSWORD_ENCRYPTION.webzen)),
    ).toBe(webzen);
  },
);

test("stores the password itself without encryption", () => {
  expect(
    Buffer.from(
      encodePassword("test1", "test1", PASSWORD_ENCRYPTION.none),
    ).toString(),
  ).toBe("test1");
});

test("uses the synced server mode by default", () => {
  // The test config uses Webzen (1).
  expect(hex(encodePassword("test1", "test1"))).toBe(REFERENCE[0].webzen);
});

test("verifies only the right password for the right account", () => {
  const stored = encodePassword("test1", "test1", PASSWORD_ENCRYPTION.webzen);
  expect(
    verifyPassword("test1", "test1", stored, PASSWORD_ENCRYPTION.webzen),
  ).toBe(true);
  expect(
    verifyPassword("test1", "wrong!", stored, PASSWORD_ENCRYPTION.webzen),
  ).toBe(false);
  // The Webzen key depends on the account name.
  expect(
    verifyPassword("test2", "test1", stored, PASSWORD_ENCRYPTION.webzen),
  ).toBe(false);
  // A plain-text value never matches an encrypted check.
  expect(
    verifyPassword(
      "test1",
      "test1",
      Buffer.from("test1"),
      PASSWORD_ENCRYPTION.webzen,
    ),
  ).toBe(false);
});

test("rejects unknown modes", () => {
  expect(() => encodePassword("test1", "test1", 3)).toThrow(/Unsupported/);
});
