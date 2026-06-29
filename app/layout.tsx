import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Barlow } from "next/font/google";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});
const barlow = Barlow({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
});

const SITE_URL = "https://www.3grtmanagement.com";
const SITE_NAME = "3GRT Management";
const DESCRIPTION =
  "3GRT Management — penyelenggara event combat sport profesional di Garut, Indonesia. Spesialis Muay Thai, MMA, tinju & kickboxing: matchmaking presisi, manajemen atlet, produksi siaran live, hingga penyediaan fight gear berkelas internasional.";

export const viewport: Viewport = {
  themeColor: "#C8102E",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: `${SITE_NAME} | Penyelenggara Event Combat Sport Profesional`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "3GRT Management",
    "event organizer combat sport Indonesia",
    "muay thai Garut",
    "championship MMA Indonesia",
    "manajemen atlet combat sport",
    "fight gear Indonesia",
    "kickboxing event",
    "penyelenggara tinju profesional",
    "combat sport Jawa Barat",
    "promotor muay thai",
    "3GRT Championship",
    "siaran live combat sport",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Sports & Entertainment",

  alternates: {
    canonical: SITE_URL,
    languages: { "id-ID": SITE_URL },
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: `${SITE_NAME} | Event Combat Sport Profesional`,
    description:
      "Di sinilah legenda lahir. Penyelenggara event combat sport profesional — Muay Thai, MMA, tinju & kickboxing. Berstandar internasional, berjiwa juara.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "3GRT Management — Combat Sport Indonesia",
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@3GRTManagement",
    creator: "@3GRTManagement",
    title: `${SITE_NAME} | Event Combat Sport Profesional`,
    description:
      "Di sinilah legenda lahir. Penyelenggara event combat sport profesional — Muay Thai, MMA, tinju & kickboxing.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },

  manifest: "/manifest.json",

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SITE_NAME,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${barlowCondensed.variable} ${barlow.variable}`}>
      <body>{children}</body>
    </html>
  );
}
