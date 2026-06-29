import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await getSession())) return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  const { status } = await req.json();
  const item = await prisma.message.update({ where: { id: params.id }, data: { status } });
  return NextResponse.json(item);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!(await getSession())) return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  await prisma.message.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
