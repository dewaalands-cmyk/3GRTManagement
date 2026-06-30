import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

function parseValue(v: unknown) {
  if (typeof v === "string") { try { return JSON.parse(v); } catch { return v; } }
  return v;
}

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  const rows = await prisma.siteContent.findMany();
  return NextResponse.json(rows.map((r) => ({ ...r, value: parseValue(r.value) })));
}

// Strip proxy URLs (e.g. /api/img?k=...) recursively so they never reach the DB.
// If a proxy URL ends up stored, images appear broken because the proxy can't
// find real data — it just gets the proxy URL back in an infinite loop.
function stripProxyUrls(v: unknown): unknown {
  if (typeof v === "string") {
    return v.startsWith("/api/img?") ? "" : v;
  }
  if (Array.isArray(v)) return v.map(stripProxyUrls);
  if (v && typeof v === "object") {
    return Object.fromEntries(
      Object.entries(v as Record<string, unknown>).map(([k, val]) => [k, stripProxyUrls(val)])
    );
  }
  return v;
}

export async function PUT(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  try {
    const { key, value } = await req.json();
    if (!key) return NextResponse.json({ error: "Key wajib" }, { status: 400 });
    const clean = stripProxyUrls(value);
    const stored = typeof clean === "string" ? clean : JSON.stringify(clean);
    const row = await prisma.siteContent.upsert({
      where: { key },
      update: { value: stored },
      create: { key, value: stored },
    });
    // Update save-timestamp so proxy URLs get a new &v= and CDN cache is busted
    const ts = String(Date.now());
    await prisma.siteContent.upsert({
      where: { key: "_ts" },
      update: { value: ts },
      create: { key: "_ts", value: ts },
    });
    // Invalidate ISR cache immediately so public site reflects new content
    revalidatePath("/", "layout");
    return NextResponse.json({ ...row, value: parseValue(row.value) });
  } catch {
    return NextResponse.json({ error: "Gagal menyimpan" }, { status: 400 });
  }
}
