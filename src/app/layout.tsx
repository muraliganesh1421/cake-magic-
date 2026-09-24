import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { siteConfig } from "@/config/site";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#4A2E2B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://cakemagic-rajahmundry.com"),
  title: {
    default: "Cake Magic | Bespoke Cakes & Bakery in Rajahmundry",
    template: "%s | Cake Magic Rajahmundry",
  },
  description:
    "Bespoke cakes, birthday specials, eggless delights and fresh bakery creations crafted for your celebrations in Rajahmundry (Rajamahendravaram), Andhra Pradesh.",
  keywords: [
    "Cake shop Rajahmundry",
    "Birthday cakes Rajahmundry",
    "Custom cakes Rajahmundry",
    "Eggless cakes Rajahmundry",
    "Cake delivery Rajahmundry",
    "Designer cakes Rajahmundry",
    "Wedding cakes Rajahmundry",
    "Bento cakes Rajahmundry",
    "Bakery Rajamahendravaram",
  ],
  authors: [{ name: "Cake Magic" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://cakemagic-rajahmundry.com",
    siteName: "Cake Magic",
    title: "Cake Magic | Bespoke Cakes & Bakery in Rajahmundry",
    description:
      "Bespoke celebration cakes, fresh desserts, and bakery favourites in Rajahmundry. Enquire online or on WhatsApp.",
    images: [
      {
        url: "/images/og-cake-magic.jpg",
        width: 1200,
        height: 630,
        alt: "Cake Magic - Premium Cakes in Rajahmundry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cake Magic | Bespoke Cakes & Bakery in Rajahmundry",
    description: "Crafted for every celebration in Rajahmundry.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jakarta.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] font-sans pb-16 md:pb-0">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-[var(--primary)] focus:text-[var(--primary-foreground)] focus:top-2 focus:left-2 rounded-md shadow-lg outline-none"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
