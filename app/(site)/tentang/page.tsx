import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Timeline } from "@/components/sections/Timeline";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CTA } from "@/components/sections/CTA";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Tentang Kami",
  description: "Mengenal 3GRT Management — perjalanan, nilai, dan komitmen kami sebagai penyelenggara event combat sport profesional di Indonesia.",
};

export default async function TentangPage() {
  const content = await getContent();
  const { about, timeline } = content;

  return (
    <>
      <PageHeader eyebrow={about.eyebrow} title={about.title} />

      {/* Narasi + poin */}
      <section className="py-20 md:py-28">
        <div className="wrap grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="space-y-5">
              {about.paragraphs.map((p, i) => (
                <p key={i} className="text-muted">{p}</p>
              ))}
            </div>
          </Reveal>
          {about.mediaUrl && (
            <Reveal>
              <div className="aspect-square w-full overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={about.mediaUrl} alt="Tentang Kami" className="h-full w-full object-cover" />
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Timeline */}
      {timeline.length > 0 && (
        <section className="border-t border-line bg-ink-2 py-20 md:py-28">
          <div className="wrap">
            <SectionHeading eyebrow="Perjalanan Kami" title="Dari Garut, Menuju Panggung Dunia" align="center" className="mb-14" />
            <Timeline items={timeline} />
          </div>
        </section>
      )}

      <CTA title="Mari Bertumbuh Bersama 3GRT" subtitle="Jadilah bagian dari perjalanan kami membangun panggung combat sport terbaik di Indonesia." />
    </>
  );
}
