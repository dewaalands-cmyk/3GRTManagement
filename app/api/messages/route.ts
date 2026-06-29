import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    if (!b.name || !b.contact || !b.message) {
      return NextResponse.json({ error: "Data belum lengkap" }, { status: 400 });
    }
    await prisma.message.create({
      data: {
        type: b.type === "atlet" ? "atlet" : "kontak",
        name: String(b.name).slice(0, 120),
        contact: String(b.contact).slice(0, 160),
        role: b.role ? String(b.role).slice(0, 80) : null,
        subject: b.subject ? String(b.subject).slice(0, 160) : null,
        message: String(b.message).slice(0, 4000),
      },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Gagal mengirim pesan" }, { status: 400 });
  }
}
