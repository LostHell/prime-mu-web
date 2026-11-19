import { SERVER_LAUNCH_DATE, SERVER_OPEN_DATE } from "@/constants/app";
import {
  formatDayMonthYear,
  formatLongDate,
  formatServerLiveNote,
} from "./dates";

test("formats the launch date as day.month.year without shifting the calendar day", () => {
  expect(formatDayMonthYear(SERVER_OPEN_DATE)).toBe("11.10.2026");
  expect(formatDayMonthYear(SERVER_LAUNCH_DATE)).toBe("20.12.2026");
});

test("says official launch before the official launch and since from then on", () => {
  const before = new Date(SERVER_LAUNCH_DATE.getTime() - 1);
  const after = new Date(SERVER_LAUNCH_DATE.getTime());
  expect(formatServerLiveNote(before)).toBe("Official Launch: 20.12.2026");
  expect(formatServerLiveNote(after)).toBe("Since: 20.12.2026");
});

test("writes the launch date out in words without shifting the calendar day", () => {
  expect(formatLongDate(SERVER_OPEN_DATE)).toBe("11 October 2026");
  expect(formatLongDate(SERVER_LAUNCH_DATE)).toBe("20 December 2026");
});
