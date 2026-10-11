/** Plain description of a daily event schedule. Hours may be fractional (0.5 = 00:30). */
export const describeDailySchedule = (hours: number[]): string => {
  const minutes = hours
    .filter((hour) => Number.isFinite(hour) && hour >= 0 && hour < 24)
    .map((hour) => Math.round(hour * 60))
    .filter((minute) => minute < 1440);
  if (minutes.length === 0) return "Not scheduled";

  const step = minutes.length > 1 ? minutes[1] - minutes[0] : 0;
  const even =
    step > 0 &&
    minutes.every(
      (minute, index) => index === 0 || minute - minutes[index - 1] === step,
    );

  if (!even) {
    return minutes.map(formatClock).join(", ");
  }

  const everyHours = step / 60;
  const every = Number.isInteger(everyHours)
    ? String(everyHours)
    : everyHours.toFixed(1);
  const minute = minutes[0] % 60;
  if (minute === 0) return `Every ${every} hours`;
  return `Every ${every} hours, at :${String(minute).padStart(2, "0")}`;
};

const formatClock = (minuteOfDay: number): string => {
  const hour = Math.floor(minuteOfDay / 60);
  const minute = minuteOfDay % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};
