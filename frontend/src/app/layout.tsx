import type { Metadata } from "next";
import Providers from "./providers";
import { MenuProvider } from "./context/MenuContext";
import LayoutContent from "./components/LayoutContent";
import Footer from "./components/Footer";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Inventory Management System",
  description: "A simple inventory management system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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