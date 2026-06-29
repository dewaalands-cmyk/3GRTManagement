import Link from "next/link";
import { CalendarDays, Images, MessageSquareQuote, Handshake, Swords, BadgeDollarSign, Inbox, ArrowRight, AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/admin/PageTitle";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

async function getCounts() {
  try {
    const [events, galleries, testimonials, partners, services, packages, pending] = await Promise.all([
      prisma.event.count(),
      prisma.gallery.count(),
      prisma.testimonial.count(),
      prisma.partner.count(),
      prisma.service.count(),
      prisma.package.count(),
      prisma.message.count({ where: { status: "pending" } }),
    ]);
    return { events, galleries, testimonials, partners, services, packages, pending };
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const c = await getCounts();

  const cards = [
    { label: "Event", value: c?.events ?? 0, href: "/admin/event", icon: CalendarDays },
    { label: "Galeri", value: c?.galleries ?? 0, href: "/admin/galeri", icon: Images },
    { label: "Testimoni", value: c?.testimonials ?? 0, href: "/admin/testimoni", icon: MessageSquareQuote },
    { label: "Mitra", value: c?.partners ?? 0, href: "/admin/mitra", icon: Handshake },
    { label: "Layanan", value: c?.services ?? 0, href: "/admin/layanan", icon: Swords },
    { label: "Paket Sponsorship", value: c?.packages ?? 0, href: "/admin/sponsorship", icon: BadgeDollarSign },
  ];

  return (
    <>
      <PageTitle title="Dashboard" subtitle="Ringkasan konten situs 3GRT Management." />

      {!c && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber/30 bg-amber/10 p-4 text-sm text-amber">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>Database belum tersambung atau belum di-migrasi. Jalankan <code className="rounded bg-ink px-1.5 py-0.5">npx prisma db push</code> lalu <code className="rounded bg-ink px-1.5 py-0.5">npm run seed</code>.</p>
        </div>
      )}

      {/* Pesan menunggu */}
      <Link href="/admin/pesan" className="mb-6 flex items-center justify-between rounded-2xl border border-crimson/30 bg-gradient-to-r from-crimson/15 to-ink-2 p-6 transition-transform hover:-translate-y-0.5">
        <div className="flex items-center gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-crimson/20">
            <Inbox className="h-6 w-6 text-crimson-light" />
          </span>
          <div>
            <p className="font-heading text-2xl font-bold text-bone">{c?.pending ?? 0}</p>
            <p className="text-sm text-muted">Pesan menunggu ditinjau</p>
          </div>
        </div>
        <ArrowRight className="h-5 w-5 text-muted" />
      </Link>

      {/* Statistik konten */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="group rounded-2xl border border-line bg-ink-2 p-6 transition-all hover:-translate-y-1 hover:border-line hover:shadow-card">
            <div className="flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-crimson/15 to-amber/15">
                <card.icon className="h-5 w-5 text-amber" />
              </span>
              <ArrowRight className="h-4 w-4 text-muted-dark transition-transform group-hover:translate-x-1 group-hover:text-amber" />
            </div>
            <p className="mt-4 font-heading text-3xl font-extrabold text-bone">{card.value}</p>
            <p className="mt-1 text-sm text-muted">{card.label}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
