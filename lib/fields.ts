// Konfigurasi field ini AMAN dipakai di client (tanpa import server).
// Dipakai oleh ResourceManager (UI admin) sekaligus jadi allowlist field di API.

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "image"
  | "boolean"
  | "tags"
  | "paragraphs"
  | "select";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  help?: string;
  options?: { value: string; label: string }[];
}

export interface ResourceConfig {
  key: string; // segmen path API, mis. "events"
  singular: string;
  plural: string;
  titleField: string;
  subtitleField?: string;
  imageField?: string;
  fields: FieldConfig[];
}

export const ICON_OPTIONS = [
  "Swords", "Shield", "Users", "Trophy", "Video",
  "Handshake", "Megaphone", "Dumbbell", "Flame", "Crown",
  "Target", "Radio", "Medal", "Ticket", "Star",
];

export const RESOURCES: Record<string, ResourceConfig> = {
  events: {
    key: "events",
    singular: "Event",
    plural: "Event",
    titleField: "title",
    subtitleField: "date",
    imageField: "imageUrl",
    fields: [
      { name: "title", label: "Judul Event", type: "text", placeholder: "3GRT Championship 2025" },
      { name: "badge", label: "Badge", type: "text", placeholder: "INTERNASIONAL / SEGERA", help: "Label kecil di pojok kartu. Kosongkan jika tak perlu." },
      { name: "date", label: "Tanggal", type: "text", placeholder: "29-30 November 2025" },
      { name: "location", label: "Lokasi", type: "text", placeholder: "SOR Adiwidjaya, Garut" },
      { name: "description", label: "Deskripsi", type: "textarea", placeholder: "Ringkasan singkat event..." },
      { name: "imageUrl", label: "Poster / Gambar", type: "image", help: "Upload file atau tempel URL gambar." },
      { name: "link", label: "Tautan (opsional)", type: "text", placeholder: "https://..." },
      { name: "order", label: "Urutan", type: "number", help: "Angka kecil tampil lebih dulu." },
    ],
  },
  galleries: {
    key: "galleries",
    singular: "Media Galeri",
    plural: "Galeri",
    titleField: "title",
    subtitleField: "type",
    imageField: "imageUrl",
    fields: [
      { name: "title", label: "Judul", type: "text", placeholder: "Farhan Omar vs Erlangga" },
      { name: "type", label: "Tipe", type: "select", options: [
        { value: "video", label: "Video (YouTube)" },
        { value: "foto", label: "Foto" },
      ] },
      { name: "youtubeId", label: "ID Video YouTube", type: "text", placeholder: "dQw4w9WgXcQ", help: "Hanya untuk tipe Video. Bagian setelah v= atau youtu.be/" },
      { name: "imageUrl", label: "Foto", type: "image", help: "Hanya untuk tipe Foto." },
      { name: "order", label: "Urutan", type: "number" },
    ],
  },
  testimonials: {
    key: "testimonials",
    singular: "Testimoni",
    plural: "Testimoni",
    titleField: "name",
    subtitleField: "role",
    fields: [
      { name: "quote", label: "Kutipan", type: "textarea", placeholder: "3GRT memberi saya panggung yang selama ini saya impikan..." },
      { name: "name", label: "Nama", type: "text", placeholder: "Ahmad Rizky" },
      { name: "role", label: "Peran / Jabatan", type: "text", placeholder: "Atlet Muay Thai" },
      { name: "rating", label: "Rating (1-5)", type: "number", placeholder: "5" },
      { name: "order", label: "Urutan", type: "number" },
    ],
  },
  partners: {
    key: "partners",
    singular: "Mitra",
    plural: "Mitra & Sponsor",
    titleField: "name",
    imageField: "logoUrl",
    fields: [
      { name: "name", label: "Nama Mitra", type: "text", placeholder: "Muay Thai School Garut" },
      { name: "logoUrl", label: "Logo", type: "image", help: "Upload logo atau tempel URL. Kosongkan untuk tampil sebagai teks." },
      { name: "url", label: "Tautan Website (opsional)", type: "text", placeholder: "https://..." },
      { name: "order", label: "Urutan", type: "number" },
    ],
  },
  services: {
    key: "services",
    singular: "Layanan",
    plural: "Layanan",
    titleField: "title",
    subtitleField: "imagePosition",
    imageField: "imageUrl",
    fields: [
      { name: "title", label: "Judul Layanan", type: "text", placeholder: "Combat Event Organizer" },
      { name: "description", label: "Paragraf", type: "paragraphs", help: "Tambah paragraf satu per satu. Klik + untuk paragraf baru." },
      { name: "imageUrl", label: "Foto Layanan", type: "image", help: "Tampil di kiri atau kanan sesuai Posisi Foto." },
      { name: "imagePosition", label: "Posisi Foto", type: "select", options: [
        { value: "right", label: "Foto di Kanan, Teks di Kiri" },
        { value: "left", label: "Foto di Kiri, Teks di Kanan" },
      ] },
      { name: "order", label: "Urutan", type: "number" },
    ],
  },
  packages: {
    key: "packages",
    singular: "Paket Sponsorship",
    plural: "Paket Sponsorship",
    titleField: "name",
    subtitleField: "price",
    fields: [
      { name: "name", label: "Nama Paket", type: "text", placeholder: "Gold Sponsor" },
      { name: "price", label: "Harga", type: "text", placeholder: "Rp 25.000.000" },
      { name: "description", label: "Deskripsi Singkat", type: "textarea", placeholder: "Untuk brand yang ingin exposure maksimal..." },
      { name: "features", label: "Benefit", type: "tags", help: "Ketik benefit lalu tekan Enter untuk menambah." },
      { name: "highlighted", label: "Tandai sebagai paket unggulan", type: "boolean" },
      { name: "order", label: "Urutan", type: "number" },
    ],
  },
};

// Ambil daftar nama field untuk satu resource (allowlist API).
export function allowedFields(key: string): string[] {
  return RESOURCES[key]?.fields.map((f) => f.name) ?? [];
}
