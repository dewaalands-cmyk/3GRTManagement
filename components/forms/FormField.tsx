import { cn } from "@/lib/utils";

const base =
  "w-full rounded-xl border border-line bg-ink-3 px-4 py-3 text-bone placeholder:text-muted-dark transition-colors focus:border-amber focus-visible:ring-0 focus:outline-none";

export function Label({ htmlFor, children, className }: { htmlFor: string; children: React.ReactNode; className?: string }) {
  return (
    <label htmlFor={htmlFor} className={cn("mb-2 block font-heading text-xs font-medium uppercase tracking-wider text-muted", className)}>
      {children}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(base, props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(base, "min-h-28 resize-y", props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(base, "cursor-pointer", props.className)} />;
}
