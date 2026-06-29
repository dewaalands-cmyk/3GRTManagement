import { PageTitle } from "@/components/admin/PageTitle";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { SectionBgEditor } from "@/components/admin/SectionBgEditor";
import { getContent } from "@/lib/content";
export const dynamic = "force-dynamic";
export const metadata = { title: "Kelola Galeri" };
export default async function Page() {
  const content = await getContent();
  return (
    <>
      <PageTitle title="Galeri" subtitle="Tambahkan video YouTube atau foto dokumentasi." />
      <SectionBgEditor label="Background Section Galeri" contentKey="galeriBg" initialValue={content.galeriBg} />
      <ResourceManager resourceKey="galleries" />
    </>
  );
}
