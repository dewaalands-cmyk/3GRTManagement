import { PageTitle } from "@/components/admin/PageTitle";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { SectionBgEditor } from "@/components/admin/SectionBgEditor";
import { getContent } from "@/lib/content";
export const dynamic = "force-dynamic";
export const metadata = { title: "Kelola Testimoni" };
export default async function Page() {
  const content = await getContent();
  return (
    <>
      <PageTitle title="Testimoni" subtitle="Kelola testimoni dari atlet, mitra, dan promotor." />
      <SectionBgEditor label="Background Section Tentang" contentKey="tentangBg" initialValue={content.tentangBg} />
      <ResourceManager resourceKey="testimonials" />
    </>
  );
}
