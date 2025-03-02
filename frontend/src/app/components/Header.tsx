'use client';

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    signOut({ callbackUrl: "/login/" });
  };

  return (
    <div className="relative w-full">
      <header className="relative py-4 px-4 max-w-5xl mx-auto">
        {/* Title centered */}
        <h1 className="absolute inset-0 flex justify-center items-center text-4xl font-bold pointer-events-none">
          Inventory Management System
        </h1>
        {/* Menu button at right */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 focus:outline-none p-2 pointer-events-auto"
        >
          <svg
            className="w-6 h-6"
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
      </header>
      {menuOpen && (
        <nav className="absolute top-full right-4 w-48 md:w-56 bg-gray-500 bg-opacity-70 text-white p-4 shadow-lg rounded-md">
          <ul className="divide-y divide-gray-400">
            <li className="py-2">
              <Link
                href="/order#purchase/"
                onClick={() => setMenuOpen(false)}
                className="block text-left"
              >
                Purchace Order
              </Link>
            </li>
            <li className="py-2">
              <Link
                href="/price#purchased-orders/"
                onClick={() => setMenuOpen(false)}
                className="block text-left"
              >
                Purchase Order Price
              </Link>
            </li>
            <li className="py-2">
              <Link
                href="/order#sales/"
                onClick={() => setMenuOpen(false)}
                className="block text-left"
              >
                Sales Order
              </Link>
            </li>
            <li className="py-2">
              <Link
                href="/price#sales-order/"
                onClick={() => setMenuOpen(false)}
                className="block text-left"
              >
                Sales Order Price
              </Link>
            </li>
            <li className="py-2">
              <Link
                href="/products#stock/"
                onClick={() => setMenuOpen(false)}
                className="block text-left"
              >
                Stock
              </Link>
            </li>
            <li className="py-2">
              <Link
                href="/products#edit/"
                onClick={() => setMenuOpen(false)}
                className="block text-left"
              >
                Edit Products
              </Link>
            </li>
            <li className="py-2">
              <Link
                href="/settings/"
                onClick={() => setMenuOpen(false)}
                className="block text-left"
              >
                Settings
              </Link>
            </li>
            <li className="py-2">
              <button
                onClick={handleLogout}
                className="block text-left"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}