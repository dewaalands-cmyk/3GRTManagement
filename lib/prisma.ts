import { PrismaClient } from "@prisma/client";

// eslint-disable-next-line no-var
declare global { var _prisma: PrismaClient | undefined }

function buildClient() {
  if (process.env.NODE_ENV === "development") {
    return new PrismaClient({ log: ["error"] });
  }
  return new PrismaClient();
}

export const prisma: PrismaClient =
  globalThis._prisma ?? (globalThis._prisma = buildClient());
