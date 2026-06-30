import type { Metadata } from "next";
import { ServiceBlock } from "@/components/sections/ServiceBlock";
import { SponsorshipCard } from "@/components/sections/SponsorshipCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CTA } from "@/components/sections/CTA";
import { getContent } from "@/lib/content";
import { getServices, getPackages } from "@/lib/data";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Layanan & Sponsorship",
  description: "Layanan lengkap 3GRT Management: event organizer combat sport, manajemen atlet, matchmaking, siaran, hingga paket sponsorship untuk brand Anda.",
};

export default async function LayananPage() {
  const [content, services, packages] = await Promise.all([getContent(), getServices(), getPackages()]);

  return (
    <>
      <PageHeader eyebrow={content.servicesIntro.eyebrow} title={content.servicesIntro.title} subtitle={content.servicesIntro.subtitle} />

      {services.length > 0 && (
        <section className="py-10 md:py-16">
          <div className="wrap">
            {services.map((s, i) => (
              <ServiceBlock
                key={s.id}
                title={s.title}
                description={s.description}
                imageUrl={s.imageUrl ?? undefined}
                imagePosition={(s.imagePosition as "left" | "right") ?? "right"}
                index={i}
              />
            ))}
          </div>
        </section>
      )}

      {packages.length > 0 && (
        <section className="border-t border-line bg-ink-2 py-20 md:py-28">
          <div className="wrap">
            <SectionHeading eyebrow={content.sponsorshipIntro.eyebrow} title={content.sponsorshipIntro.title} subtitle={content.sponsorshipIntro.subtitle} align="center" />
            <div className="mt-14 grid items-stretch gap-5 md:grid-cols-3">
              {packages.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 0.06}>
                  <SponsorshipCard pkg={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTA title="Butuh Solusi Khusus?" subtitle="Setiap kebutuhan unik. Hubungi kami untuk diskusi dan penawaran yang disesuaikan dengan tujuan Anda." buttonLabel="Konsultasi Gratis" />
    </>
  );
}

