import { SERVER_LIVE_DATE } from "@/constants/app";

/** "Since" after launch, "Official Launch" before that calendar instant. */
export const formatServerLiveNote = (now = new Date()): string => {
  const label = now < SERVER_LIVE_DATE ? "Official Launch" : "Since";
  return `${label}: ${formatDayMonthYear(SERVER_LIVE_DATE)}`;
};

/** Day.month.year in UTC, so a calendar date does not shift with the server timezone. */
export const formatDayMonthYear = (date: Date): string => {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
    .format(date)
    .replaceAll("/", ".");
};

/** "11 October 2026", in UTC, for prose such as the FAQ and /llms.txt. */
export const formatLongDate = (date: Date): string =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
