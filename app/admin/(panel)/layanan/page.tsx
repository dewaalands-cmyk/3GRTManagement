import { PageTitle } from "@/components/admin/PageTitle";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { SectionBgEditor } from "@/components/admin/SectionBgEditor";
import { getContent } from "@/lib/content";
export const dynamic = "force-dynamic";
export const metadata = { title: "Kelola Layanan" };
export default async function Page() {
  const content = await getContent({ raw: true });
  return (
    <>
      <PageTitle title="Layanan" subtitle="Kelola daftar layanan yang ditawarkan." />
      <SectionBgEditor label="Background Section Layanan" contentKey="layananBg" initialValue={content.layananBg} />
      <ResourceManager resourceKey="services" />
    </>
  );
}
