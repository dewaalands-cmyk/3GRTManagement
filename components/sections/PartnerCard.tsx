import { SmartImage } from "@/components/ui/SmartImage";

interface P { name: string; logoUrl?: string | null; url?: string | null }

export function PartnerCard({ p }: { p: P }) {
  const body = p.logoUrl ? (
    <SmartImage src={p.logoUrl} alt={p.name} width={160} height={80} className="max-h-16 w-auto object-contain" />
  ) : (
    <span className="text-center font-heading text-lg font-bold uppercase tracking-wide text-ink">{p.name}</span>
  );
  const cls = "grid aspect-[16/7] place-items-center rounded-2xl border border-line bg-transparent p-6 transition-transform duration-300 hover:-translate-y-1";
  return p.url ? (
    <a href={p.url} target="_blank" rel="noopener noreferrer" className={cls} aria-label={p.name}>{body}</a>
  ) : (
    <div className={cls}>{body}</div>
  );
}
