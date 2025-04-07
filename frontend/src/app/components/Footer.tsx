'use client';

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-300 w-full py-4">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Inventory Management System. All rights reserved.
        </p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-800">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-800">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}