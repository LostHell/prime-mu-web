/**
 * @jest-environment node
 */
import { headers } from "next/headers";
import { after } from "next/server";
import {
  PASSWORD_RESET_REQUESTS_PER_HOUR,
  PASSWORD_RESET_SENT_MESSAGE,
} from "@/constants/password-reset";
import { isPasswordResetTokenValid } from "@/lib/auth/password-reset-token";
import { sendMail } from "@/lib/mail/send-mail";
import { prisma } from "@/prisma/prisma";
import { requestPasswordResetAction } from "./request-password-reset";

jest.mock("next/headers", () => ({ headers: jest.fn() }));
jest.mock("next/server", () => ({ after: jest.fn() }));
jest.mock("@/lib/mail/send-mail", () => ({ sendMail: jest.fn() }));
jest.mock("@/prisma/prisma", () => ({
  prisma: { mEMB_INFO: { findUnique: jest.fn() } },
}));

const password = Uint8Array.from([1, 2, 3, 4]);
let address = 0;

/** Each test its own visitor address, so the per-address limit of one test does not reach another. */
const fromNewAddress = () => {
  address += 1;
  (headers as jest.Mock).mockResolvedValue(
    new Headers({ "cf-connecting-ip": `203.0.113.${address}` }),
  );
};

const mockAccount = (username: string, email: string | null) =>
  (prisma.mEMB_INFO.findUnique as jest.Mock).mockResolvedValue({
    memb___id: username,
    memb__pwd: password,
    mail_addr: email,
  });

/** Submits the form, then runs the work the action left for after its answer. */
const submit = async (username: string, email: string) => {
  const form = new FormData();
  form.set("username", username);
  form.set("email", email);
  const before = (after as jest.Mock).mock.calls.length;
  const result = await requestPasswordResetAction({}, form);
  for (const [work] of (after as jest.Mock).mock.calls.slice(before)) {
    await work();
  }
  return result;
};

beforeEach(() => {
  jest.clearAllMocks();
  process.env.AUTH_SECRET = "test-secret";
  process.env.SITE_URL = "https://example.com";
  (sendMail as jest.Mock).mockResolvedValue(true);
  fromNewAddress();
});

test("mails the account a link to the reset page that works for it", async () => {
  mockAccount("Knight", "knight@example.com");

  const result = await submit("knight", "Knight@Example.com");

  expect(result).toEqual({
    success: true,
    message: PASSWORD_RESET_SENT_MESSAGE,
  });
  expect(sendMail).toHaveBeenCalledTimes(1);
  const mail = (sendMail as jest.Mock).mock.calls[0][0];
  expect(mail.to).toBe("knight@example.com");
  const link = new URL(
    /https:\/\/example\.com\/reset-password\S+/.exec(mail.text)![0],
  );
  const token = link.searchParams.get("token")!;
  expect(
    isPasswordResetTokenValid(
      token,
      { username: "Knight", password, email: "knight@example.com" },
      Math.floor(Date.now() / 1000),
      "test-secret",
    ),
  ).toBe(true);
});

test("gives the same answer and mails nothing when the email is not the account's or there is no account", async () => {
  mockAccount("Archer", "archer@example.com");

  const wrongEmail = await submit("Archer", "someone@example.com");

  (prisma.mEMB_INFO.findUnique as jest.Mock).mockResolvedValue(null);
  const noAccount = await submit("Nobody", "nobody@example.com");

  mockAccount("Mage", null);
  const noEmail = await submit("Mage", "mage@example.com");

  for (const result of [wrongEmail, noAccount, noEmail]) {
    expect(result).toEqual({
      success: true,
      message: PASSWORD_RESET_SENT_MESSAGE,
    });
  }
  expect(sendMail).not.toHaveBeenCalled();
});

test("mails an account once in its interval, whatever is asked", async () => {
  mockAccount("Elfie", "elf@example.com");

  await submit("Elfie", "elf@example.com");
  fromNewAddress();
  const again = await submit("Elfie", "elf@example.com");

  expect(again.success).toBe(true);
  expect(sendMail).toHaveBeenCalledTimes(1);
});

test("lets an account ask again at once when its email did not go out", async () => {
  mockAccount("Summoner", "summoner@example.com");
  (sendMail as jest.Mock).mockResolvedValueOnce(false);

  await submit("Summoner", "summoner@example.com");
  fromNewAddress();
  await submit("Summoner", "summoner@example.com");

  expect(sendMail).toHaveBeenCalledTimes(2);
});

test("stops an address after its requests of the hour", async () => {
  mockAccount("Wizard", "other@example.com");

  for (let n = 0; n < PASSWORD_RESET_REQUESTS_PER_HOUR; n++) {
    expect((await submit("Wizard", "wizard@example.com")).success).toBe(true);
  }
  const over = await submit("Wizard", "wizard@example.com");

  expect(over).toEqual({
    success: false,
    message: "Too many requests. Please try again later.",
  });
});

test("returns the field errors and does nothing for invalid input", async () => {
  const result = await submit("ab", "not-an-email");

  expect(result.success).toBe(false);
  expect(result.errors?.username).toBeDefined();
  expect(result.errors?.email).toBeDefined();
  expect(after).not.toHaveBeenCalled();
});

test("answers the same even when the database fails after it", async () => {
  const errorLog = jest.spyOn(console, "error").mockImplementation(() => {});
  (prisma.mEMB_INFO.findUnique as jest.Mock).mockRejectedValue(
    new Error("down"),
  );

  const result = await submit("Dark", "dark@example.com");

  expect(result.success).toBe(true);
  expect(sendMail).not.toHaveBeenCalled();
  expect(errorLog).toHaveBeenCalled();
  errorLog.mockRestore();
});
