import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getContent } from "@/lib/content";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const content = await getContent();
  return <AdminShell username={session.username} logoUrl={content.logoUrl}>{children}</AdminShell>;
}
