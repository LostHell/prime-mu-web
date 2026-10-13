import { prisma } from "@/prisma/prisma";
import { registerAction } from "./register";

jest.mock("@/lib/game/server-config", () =>
  jest.requireActual("@/lib/test-utils/server-config"),
);
jest.mock("@/prisma/generated/prisma/client", () => {
  class PrismaClientKnownRequestError extends Error {
    code: string;

    constructor(
      message: string,
      options: { code: string; clientVersion?: string },
    ) {
      super(message);
      this.name = "PrismaClientKnownRequestError";
      this.code = options.code;
    }
  }

  return { Prisma: { PrismaClientKnownRequestError } };
});
jest.mock("@/prisma/prisma", () => ({
  prisma: {
    mEMB_INFO: { findUnique: jest.fn() },
    $transaction: jest.fn(),
  },
}));
jest.mock("@/auth", () => ({ signIn: jest.fn() }));
jest.mock("next/navigation", () => ({ redirect: jest.fn() }));

const { Prisma } = jest.requireMock("@/prisma/generated/prisma/client") as {
  Prisma: {
    PrismaClientKnownRequestError: new (
      message: string,
      options: { code: string; clientVersion?: string },
    ) => Error & { code: string };
  };
};

const submit = () => {
  const form = new FormData();
  form.set("username", "Knight");
  form.set("email", "knight@example.com");
  form.set("password", "secret1");
  form.set("confirmPassword", "secret1");
  return registerAction({}, form);
};

beforeEach(() => {
  jest.clearAllMocks();
});

test("says the username is taken when another sign-up inserts it first", async () => {
  jest.mocked(prisma.mEMB_INFO.findUnique).mockResolvedValue(null);
  jest.mocked(prisma.$transaction).mockRejectedValue(
    new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
      code: "P2002",
      clientVersion: "0",
    }),
  );

  const result = await submit();

  expect(result).toEqual({
    success: false,
    message: "This username is already taken.",
  });
});

test("says the username is taken when it already exists", async () => {
  jest.mocked(prisma.mEMB_INFO.findUnique).mockResolvedValue({
    memb___id: "Knight",
  } as never);

  const result = await submit();

  expect(result.message).toBe("This username is already taken.");
  expect(prisma.$transaction).not.toHaveBeenCalled();
});
