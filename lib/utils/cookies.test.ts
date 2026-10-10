import {
  deleteClientCookie,
  getClientCookie,
  serializeClientCookie,
  setClientCookie,
} from "./cookies";

test("serializes a cookie with path, max-age, and SameSite", () => {
  expect(
    serializeClientCookie("mu-selected-character", "Dark Knight", {
      path: "/user-panel",
      maxAge: 60,
      secure: false,
    }),
  ).toBe(
    "mu-selected-character=Dark%20Knight; Path=/user-panel; SameSite=Lax; Max-Age=60",
  );
});

test("adds Secure when requested", () => {
  expect(serializeClientCookie("session", "abc", { secure: true })).toContain(
    "; Secure",
  );
});

test("round-trips a value through document.cookie", () => {
  setClientCookie("favorite", "Soul Master", { path: "/", secure: false });

  expect(getClientCookie("favorite")).toBe("Soul Master");
});

test("deleteClientCookie expires the cookie", () => {
  setClientCookie("favorite", "Soul Master", { path: "/", secure: false });
  deleteClientCookie("favorite", { path: "/", secure: false });

  expect(getClientCookie("favorite")).toBeUndefined();
});
