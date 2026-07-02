"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, House, CalendarDays, Images, MessageSquareQuote, Handshake,
  Swords, BadgeDollarSign, FileText, Inbox, Settings, LogOut, Menu, ExternalLink, ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    label: null,
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/beranda", label: "Beranda", icon: House },
    ],
  },
  {
    label: "Tentang",
    items: [
      { href: "/admin/mitra", label: "Mitra", icon: Handshake },
    ],
  },
  {
    label: "Layanan",
    items: [
      { href: "/admin/layanan", label: "Layanan", icon: Swords },
    ],
  },
  {
    label: "Event",
    items: [
      { href: "/admin/event", label: "Event", icon: CalendarDays },
    ],
  },
  {
    label: "Merchandise",
    items: [
      { href: "/admin/merchandise", label: "Merchandise", icon: ShoppingBag },
    ],
  },
  {
    label: "Kontak",
    items: [
      { href: "/admin/pesan", label: "Pesan Masuk", icon: Inbox },
    ],
  },
  {
    label: "Sistem",
    items: [
      { href: "/admin/konten", label: "Konten Halaman", icon: FileText },
      { href: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
    ],
  },
];

export function AdminShell({ username, logoUrl, children }: { username: string; logoUrl?: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const SidebarContent = (
    <>
      <div className="px-6 py-5">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt="3GRT Management" className="h-10 w-auto max-w-[160px] object-contain" />
        ) : (
          <span className="inline-flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-crimson to-amber shadow-glow">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" aria-hidden>
                <path d="M12 2l2.2 5.6L20 8l-4.5 4 1.5 6.5L12 15l-5 3.5L8.5 12 4 8l5.8-.4z" />
              </svg>
            </span>
            <span className="font-heading text-xl font-bold tracking-wider text-bone">
              3GRT<span className="text-crimson">.</span>
            </span>
          </span>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi} className={gi > 0 ? "mt-4" : ""}>
            {group.label && (
              <p className="mb-1 px-3 py-1 font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-muted/60">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive(n.href) ? "bg-crimson/15 text-amber" : "text-bone/70 hover:bg-ink-3 hover:text-bone"
                  )}
                >
                  <n.icon className="h-[18px] w-[18px] shrink-0" />
                  {n.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-line p-3">
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-bone/70 transition-colors hover:bg-ink-3 hover:text-bone">
          <ExternalLink className="h-[18px] w-[18px]" /> Lihat Situs
        </a>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-bone/70 transition-colors hover:bg-crimson/15 hover:text-crimson-light">
          <LogOut className="h-[18px] w-[18px]" /> Keluar
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-ink">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-ink-2 lg:flex">
        {SidebarContent}
      </aside>

      {/* Drawer mobile */}
      <div className={cn("fixed inset-0 z-40 lg:hidden", open ? "" : "pointer-events-none")}>
        <div className={cn("absolute inset-0 bg-black/60 transition-opacity", open ? "opacity-100" : "opacity-0")} onClick={() => setOpen(false)} />
        <aside className={cn("absolute inset-y-0 left-0 flex w-64 flex-col border-r border-line bg-ink-2 transition-transform", open ? "translate-x-0" : "-translate-x-full")}>
          {SidebarContent}
        </aside>
      </div>

      {/* Konten */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-ink/85 px-5 py-3.5 backdrop-blur-lg">
          <button onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-lg border border-line lg:hidden" aria-label="Buka menu">
            <Menu className="h-5 w-5" />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-muted">Halo, <span className="font-semibold text-bone">{username}</span></span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-crimson to-amber font-heading text-sm font-bold text-ink">
              {username.slice(0, 2).toUpperCase()}
            </span>
          </div>
        </header>

        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
