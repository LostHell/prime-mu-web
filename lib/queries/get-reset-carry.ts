import "server-only";

import { prisma } from "@/prisma/prisma";

/**
 * The resets a deleted character of this name left: the game server's `ResetCarry` table, filled by
 * `WZ_DeleteCharacter`. They come back with the first reset of the next character made with the name
 * (a class change), on any account. Not a Prisma model: the table belongs to the server's schema.
 */
export const getResetCarry = async (name: string): Promise<number> => {
  const rows = await prisma.$queryRaw<
    { Reset: number | bigint }[]
  >`SELECT Reset FROM ResetCarry WHERE Name = ${name}`;
  const resets = Number(rows[0]?.Reset ?? 0);

  return Number.isInteger(resets) && resets > 0 ? resets : 0;
};
