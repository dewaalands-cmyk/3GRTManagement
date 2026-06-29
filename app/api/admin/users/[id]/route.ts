import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { hashPassword } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await getSession())) return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  const { password } = await req.json();
  if (!password) return NextResponse.json({ error: "Password wajib" }, { status: 400 });
  await prisma.user.update({ where: { id: params.id }, data: { passwordHash: hashPassword(String(password)) } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  if (session.uid === params.id) return NextResponse.json({ error: "Tidak bisa menghapus akun sendiri" }, { status: 400 });
  const count = await prisma.user.count();
  if (count <= 1) return NextResponse.json({ error: "Minimal harus ada 1 admin" }, { status: 400 });
  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
