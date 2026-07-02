import { ArrowUpRight } from "lucide-react";
import { SmartImage } from "@/components/ui/SmartImage";

interface Partner { id: string; name: string; logoUrl?: string | null; url?: string | null }

export function PartnerStrip({ partners }: { partners: Partner[] }) {
  if (!partners.length) return null;
  return (
    <section className="border-t border-line bg-ink-2 py-16 md:py-20">
      <div className="wrap">
        <div className="mb-12 text-center">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.25em] text-amber">Kolaborasi</p>
          <h2 className="mt-3 font-heading text-3xl font-extrabold uppercase tracking-wide text-bone md:text-4xl">
            Mitra <span className="text-crimson">&</span> Sponsor
          </h2>
          <p className="mt-3 text-white/70">Bersama mitra terpercaya demi ekosistem combat sport yang lebih kuat.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((p) => {
            const inner = (
              <div className="flex flex-col items-center gap-5 rounded-2xl border border-line bg-ink-3 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-amber/40">
                <div className="flex h-24 w-24 items-center justify-center rounded-xl border border-line bg-ink-2 p-3">
                  {p.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.logoUrl} alt={p.name} loading="lazy" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-2xl font-black text-bone">{p.name.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-heading text-base font-bold uppercase tracking-wide text-bone">{p.name}</h3>
                  {p.url && (
                    <span className="mt-2 inline-flex items-center gap-1 font-heading text-xs font-semibold uppercase tracking-widest text-crimson">
                      Kunjungi Website <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>
              </div>
            );
            return p.url ? (
              <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer">{inner}</a>
            ) : (
              <div key={p.id}>{inner}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

