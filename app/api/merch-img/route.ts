import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const CACHE = "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id") ?? "";
  const idx = Number(searchParams.get("i") ?? "0");

  if (!id) return new NextResponse("Bad request", { status: 400 });

  let row: { mediaUrls: string | null } | null = null;
  try {
    row = await prisma.merchandise.findUnique({
      where: { id },
      select: { mediaUrls: true },
    });
  } catch (err) {
    console.error("[merch-img] DB error:", err);
    return new NextResponse("Server error", { status: 500 });
  }

  if (!row) {
    console.error(`[merch-img] Record not found: id=${id}`);
    return new NextResponse("Not found", { status: 404 });
  }

  if (!row.mediaUrls) {
    console.error(`[merch-img] mediaUrls is null: id=${id}`);
    return new NextResponse("Not found", { status: 404 });
  }

  let arr: string[];
  try {
    arr = JSON.parse(row.mediaUrls);
    if (!Array.isArray(arr)) throw new Error("not array");
  } catch (err) {
    console.error(`[merch-img] JSON parse error: id=${id} raw=${row.mediaUrls.slice(0, 80)}`);
    return new NextResponse("Server error", { status: 500 });
  }

  const dataUrl = arr[idx];
  if (!dataUrl) {
    console.error(`[merch-img] Index out of range: id=${id} i=${idx} len=${arr.length}`);
    return new NextResponse("Not found", { status: 404 });
  }

  if (!dataUrl.startsWith("data:image")) {
    console.error(`[merch-img] Not a data URL: id=${id} i=${idx} prefix=${dataUrl.slice(0, 30)}`);
    return new NextResponse("Not found", { status: 404 });
  }

  const comma = dataUrl.indexOf(",");
  const mime = dataUrl.slice(0, comma).match(/data:(.*?);/)?.[1] ?? "image/jpeg";
  const binary = Buffer.from(dataUrl.slice(comma + 1), "base64");

  return new NextResponse(binary, {
    headers: {
      "Content-Type": mime,
      "Cache-Control": CACHE,
    },
  });
}
