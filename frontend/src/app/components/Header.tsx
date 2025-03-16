'use client';

import { useMenu } from "../context/MenuContext";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function Header() {
  const { menuOpen, setMenuOpen } = useMenu();

  const handleLogout = () => {
    setMenuOpen(false);
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div>
      {/* Fixed header with white background and bottom border separator */}
      <header className="fixed top-0 left-0 w-full z-[60] bg-white border-b border-gray-300">
        <div className="relative py-4">
          <h1 className="text-4xl font-bold text-center pointer-events-none text-black">
            <Link href="/dashboard">Inventory Management System</Link>
          </h1>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 focus:outline-none p-4"
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
        </div>
      </header>

      {menuOpen && (
        <>
          {/* Overlay that greys out the entire page */}
          <div
            className="fixed inset-0 z-[50] bg-black opacity-50"
            onClick={() => setMenuOpen(false)}
          ></div>
          {/* Menu panel with white background and black text */}
          <nav
            className="fixed left-0 top-16 z-[100] w-full sm:w-64 bg-white text-black p-4 shadow-lg sm:rounded-r-md border"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="divide-y divide-gray-300">
              <li className="py-2">
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="block text-left"
                >
                  Home
                </Link>
              </li>
              <li className="py-2">
                <Link
                  href="/purchase"
                  onClick={() => setMenuOpen(false)}
                  className="block text-left"
                >
                  Order
                </Link>
              </li>
              <li className="py-2">
                <Link
                  href="/sales"
                  onClick={() => setMenuOpen(false)}
                  className="block text-left"
                >
                  Sales
                </Link>
              </li>
              <li className="py-2">
                <Link
                  href="/products"
                  onClick={() => setMenuOpen(false)}
                  className="block text-left"
                >
                  Products
                </Link>
              </li>
              <li className="py-2">
                <Link
                  href="/warehouse"
                  onClick={() => setMenuOpen(false)}
                  className="block text-left"
                >
                  Warehouse
                </Link>
              </li>
              <li className="py-2">
                <Link
                  href="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="block text-left"
                >
                  Settings
                </Link>
              </li>
              <li className="py-2">
                <button
                  onClick={handleLogout}
                  className="block text-left w-full"
                >
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </>
      )}

      {/* Spacer div to offset the content below the fixed header */}
      <div className="pt-20"></div>
    </div>
  );
}