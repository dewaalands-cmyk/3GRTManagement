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
          <Reveal>
            <ul className="space-y-3">
              {about.points.map((pt, i) => (
                <li key={i} className="flex items-center gap-4 rounded-xl border border-line bg-ink-2 px-6 py-5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-amber/15">
                    <Check className="h-4 w-4 text-amber" />
                  </span>
                  <span className="font-medium text-bone/90">{pt}</span>
                </li>
              ))}
            </ul>
          </Reveal>
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
