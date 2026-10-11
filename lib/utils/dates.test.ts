import { SERVER_LIVE_DATE } from "@/constants/app";
import { formatDayMonthYear, formatServerLiveNote } from "./dates";

test("formats the launch date as day.month.year without shifting the calendar day", () => {
  expect(formatDayMonthYear(SERVER_LIVE_DATE)).toBe("11.10.2026");
});

test("says official launch before the go-live instant and since after it", () => {
  const before = new Date(SERVER_LIVE_DATE.getTime() - 1);
  const after = new Date(SERVER_LIVE_DATE.getTime());
  expect(formatServerLiveNote(before)).toBe("Official Launch: 11.10.2026");
  expect(formatServerLiveNote(after)).toBe("Since: 11.10.2026");
});
