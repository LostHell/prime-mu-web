import type { GameEvent } from "@/lib/game/server-config";
import { describeEvents } from "./describe-events";

const maps = { 0: "Lorencia", 2: "Devias", 7: "Atlans" };

const event = (overrides: Partial<GameEvent>): GameEvent => ({
  id: "bloodCastle",
  name: "Blood Castle",
  enabled: true,
  durationMinutes: 15,
  schedule: [],
  ...overrides,
});

test("describes each enabled event with its schedule and length", () => {
  const events = describeEvents(
    [
      event({
        schedule: [0, 6, 12, 18].map((hour) => ({
          dayOfWeek: null,
          hour,
          minute: 0,
        })),
      }),
      event({
        id: "devilSquare",
        name: "Devil Square",
        durationMinutes: 20,
        schedule: [{ dayOfWeek: null, hour: 0, minute: 30 }],
      }),
    ],
    maps,
  );

  expect(events).toEqual([
    {
      id: "bloodCastle",
      name: "Blood Castle",
      schedule: "Every 6 hours",
      durationMinutes: 15,
      details: [],
    },
    {
      id: "devilSquare",
      name: "Devil Square",
      schedule: "00:30",
      durationMinutes: 20,
      details: [],
    },
  ]);
});

test("leaves out an event that is switched off", () => {
  expect(describeEvents([event({ enabled: false })], maps)).toEqual([]);
});

test("names an event's percentage bonuses and the maps an invasion spawns on", () => {
  const [happyHour, dragon] = describeEvents(
    [
      event({
        id: "bonus-0",
        name: "Happy Hour",
        schedule: [{ dayOfWeek: null, hour: 20, minute: 0 }],
        bonuses: [
          { type: "experience", value: 150 },
          { type: "itemDrop", value: 50 },
          { type: "resetAmount", value: 2 },
        ],
      }),
      event({
        id: "invasion-0",
        name: "Golden Dragon",
        schedule: [{ dayOfWeek: null, hour: 4, minute: 0 }],
        maps: [0, 7, 99],
      }),
    ],
    maps,
  );

  expect(happyHour.details).toEqual(["+150% experience", "+50% item drop"]);
  expect(dragon.details).toEqual(["Lorencia, Atlans"]);
});

test("names the day of a weekly event", () => {
  const [weekly] = describeEvents(
    [
      event({
        schedule: [
          { dayOfWeek: 1, hour: 20, minute: 0 },
          { dayOfWeek: 7, hour: 18, minute: 30 },
        ],
      }),
    ],
    maps,
  );

  expect(weekly.schedule).toBe("Sunday 20:00, Saturday 18:30");
});
