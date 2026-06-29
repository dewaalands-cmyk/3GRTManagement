import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  const users = await prisma.user.findMany({
    select: { id: true, username: true, email: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  try {
    const { username, email, password } = await req.json();
    if (!username || !password) return NextResponse.json({ error: "Username & password wajib" }, { status: 400 });
    const exists = await prisma.user.findUnique({ where: { username: String(username) } });
    if (exists) return NextResponse.json({ error: "Username sudah dipakai" }, { status: 409 });
    const user = await prisma.user.create({
      data: { username: String(username), email: email ? String(email) : null, passwordHash: hashPassword(String(password)) },
      select: { id: true, username: true, email: true, createdAt: true },
    });
    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Gagal membuat user" }, { status: 400 });
  }
}
