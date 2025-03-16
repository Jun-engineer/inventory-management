'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [protectedData, setProtectedData] = useState<string>("");

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const response = await fetch("/api/protected/", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch protected data");
        }
        const data = await response.json();
        setProtectedData(data.message);
      } catch (error) {
        console.error("Error fetching protected data:", error);
      }
    };
    fetchProtectedData();
  }, [session]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-6 shadow rounded-lg">
          <p className="text-lg font-medium">Please Login Again.</p>
          <p>
            <Link href="/" className="underline">
              Back to Top
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Relative container for positioning */}
      <div className="relative">
        <header className="p-4 border-b border-gray-300 flex justify-center items-center">
          <h1 className="text-3xl font-bold">Total Amount</h1>
        </header>
      </div>
      <main className="flex-grow flex items-start justify-center">
        <div className="w-full max-w-3xl p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold mb-4">
            Welcome, {session.user?.name || "User"}!
          </h2>
          {protectedData && <p className="mb-4">{protectedData}</p>}
        </div>
      </main>
    </div>
  );
}