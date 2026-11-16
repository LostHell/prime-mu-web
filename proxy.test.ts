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

    return req.cookies.get(name)?.value === "valid" ? { sub: "1" } : null;
  },
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
