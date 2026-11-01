import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __globalPrismaClient: PrismaClient | undefined;
}

export const prisma =
  globalThis.__globalPrismaClient ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__globalPrismaClient = prisma;
}

export default prisma;

