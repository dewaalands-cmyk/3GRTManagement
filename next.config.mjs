/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Izinkan gambar dari URL mana pun (admin bisa paste URL gambar).
    // Gambar yang diupload disimpan sebagai data URL & otomatis didukung.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};
export default nextConfig;
