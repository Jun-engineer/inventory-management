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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5434162081070782"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-screen bg-white text-black">
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