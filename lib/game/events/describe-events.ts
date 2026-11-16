import type { EventScheduleEntry, GameEvent } from "@/lib/game/server-config";
import { describeDailySchedule } from "@/lib/utils/event-schedule";

/** A scheduled event as the public pages describe it. */
export type PublicEvent = {
  id: string;
  name: string;
  /** "Every 2 hours", "20:00", "Sunday 20:00". Times are in SERVER_TIME_ZONE. */
  schedule: string;
  durationMinutes: number;
  /** Bonuses ("+150% experience") and the maps an invasion spawns on. */
  details: string[];
};

/** EventScheduleEntry.dayOfWeek: 1 = Sunday ... 7 = Saturday. */
const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const toHours = (entry: EventScheduleEntry) => entry.hour + entry.minute / 60;

const clock = (entry: EventScheduleEntry) =>
  `${String(entry.hour).padStart(2, "0")}:${String(entry.minute).padStart(2, "0")}`;

const describeSchedule = (schedule: EventScheduleEntry[]): string => {
  const daily = schedule.filter((entry) => entry.dayOfWeek === null);
  const weekly = schedule
    .filter((entry) => entry.dayOfWeek !== null)
    .map((entry) => {
      const day = DAY_NAMES[(entry.dayOfWeek ?? 0) - 1];
      return day ? `${day} ${clock(entry)}` : null;
    })
    .filter((text): text is string => text !== null);

  const parts = [
    ...(daily.length > 0 ? [describeDailySchedule(daily.map(toHours))] : []),
    ...weekly,
  ];
  return parts.length > 0 ? parts.join(", ") : "Not scheduled";
};

// Bonus types whose value is a percentage added on top (see GameEvent.bonuses).
const PERCENT_BONUS_LABELS: Record<string, string> = {
  experience: "experience",
  itemDrop: "item drop",
};

const describeDetails = (
  event: GameEvent,
  mapNames: Record<number, string>,
): string[] => {
  const bonuses = (event.bonuses ?? []).flatMap((bonus) => {
    const label = PERCENT_BONUS_LABELS[bonus.type];
    return label ? [`+${bonus.value}% ${label}`] : [];
  });
  const maps = (event.maps ?? [])
    .map((map) => mapNames[map])
    .filter((name): name is string => Boolean(name));

  return [...bonuses, ...(maps.length > 0 ? [maps.join(", ")] : [])];
};

/** The server's enabled events, in the order the server lists them. */
export const describeEvents = (
  events: GameEvent[],
  mapNames: Record<number, string>,
): PublicEvent[] =>
  events
    .filter((event) => event.enabled)
    .map((event) => ({
      id: event.id,
      name: event.name,
      schedule: describeSchedule(event.schedule),
      durationMinutes: event.durationMinutes,
      details: describeDetails(event, mapNames),
    }));
