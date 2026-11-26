/** @jest-environment node */
import { NextRequest } from "next/server";
import { proxy } from "./proxy";

// Auth.js's getToken (ESM only, not loaded by Jest) as it names the cookie: `__Secure-authjs.session-token`
// with secureCookie, else `authjs.session-token` (@auth/core/jwt: `defaultCookies(secureCookie ?? false)`).
jest.mock("next-auth/jwt", () => ({
  getToken: async ({
    req,
    secureCookie,
  }: {
    req: NextRequest;
    secureCookie?: boolean;
  }) => {
    const name = secureCookie
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";

    const value = req.cookies.get(name)?.value;
    if (value === "valid") {
      return { sub: "1", pws: "current" };
    }
    // Made before the password changed.
    return value === "old-password" ? { sub: "1", pws: "old" } : null;
  },
}));
jest.mock("@/lib/queries/get-account-password-stamp", () => ({
  getAccountPasswordStamp: async () => "current",
}));

// The request as it reaches the app: http, also behind Coolify's https proxy.
const request = (path: string, cookie?: string) =>
  new NextRequest(`http://localhost:3000${path}`, {
    headers: cookie ? { cookie } : {},
  });

test("lets a user signed in on the https site into the user panel", async () => {
  const response = await proxy(
    request("/user-panel", "__Secure-authjs.session-token=valid"),
  );

  expect(response.headers.get("location")).toBeNull();
});

test("sends a user signed in on the https site from the login page to the user panel", async () => {
  const response = await proxy(
    request("/login", "__Secure-authjs.session-token=valid"),
  );

  expect(response.headers.get("location")).toBe(
    "http://localhost:3000/user-panel",
  );
});

test("lets a user signed in on the http site into the user panel", async () => {
  const response = await proxy(
    request("/user-panel", "authjs.session-token=valid"),
  );

  expect(response.headers.get("location")).toBeNull();
});

test("sends a visitor without a session from the user panel to the login page", async () => {
  const response = await proxy(request("/user-panel/market"));

  expect(response.headers.get("location")).toBe("http://localhost:3000/login");
});

test("treats a session made before a password change as none, so the login page shows", async () => {
  const cookie = "__Secure-authjs.session-token=old-password";

  const panel = await proxy(request("/user-panel", cookie));
  const login = await proxy(request("/login", cookie));

  expect(panel.headers.get("location")).toBe("http://localhost:3000/login");
  expect(login.headers.get("location")).toBeNull();
});

test("sends a signed-in user from the password reset pages to the user panel", async () => {
  for (const path of ["/forgot-password", "/reset-password?token=abc"]) {
    const response = await proxy(
      request(path, "__Secure-authjs.session-token=valid"),
    );

    expect([path, response.headers.get("location")]).toEqual([
      path,
      "http://localhost:3000/user-panel",
    ]);
  }
});

test("lets a visitor without a session reach the password reset pages", async () => {
  for (const path of ["/forgot-password", "/reset-password?token=abc"]) {
    const response = await proxy(request(path));

    expect([path, response.headers.get("location")]).toEqual([path, null]);
  }
});
