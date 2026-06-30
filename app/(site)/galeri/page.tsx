import type { Metadata } from "next";
import { GalleryGrid } from "@/components/sections/GalleryGrid";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { getGalleries } from "@/lib/data";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Galeri",
  description: "Momen terbaik dari arena 3GRT â€” video pertandingan dan foto dokumentasi event combat sport.",
};

export default async function GaleriPage() {
  const items = await getGalleries();
  return (
    <>
      <PageHeader eyebrow="Galeri" title="Momen Dari Arena" subtitle="Saksikan kembali aksi-aksi terbaik dari atas ring 3GRT." />
      <section className="py-20 md:py-28">
        <div className="wrap">
          {items.length > 0 ? (
            <GalleryGrid items={items} />
          ) : (
            <EmptyState title="Galeri masih kosong" desc="Dokumentasi video dan foto akan ditambahkan setelah event berlangsung." />
          )}
        </div>
      </section>
    </>
  );
}

