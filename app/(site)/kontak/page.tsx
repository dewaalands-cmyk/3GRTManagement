import type { Metadata } from "next";
import { MessageCircle, Mail, MapPin, Clock, Instagram, Youtube } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactForm } from "@/components/forms/ContactForm";
import { AthleteForm } from "@/components/forms/AthleteForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Kontak",
  description: "Hubungi 3GRT Management. Baik atlet, sponsor, maupun promotor — tim kami siap berdiskusi mewujudkan kolaborasi terbaik.",
};

export default async function KontakPage() {
  const content = await getContent();
  const c = content.contact;
  const wa = `https://wa.me/${c.wa}`;

  const rows = [
    { icon: MessageCircle, label: "WhatsApp", value: c.waDisplay, href: wa, color: "text-[#25D366]" },
    { icon: Mail, label: "Email", value: c.email, href: `mailto:${c.email}`, color: "text-crimson" },
    { icon: MapPin, label: "Lokasi", value: c.location, color: "text-amber" },
    { icon: Clock, label: "Venue", value: c.address, color: "text-bone" },
  ];

  return (
    <>
      <PageHeader eyebrow="Hubungi Kami" title="Mari Bangun Langkah Berikutnya" subtitle="Atlet, sponsor, atau promotor — tim 3GRT siap berdiskusi dan menyusun solusi terbaik untuk Anda." />

      {/* Info + form kontak */}
      <section className="py-20 md:py-28">
        <div className="wrap grid items-start gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-heading text-2xl font-bold uppercase tracking-wide text-bone">Informasi Kontak</h2>
            <p className="mt-3 text-muted">Pilih kanal yang paling nyaman untuk Anda. Kami merespons dengan cepat.</p>
            <ul className="mt-8 space-y-4">
              {rows.map((r) => {
                const Inner = (
                  <>
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-line bg-ink-2">
                      <r.icon className={`h-5 w-5 ${r.color}`} />
                    </span>
                    <span>
                      <span className="block font-heading text-xs font-medium uppercase tracking-wider text-muted">{r.label}</span>
                      <span className="font-medium text-bone">{r.value}</span>
                    </span>
                  </>
                );
                return (
                  <li key={r.label}>
                    {r.href ? (
                      <a href={r.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 transition-opacity hover:opacity-80">{Inner}</a>
                    ) : (
                      <div className="flex items-center gap-4">{Inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 flex gap-3">
              <a href={c.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-11 w-11 place-items-center rounded-lg border border-line text-bone/70 transition-colors hover:border-amber hover:text-amber"><Instagram className="h-5 w-5" /></a>
              <a href={c.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="grid h-11 w-11 place-items-center rounded-lg border border-line text-bone/70 transition-colors hover:border-amber hover:text-amber"><Youtube className="h-5 w-5" /></a>
              <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="grid h-11 w-11 place-items-center rounded-lg border border-line text-bone/70 transition-colors hover:border-amber hover:text-amber"><MessageCircle className="h-5 w-5" /></a>
            </div>
          </Reveal>

          <Reveal>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      {/* Pendaftaran atlet */}
      <section className="border-t border-line bg-ink-2 py-20 md:py-28">
        <div className="wrap">
          <SectionHeading eyebrow="Untuk Para Petarung" title="Bergabung Sebagai Atlet" subtitle="Punya semangat juang dan ingin naik ring? Daftarkan diri Anda dan tim matchmaking kami akan meninjau profil Anda." align="center" className="mb-12" />
          <div className="mx-auto max-w-2xl">
            <Reveal><AthleteForm /></Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
