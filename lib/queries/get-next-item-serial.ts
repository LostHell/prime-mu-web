import "server-only";

import { prisma } from "@/prisma/prisma";

/** `WZ_GetItemSerial` COMMITs internally — never call this on a transaction client. */
export const getNextItemSerial = async (): Promise<number> => {
  const rows = await prisma.$queryRaw<unknown[]>`CALL WZ_GetItemSerial()`;
  const raw = Object.values(rows[0] ?? {})[0];
  const serial = Number(Array.isArray(raw) ? raw[0] : raw);

  if (!Number.isInteger(serial) || serial < 1) {
    throw new Error("Failed to allocate an item serial.");
  }

  return serial;
};
