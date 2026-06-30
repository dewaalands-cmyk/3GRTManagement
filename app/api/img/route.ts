import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Images are CDN-cached for 1 hour; browser keeps stale copy for 24h while revalidating.
const CACHE = "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400";

export const dynamic = "force-dynamic";

async function resolveDataUrl(key: string): Promise<string | null> {
  const [type, ...rest] = key.split(":");

  if (type === "content") {
    const [contentKey, field] = rest;
    const row = await prisma.siteContent.findUnique({ where: { key: contentKey } });
    if (!row) return null;
    if (field) {
      try {
        // row.value from Prisma Json is already parsed; fallback for raw strings
        const parsed = typeof row.value === "string"
          ? JSON.parse(row.value as string)
          : row.value;
        return (parsed as Record<string, unknown>)?.[field] as string ?? null;
      } catch { return null; }
    }
    return row.value as string;
  }

  if (type === "resource") {
    const [resource, id, field] = rest;
    type AnyRecord = Record<string, string | null>;
    const queries: Record<string, () => Promise<AnyRecord | null>> = {
      services:  () => prisma.service.findUnique({ where: { id } }) as Promise<AnyRecord | null>,
      events:    () => prisma.event.findUnique({ where: { id } }) as Promise<AnyRecord | null>,
      partners:  () => prisma.partner.findUnique({ where: { id } }) as Promise<AnyRecord | null>,
      galleries: () => prisma.gallery.findUnique({ where: { id } }) as Promise<AnyRecord | null>,
    };
    const row = await queries[resource]?.();
    return row?.[field] ?? null;
  }

  return null;
}

export async function GET(req: Request) {
  const key = new URL(req.url).searchParams.get("k") ?? "";
  if (!key) return new NextResponse("Bad request", { status: 400 });

  let dataUrl: string | null = null;
  try {
    dataUrl = await resolveDataUrl(key);
  } catch {
    return new NextResponse("Server error", { status: 500 });
  }

  if (!dataUrl?.startsWith("data:image") && !dataUrl?.startsWith("data:video")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const comma = dataUrl.indexOf(",");
  const header = dataUrl.slice(0, comma);
  const b64    = dataUrl.slice(comma + 1);
  const mime   = header.match(/data:(.*?);/)?.[1] ?? "image/jpeg";
  const binary = Buffer.from(b64, "base64");

  return new NextResponse(binary, {
    headers: {
      "Content-Type": mime,
      "Cache-Control": CACHE,
    },
  });
}
