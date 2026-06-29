import { Icon } from "@/components/ui/Icon";

export function ServiceCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-line bg-ink-2 p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-line hover:shadow-card">
      <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-crimson to-amber transition-transform duration-300 group-hover:scale-x-100" />
      <div className="grid h-14 w-14 place-items-center rounded-xl bg-gradient-to-br from-crimson/15 to-amber/15">
        <Icon name={icon} className="h-7 w-7 text-amber" />
      </div>
      <h3 className="mt-6 font-heading text-xl font-semibold uppercase tracking-wide text-bone">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-white/70">{description}</p>
    </div>
  );
}
