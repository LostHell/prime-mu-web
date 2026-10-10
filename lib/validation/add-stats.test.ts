import { addStatsSchema } from "./add-stats";

test("does not treat command as an allocatable stat", () => {
  const result = addStatsSchema.safeParse({
    characterName: "Knight",
    str: 5,
    agi: 0,
    vit: 0,
    ene: 0,
    cmd: 5,
  });
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data).not.toHaveProperty("cmd");
  }
});
