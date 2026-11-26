import { getClientAddress } from "./client-address";

test("takes Cloudflare's visitor address first", () => {
  const headers = new Headers({
    "cf-connecting-ip": "203.0.113.7",
    "x-forwarded-for": "10.0.0.1",
  });

  expect(getClientAddress(headers)).toBe("203.0.113.7");
});

test("takes the first forwarded address without Cloudflare", () => {
  const headers = new Headers({
    "x-forwarded-for": " 198.51.100.2 , 10.0.0.1",
  });

  expect(getClientAddress(headers)).toBe("198.51.100.2");
});

test("says unknown without either header", () => {
  expect(getClientAddress(new Headers())).toBe("unknown");
});
