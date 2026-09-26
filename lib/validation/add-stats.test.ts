import { addStatsSchema } from "./add-stats";

test("rejects unsupported Command allocations instead of spending unassigned points", () => {
  const allocation = {
    characterName: "Knight",
    str: 5,
    agi: 0,
    vit: 0,
    ene: 0,
    cmd: 0,
  };
  expect(addStatsSchema.safeParse(allocation).success).toBe(true);
  expect(addStatsSchema.safeParse({ ...allocation, cmd: 5 }).success).toBe(
    false,
  );
});
