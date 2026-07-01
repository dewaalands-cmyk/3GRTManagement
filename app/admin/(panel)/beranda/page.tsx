import { BerandaEditor } from "@/components/admin/BerandaEditor";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kelola Beranda" };

export default function BerandaPage() {
  // Content loaded client-side via /api/admin/content/full to avoid embedding
  // large base64 images in server-rendered HTML (keeps initial page load fast).
  return <BerandaEditor />;
}
