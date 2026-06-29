import type { Metadata } from "next";
import { EventCard } from "@/components/sections/EventCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/ui/Reveal";
import { CTA } from "@/components/sections/CTA";
import { getEvents } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Event",
  description: "Daftar event combat sport yang diselenggarakan 3GRT Management — dari championship internasional hingga event mendatang.",
};

export default async function EventPage() {
  const events = await getEvents();
  return (
    <>
      <PageHeader eyebrow="Rekam Jejak" title="Event Kami" subtitle="Panggung tempat para petarung membuktikan diri dan menulis sejarah." />
      <section className="py-20 md:py-28">
        <div className="wrap">
          {events.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((e, i) => (
                <Reveal key={e.id} delay={(i % 3) * 0.06}><EventCard event={e} /></Reveal>
              ))}
            </div>
          ) : (
            <EmptyState title="Belum ada event" desc="Event akan segera diumumkan. Pantau terus halaman ini." />
          )}
        </div>
      </section>
      <CTA title="Ingin Menggelar Event?" subtitle="Dari konsep hingga eksekusi, kami siap mewujudkan event combat sport impian Anda." />
    </>
  );
}
