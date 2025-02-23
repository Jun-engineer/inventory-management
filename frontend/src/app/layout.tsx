import type { Metadata } from "next";
import "../styles/globals.css";
import Providers from "../app/providers";

export const metadata: Metadata = {
  title: "Inventory Management System",
  description: "A simple inventory management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-r from-purple-900 to-blue-900 text-white">
        <Providers>
          <div className="max-w-5xl mx-auto p-6">
            <header className="flex items-center justify-center py-4">
              <h1 className="text-4xl font-bold">Inventory Management System</h1>
            </header>
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