import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { StoreProvider } from "@/components/providers/StoreProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kazistore.com.bd"),
  title: {
    default: "Kazi Store — কাজী স্টোর | Premium Cosmetics & Beauty in Chattogram",
    template: "%s | Kazi Store — কাজী স্টোর",
  },
  description:
    "Shop premium skincare, makeup, fragrance, Korean beauty and grooming essentials at Kazi Store, Jubilee Road, Chattogram. Nationwide delivery across Bangladesh with Cash on Delivery, bKash & Nagad.",
  keywords: [
    "cosmetics Chattogram",
    "beauty store Bangladesh",
    "skincare Bangladesh",
    "makeup Chattogram",
    "Korean beauty Bangladesh",
    "Kazi Store",
    "কাজী স্টোর",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Kazi Store — কাজী স্টোর",
    title: "Kazi Store | Premium Cosmetics & Beauty in Chattogram",
    description:
      "Skincare, makeup, fragrance & Korean beauty — in-store on Jubilee Road, Chattogram and delivered across Bangladesh.",
    images: [
      "https://images.pexels.com/photos/4210370/pexels-photo-4210370.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200&h=630",
    ],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500&family=Outfit:wght@300;400;500;600;700&family=Noto+Serif+Bengali:wght@400;600&family=Hind+Siliguri:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col bg-ivory font-sans text-ink antialiased">
        <StoreProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
