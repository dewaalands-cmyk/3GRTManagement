import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

function hasProxyUrl(v: unknown): boolean {
  if (typeof v === "string") return v.startsWith("/api/img?");
  if (Array.isArray(v)) return v.some(hasProxyUrl);
  if (v && typeof v === "object") return Object.values(v as object).some(hasProxyUrl);
  return false;
}

function stripProxyUrls(v: unknown): unknown {
  if (typeof v === "string") return v.startsWith("/api/img?") ? "" : v;
  if (Array.isArray(v)) return v.map(stripProxyUrls);
  if (v && typeof v === "object") {
    return Object.fromEntries(
      Object.entries(v as Record<string, unknown>).map(([k, val]) => [k, stripProxyUrls(val)])
    );
  }
  return v;
}

function parseValue(raw: string): unknown {
  try { return JSON.parse(raw); } catch { return raw; }
}

export async function POST() {
  if (!(await getSession())) return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });

  const rows = await prisma.siteContent.findMany();
  const cleaned: string[] = [];

  for (const row of rows) {
    const parsed = parseValue(row.value as string);
    if (!hasProxyUrl(parsed)) continue;

    const fixed = stripProxyUrls(parsed);
    const stored = typeof fixed === "string" ? fixed : JSON.stringify(fixed);
    await prisma.siteContent.update({ where: { key: row.key }, data: { value: stored } });
    cleaned.push(row.key);
  }

  return NextResponse.json({ cleaned, count: cleaned.length });
}
