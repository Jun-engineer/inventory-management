'use client';

import React from "react";
import Header from "./Header";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main className="py-8">{children}</main>
      <footer className="text-center py-4">
        <p className="text-sm">
          &copy; 2025 Inventory Management System. All rights reserved.
        </p>
      </footer>
    </div>
  );
}