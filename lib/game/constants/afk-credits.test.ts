/**
 * @jest-environment node
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { AFK_CREDIT_ZONES } from "./afk-credits";

// The procedure that gives the credits, as the database script creates it.
const procedure = (() => {
  const script = readFileSync(
    join(process.cwd(), "prisma", "create-db.sql"),
    "utf8",
  );
  const start = script.indexOf("CREATE PROCEDURE `ProcessZoneCreditRewards`");
  const end = script.indexOf("END $$", start);
  return script.slice(start, end);
})();

test("gives each zone's credits as often as the database procedure does", () => {
  expect(procedure).not.toBe("");
  for (const zone of AFK_CREDIT_ZONES) {
    // Both the first timer and every credit after it.
    const next = new RegExp(
      `${zone.column}NextRewardTime = NOW\\(\\) \\+ INTERVAL (\\d+) HOUR`,
      "g",
    );
    const hours = [...procedure.matchAll(next)].map((match) =>
      Number(match[1]),
    );
    expect(hours.length).toBeGreaterThan(0);
    expect(new Set(hours)).toEqual(new Set([zone.hoursPerCredit]));
  }
});

test("gives a credit, one at a time", () => {
  expect(procedure.match(/r\.Credits = r\.Credits \+ (\d+)/g)).toEqual([
    "r.Credits = r.Credits + 1",
    "r.Credits = r.Credits + 1",
  ]);
});
