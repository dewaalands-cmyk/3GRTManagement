import { NextResponse } from "next/server";
import { getContent } from "@/lib/content";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

// Returns the full SiteContentData with raw data URLs (for admin editors).
// Fetching this client-side instead of embedding in server HTML keeps pages fast.
export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  const content = await getContent({ raw: true });
  return NextResponse.json(content);
}
