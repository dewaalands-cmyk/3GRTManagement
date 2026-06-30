// Script satu kali: set logoUrl ke static file /logo.png di Neon DB
// Jalankan: DATABASE_URL="..." node scripts/set-logo.mjs
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.siteContent.upsert({
    where: { key: "logoUrl" },
    update: { value: "/logo.png" },
    create: { key: "logoUrl", value: "/logo.png" },
  });
  console.log("✅ logoUrl → /logo.png");
}

main().catch(console.error).finally(() => prisma.$disconnect());
