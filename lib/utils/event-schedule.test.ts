import { describeDailySchedule, nextEventTime } from "./event-schedule";

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

test("describes a schedule that repeats evenly all day", () => {
  expect(
    describeDailySchedule([0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]),
  ).toBe("Every 2 hours");
});

test("describes an all-day schedule that starts on the half hour", () => {
  expect(describeDailySchedule([0.5, 4.5, 8.5, 12.5, 16.5, 20.5])).toBe(
    "Every 4 hours, at :30",
  );
});

test("tells apart all-day schedules with the same step but another start", () => {
  expect(describeDailySchedule([0, 6, 12, 18])).toBe("Every 6 hours");
  expect(describeDailySchedule([4, 10, 16, 22])).toBe(
    "Every 6 hours, from 04:00",
  );
});

test("lists the times of a schedule that does not cover the whole day", () => {
  expect(describeDailySchedule([0, 2, 4, 6])).toBe(
    "00:00, 02:00, 04:00, 06:00",
  );
  expect(describeDailySchedule([1, 5, 6])).toBe("01:00, 05:00, 06:00");
  expect(describeDailySchedule([20])).toBe("20:00");
});

test("does not describe an empty schedule", () => {
  expect(describeDailySchedule([])).toBe("Not scheduled");
});
