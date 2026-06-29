import { PageTitle } from "@/components/admin/PageTitle";
import { ResourceManager } from "@/components/admin/ResourceManager";
export const metadata = { title: "Kelola Mitra" };
export default function Page() {
  return (<><PageTitle title="Mitra & Sponsor" subtitle="Kelola logo mitra dan sponsor yang tampil di situs." /><ResourceManager resourceKey="partners" /></>);
}
