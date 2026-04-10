import type { Metadata } from "next";
import Script from "next/script";
import Providers from "./providers";
import { MenuProvider } from "./context/MenuContext";
import LayoutContent from "./components/LayoutContent";
import Footer from "./components/Footer";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Inventory Management System",
    template: "%s | Inventory Management System",
  },
  description: "A simple inventory management system for tracking products, warehouses, orders, and sales.",
  icons: {
    icon: "/favicon.svg",
  },
  verification: {
    google: "DwcnOpKrTSiqtD-2Qrpb6NoDDp0FLHuxeq1i7vfuCfo",
  },
  openGraph: {
    title: "Inventory Management System",
    description: "Track products, warehouses, orders, and sales in one place.",
    type: "website",
    locale: "en_US",
    siteName: "Inventory Management System",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-black">
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5434162081070782"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Providers>
          <MenuProvider>
            <div className="max-w-5xl mx-auto p-6 flex flex-col min-h-screen">
              <LayoutContent>{children}</LayoutContent>
              <Footer />
            </div>
          </MenuProvider>
        </Providers>
      </body>
    </html>
  );
}