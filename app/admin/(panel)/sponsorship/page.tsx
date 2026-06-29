import { PageTitle } from "@/components/admin/PageTitle";
import { ResourceManager } from "@/components/admin/ResourceManager";
export const metadata = { title: "Kelola Sponsorship" };
export default function Page() {
  return (<><PageTitle title="Paket Sponsorship" subtitle="Kelola paket dan benefit sponsorship." /><ResourceManager resourceKey="packages" /></>);
}
