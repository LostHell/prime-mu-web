import { serverConfig } from "./server-config";

test("reset table lists every reset up to the server limit", () => {
  const { limit, table } = serverConfig.reset;

  expect(table).toHaveLength(limit);
  expect(table.map((rule) => rule.reset)).toEqual(
    Array.from({ length: limit }, (_, index) => index + 1),
  );
  for (const rule of table) {
    expect(rule.level).toBeGreaterThan(0);
    expect(rule.money).toBeGreaterThan(0);
    expect(rule.points).toBeGreaterThan(0);
  }
});
