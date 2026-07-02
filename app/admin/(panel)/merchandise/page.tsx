import { PageTitle } from "@/components/admin/PageTitle";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { SectionBgEditor } from "@/components/admin/SectionBgEditor";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kelola Merchandise" };

export default async function Page() {
  const content = await getContent();
  return (
    <>
      <PageTitle title="Merchandise" subtitle="Kelola produk merchandise resmi 3GRT." />
      <SectionBgEditor label="Background Section Merchandise" contentKey="merchBg" initialValue={content.merchBg} />
      <ResourceManager resourceKey="merchandises" />
    </>
  );
}
