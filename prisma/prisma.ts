import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./generated/prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST ?? "localhost",
  port: Number(process.env.DATABASE_PORT) || 3306,
  user: process.env.DATABASE_USER ?? "root",
  password: process.env.DATABASE_PASSWORD ?? "",
  database: process.env.DATABASE_NAME ?? "",
  connectionLimit: 5,
  allowPublicKeyRetrieval: true,
});

const cachedPrisma = globalThis.prisma;
const canReuseCachedClient = Boolean(
  cachedPrisma &&
  "marketplaceListing" in cachedPrisma &&
  "accountCredits" in cachedPrisma &&
  "warehouse" in cachedPrisma,
);

const createPrismaClient = () => new PrismaClient({ adapter });

export const prisma: PrismaClient = canReuseCachedClient ? (cachedPrisma as PrismaClient) : createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
