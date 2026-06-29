"use client";
import { useState } from "react";
import { X } from "lucide-react";

export function TagsInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState("");
  const list = value || [];

  function add() {
    const t = input.trim();
    if (t) {
      onChange([...list, t]);
      setInput("");
    }
  }

  return (
    <div className="rounded-xl border border-line bg-ink-3 p-2.5">
      {list.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {list.map((t, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 text-sm text-bone">
              {t}
              <button type="button" onClick={() => onChange(list.filter((_, j) => j !== i))} aria-label="Hapus">
                <X className="h-3.5 w-3.5 text-muted hover:text-crimson" />
              </button>
            </span>
          ))}
        </div>
      )}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
        placeholder="Ketik lalu tekan Enter"
        className="w-full bg-transparent px-1.5 py-1 text-sm text-bone placeholder:text-muted-dark focus:outline-none"
      />
    </div>
  );
}
