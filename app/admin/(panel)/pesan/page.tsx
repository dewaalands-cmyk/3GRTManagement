import { SectionBgEditor } from "@/components/admin/SectionBgEditor";
import { getContent } from "@/lib/content";
import PesanClient from "./PesanClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Pesan Masuk" };

export default async function PesanPage() {
  const content = await getContent();
  return (
    <>
      <SectionBgEditor label="Background Section Kontak" contentKey="kontakBg" initialValue={content.kontakBg} />
      <PesanClient />
    </>
  );
}
