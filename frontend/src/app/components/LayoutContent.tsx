'use client';

import React from "react";
import Header from "./Header";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main className="py-8">{children}</main>
    </div>
  );
}