import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Pkg { name: string; price: string; description?: string | null; features: string[] | unknown; highlighted: boolean }

export function SponsorshipCard({ pkg }: { pkg: Pkg }) {
  return (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-2xl border p-8 transition-all duration-300",
        pkg.highlighted
          ? "border-crimson/50 bg-gradient-to-b from-crimson/10 to-ink-2 shadow-glow"
          : "border-line bg-ink-2 hover:-translate-y-1.5 hover:shadow-card"
      )}
    >
      {pkg.highlighted && (
        <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-crimson px-3 py-1 font-heading text-[11px] font-bold uppercase tracking-wider text-white">
          <Star className="h-3 w-3 fill-white" /> Populer
        </span>
      )}
      <h3 className="font-heading text-2xl font-bold uppercase tracking-wide text-bone">{pkg.name}</h3>
      <p className="mt-2 font-heading text-3xl font-extrabold text-gradient">{pkg.price}</p>
      {pkg.description && <p className="mt-3 text-sm text-muted">{pkg.description}</p>}
      <ul className="mt-6 flex-1 space-y-3">
        {(pkg.features as string[]).map((f, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-bone/85">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber" /> {f}
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Button href="#kontak" variant={pkg.highlighted ? "primary" : "dark"} className="w-full">
          Pilih Paket
        </Button>
      </div>
    </div>
  );
}
