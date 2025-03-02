import type { Metadata } from "next";
import "../styles/globals.css";
import Providers from "./providers";
import Header from "./components/Header";

export const metadata: Metadata = {
  title: "Inventory Management System",
  description: "A simple inventory management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-r from-purple-900 to-blue-900 text-white">
        <Providers>
          <div className="max-w-5xl mx-auto p-6">
            <Header />
            <main className="py-8">{children}</main>
            <footer className="text-center py-4">
              <p className="text-sm">&copy; 2025 Inventory Management System. All rights reserved.</p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}