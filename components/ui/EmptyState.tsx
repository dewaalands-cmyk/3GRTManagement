import { Inbox } from "lucide-react";

export function EmptyState({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-ink-2 px-6 py-20 text-center">
      <Inbox className="h-12 w-12 text-muted-dark" />
      <h3 className="mt-4 font-heading text-lg font-semibold text-bone">{title}</h3>
      {desc && <p className="mt-2 max-w-sm text-sm text-muted">{desc}</p>}
    </div>
  );
}
