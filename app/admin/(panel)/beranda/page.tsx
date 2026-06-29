import { PageTitle } from "@/components/admin/PageTitle";
import { BerandaEditor } from "@/components/admin/BerandaEditor";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kelola Beranda" };

export default async function BerandaPage() {
  const content = await getContent();
  return (
    <>
      <PageTitle title="Beranda" subtitle="Edit konten yang tampil di halaman utama situs." />
      <BerandaEditor initial={content} />
    </>
  );
}
