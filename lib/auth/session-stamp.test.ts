/**
 * @jest-environment node
 */
import { passwordStamp } from "./session-stamp";

const password = Uint8Array.from([1, 2, 3, 4]);

test("gives the same stamp for the same password and secret", () => {
  expect(passwordStamp(password, "secret")).toBe(
    passwordStamp(Uint8Array.from([1, 2, 3, 4]), "secret"),
  );
});

test("gives another stamp for another password or secret", () => {
  const stamp = passwordStamp(password, "secret");

  expect(passwordStamp(Uint8Array.from([1, 2, 3, 5]), "secret")).not.toBe(
    stamp,
  );
  expect(passwordStamp(password, "other")).not.toBe(stamp);
});
