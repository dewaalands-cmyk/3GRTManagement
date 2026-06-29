import { PrismaClient } from "@prisma/client";

// eslint-disable-next-line no-var
declare global { var _prisma: PrismaClient | undefined }

function buildClient(): PrismaClient {
  if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaLibSql } = require("@prisma/adapter-libsql") as { PrismaLibSql: new (config: { url: string; authToken: string }) => unknown };
    const adapter = new PrismaLibSql({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    // @ts-expect-error adapter typing mismatch across prisma versions
    return new PrismaClient({ adapter });
  }
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error"] : [],
  });
}

export const prisma: PrismaClient =
  globalThis._prisma ?? (globalThis._prisma = buildClient());
