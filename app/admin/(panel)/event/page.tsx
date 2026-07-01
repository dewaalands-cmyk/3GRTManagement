import { PageTitle } from "@/components/admin/PageTitle";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { SectionBgEditor } from "@/components/admin/SectionBgEditor";
import { getContent } from "@/lib/content";
export const dynamic = "force-dynamic";
export const metadata = { title: "Kelola Event" };
export default async function Page() {
  const content = await getContent({ raw: true });
  return (
    <>
      <PageTitle title="Event" subtitle="Kelola daftar event yang tampil di situs." />
      <SectionBgEditor label="Background Section Event" contentKey="eventBg" initialValue={content.eventBg} />
      <ResourceManager resourceKey="events" />
    </>
  );
}
