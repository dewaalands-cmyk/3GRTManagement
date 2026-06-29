import { NextResponse } from "next/server";
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

export async function PUT(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  try {
    const { key, value } = await req.json();
    if (!key) return NextResponse.json({ error: "Key wajib" }, { status: 400 });
    const stored = typeof value === "string" ? value : JSON.stringify(value);
    const row = await prisma.siteContent.upsert({
      where: { key },
      update: { value: stored },
      create: { key, value: stored },
    });
    return NextResponse.json({ ...row, value: parseValue(row.value) });
  } catch {
    return NextResponse.json({ error: "Gagal menyimpan" }, { status: 400 });
  }
}
