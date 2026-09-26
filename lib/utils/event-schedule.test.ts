import { nextEventTime } from "./event-schedule";

test("uses the configured server timezone rather than the visitor timezone", () => {
  const now = Date.parse("2026-09-26T00:00:00Z");
  expect(nextEventTime([4], now, "Europe/Sofia")).toBe(
    Date.parse("2026-09-26T01:00:00Z"),
  );
  expect(nextEventTime([4], now, "UTC")).toBe(
    Date.parse("2026-09-26T04:00:00Z"),
  );
});
test("skips a nonexistent spring-forward time and includes a repeated autumn time", () => {
  expect(
    nextEventTime([2.5], Date.parse("2026-03-29T00:00:00Z"), "Europe/Berlin"),
  ).toBe(Date.parse("2026-03-30T00:30:00Z"));
  expect(
    nextEventTime([2.5], Date.parse("2026-10-25T00:45:00Z"), "Europe/Berlin"),
  ).toBe(Date.parse("2026-10-25T01:30:00Z"));
});
test("does not invent an event for an empty schedule", () => {
  expect(nextEventTime([], Date.now(), "UTC")).toBeNull();
});
