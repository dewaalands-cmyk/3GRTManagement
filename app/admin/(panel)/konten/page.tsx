import { PageTitle } from "@/components/admin/PageTitle";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kelola Konten" };

export default async function KontenPage() {
  const content = await getContent({ raw: true });
  return (
    <>
      <PageTitle title="Konten Halaman" subtitle="Edit teks yang tampil di situs. Klik Simpan di tiap bagian setelah mengubah." />
      <ContentEditor initial={content} />
    </>
  );
}
