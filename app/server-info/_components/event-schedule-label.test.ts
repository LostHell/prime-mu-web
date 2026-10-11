import { describeDailySchedule } from "./event-schedule-label";

test("describes an even hourly schedule", () => {
  expect(describeDailySchedule([0, 2, 4, 6])).toBe("Every 2 hours");
});

test("describes a schedule that starts on the half hour", () => {
  expect(describeDailySchedule([0.5, 4.5, 8.5])).toBe("Every 4 hours, at :30");
});

test("lists uneven start times", () => {
  expect(describeDailySchedule([1, 5, 6])).toBe("01:00, 05:00, 06:00");
});
