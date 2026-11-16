/** Resolve server wall-clock times by scanning actual instants, including DST transitions. */
export function nextEventTime(
  hours: number[],
  now: number,
  timeZone: string,
): number | null {
  const minutes = new Set(
    hours
      .filter((hour) => Number.isFinite(hour) && hour >= 0 && hour < 24)
      .map((hour) => Math.round(hour * 60))
      .filter((minute) => minute < 1440),
  );
  if (!minutes.size) return null;
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hourCycle: "h23",
    hour: "2-digit",
    minute: "2-digit",
  });
  const start = Math.floor(now / 60000) * 60000 + 60000;
  // Two days plus DST slack cover a skipped daily event during spring-forward.
  for (
    let instant = start;
    instant <= start + 49 * 60 * 60000;
    instant += 60000
  ) {
    const parts = formatter.formatToParts(instant);
    const hour = Number(parts.find((part) => part.type === "hour")?.value);
    const minute = Number(parts.find((part) => part.type === "minute")?.value);
    if (minutes.has(hour * 60 + minute)) return instant;
  }
  return null;
}

export function formatCountdown(milliseconds: number): string {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  return [
    Math.floor(seconds / 3600),
    Math.floor(seconds / 60) % 60,
    seconds % 60,
  ]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
}

const formatClock = (minuteOfDay: number): string => {
  const hour = Math.floor(minuteOfDay / 60);
  const minute = minuteOfDay % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

/**
 * Plain description of a daily event schedule. Hours may be fractional (0.5 = 00:30).
 * "Every N hours" only when the starts repeat evenly around the whole day; otherwise the times.
 */
export const describeDailySchedule = (hours: number[]): string => {
  const minutes = [
    ...new Set(
      hours
        .filter((hour) => Number.isFinite(hour) && hour >= 0 && hour < 24)
        .map((hour) => Math.round(hour * 60))
        .filter((minute) => minute < 1440),
    ),
  ].sort((a, b) => a - b);
  if (minutes.length === 0) return "Not scheduled";

  const step = minutes.length > 1 ? minutes[1] - minutes[0] : 0;
  const repeatsAllDay =
    step > 0 &&
    step * minutes.length === 1440 &&
    minutes.every(
      (minute, index) => index === 0 || minute - minutes[index - 1] === step,
    );

  if (!repeatsAllDay) {
    return minutes.map(formatClock).join(", ");
  }

  const everyHours = step / 60;
  const every = Number.isInteger(everyHours)
    ? String(everyHours)
    : everyHours.toFixed(1);
  const first = minutes[0];
  if (first === 0) return `Every ${every} hours`;
  if (first < 60) {
    return `Every ${every} hours, at :${String(first).padStart(2, "0")}`;
  }
  return `Every ${every} hours, from ${formatClock(first)}`;
};
