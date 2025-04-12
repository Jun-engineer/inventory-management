'use client';

import { useMenu } from "../context/MenuContext";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Header() {
  const { menuOpen, setMenuOpen } = useMenu();
  const { data: session } = useSession();
  const pathname = usePathname();

  // Determine common header content
  const commonHeader = (
    <header className="fixed top-0 left-0 w-full z-[60] bg-white border-b border-gray-300 py-4">
      <div className="relative flex items-center justify-center">
        <h1 className="text-4xl font-bold text-center text-black">
          {session ? (
            <Link href="/dashboard">Inventory Management System</Link>
          ) : (
            "Inventory Management System"
          )}
        </h1>
        {session && (
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="absolute left-4 focus:outline-none p-4"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}
      </div>
    </header>
  );

  // If no session or on the root page, render minimal header
  if (!session || pathname === "/") {
    return (
      <>
        {commonHeader}
        {/* Spacer to push page content below header */}
        <div className="pt-20"></div>
      </>
    );
  }

  // For session valid pages (non-root), render full header with menu
  const handleLogout = () => {
    setMenuOpen(false);
    signOut({ callbackUrl: "/" });
  };

  return (
    <>
      {commonHeader}

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-[50] bg-black opacity-50"
            onClick={() => setMenuOpen(false)}
          ></div>
          <nav
            className="fixed left-0 top-16 z-[100] w-full sm:w-64 bg-white text-black p-4 shadow-lg sm:rounded-r-md border"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="divide-y divide-gray-300">
              <li className="py-2">
                <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block text-left">
                  Home
                </Link>
              </li>
              <li className="py-2">
                <Link href="/purchase" onClick={() => setMenuOpen(false)} className="block text-left">
                  Order
                </Link>
              </li>
              <li className="py-2">
                <Link href="/sales" onClick={() => setMenuOpen(false)} className="block text-left">
                  Sales
                </Link>
              </li>
              <li className="py-2">
                <Link href="/products" onClick={() => setMenuOpen(false)} className="block text-left">
                  Products
                </Link>
              </li>
              <li className="py-2">
                <Link href="/warehouse" onClick={() => setMenuOpen(false)} className="block text-left">
                  Warehouse
                </Link>
              </li>
              <li className="py-2">
                <Link href="/requests" onClick={() => setMenuOpen(false)} className="block text-left">
                  Requests
                </Link>
              </li>
              <li className="py-2">
                <Link href="/settings" onClick={() => setMenuOpen(false)} className="block text-left">
                  Settings
                </Link>
              </li>
              <li className="py-2">
                <button onClick={handleLogout} className="block w-full text-left">
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </>
      )}

      {/* Always include the same spacer */}
      <div className="pt-20"></div>
    </>
  );
}