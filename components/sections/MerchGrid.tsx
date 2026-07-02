import { ShoppingBag } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { EmptyState } from "@/components/ui/EmptyState";

interface MerchItem {
  id: string;
  name: string;
  description?: string | null;
  price?: string | null;
  mediaUrl?: string | null;
  link?: string | null;
  badge?: string | null;
}

function isVideoUrl(url: string) {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url) || url.includes("t=video");
}

function MerchMedia({ url, name }: { url: string; name: string }) {
  if (isVideoUrl(url)) {
    return (
      <video
        src={url}
        muted
        autoPlay
        loop
        playsInline
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={url}
      alt={name}
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
  );
}

export function MerchGrid({ items }: { items: MerchItem[] }) {
  return (
    <>
      <SectionHeading
        eyebrow="Official Store"
        title="3GRT Merchandise"
        subtitle="Kenakan semangat juang. Koleksi resmi 3GRT Management."
        align="center"
        className="mb-14"
      />

      {items.length === 0 ? (
        <EmptyState title="Belum ada produk" desc="Produk merchandise akan segera tersedia. Pantau terus halaman ini." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <Reveal key={item.id}>
              <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-ink-2 transition-all duration-300 hover:-translate-y-1 hover:border-amber/40 hover:shadow-[0_0_30px_rgba(212,168,67,0.1)]">
                {/* Media */}
                <div className="relative aspect-square overflow-hidden bg-ink-3">
                  {item.mediaUrl ? (
                    <MerchMedia url={item.mediaUrl} name={item.name} />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ShoppingBag className="h-16 w-16 text-white/10" />
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Badge */}
                  {item.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-crimson px-3 py-1 font-heading text-[10px] font-bold uppercase tracking-widest text-white shadow">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h3 className="font-heading text-base font-bold uppercase leading-tight tracking-wide text-bone">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="line-clamp-2 text-sm leading-relaxed text-white/60">
                      {item.description}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-3">
                    {item.price ? (
                      <span className="font-heading text-lg font-extrabold text-amber">
                        {item.price}
                      </span>
                    ) : (
                      <span className="font-heading text-sm text-muted">Hubungi kami</span>
                    )}
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-crimson px-4 py-2 font-heading text-xs font-bold uppercase tracking-wide text-white shadow-glow transition-colors hover:bg-crimson/80"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        Pesan
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </>
  );
}
