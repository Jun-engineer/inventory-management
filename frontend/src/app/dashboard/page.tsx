'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface CostData {
  completedSpent: number;
  completedEarned: number;
  pendingSpent: number;
  pendingEarned: number;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [costData, setCostData] = useState<CostData>({
    completedSpent: 0,
    completedEarned: 0,
    pendingSpent: 0,
    pendingEarned: 0,
  });

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
  }, [session, status, router]);

  // Fetch cost data from backend.
  useEffect(() => {
    async function fetchCostData() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/costs/`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch cost data");
        }
        const data: CostData = await res.json();
        setCostData(data);
      } catch (error) {
        console.error("Error fetching cost data:", error);
      }
    }
    fetchCostData();
  }, [session]);

  // Calculations:
  const netCompleted = costData.completedEarned - costData.completedSpent;
  const netPending = costData.pendingEarned - costData.pendingSpent;

  // Apply conditional coloring:
  const netCompletedColor = netCompleted < 0 ? "text-red-500" : "text-green-500";
  const netPendingColor = netPending < 0 ? "text-red-500" : "text-green-500";

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please login.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="p-4 border-b">
        <h1 className="text-3xl font-bold text-center">Dashboard</h1>
      </header>
      <main className="p-4 space-y-8">
        {/* Completed Orders Section */}
        <div className="bg-white shadow p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-2 text-center">Net Profit (Completed Orders)</h2>
          <p className={`text-3xl font-bold text-center ${netCompletedColor}`}>
            Total Amount: ${netCompleted.toFixed(2)}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white shadow p-4 rounded-lg text-center">
            <h3 className="font-bold">Cost Spent (Completed)</h3>
            <p className="text-xl">${costData.completedSpent.toFixed(2)}</p>
          </div>
          <div className="bg-white shadow p-4 rounded-lg text-center">
            <h3 className="font-bold">Cost Earned (Completed)</h3>
            <p className="text-xl">${costData.completedEarned.toFixed(2)}</p>
          </div>
        </div>

        {/* Pending Orders Section */}
        <div className="bg-white shadow p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-2 text-center">Net Pending Difference</h2>
          <p className={`text-3xl font-bold text-center ${netPendingColor}`}>
            Total Amount: ${netPending.toFixed(2)}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white shadow p-4 rounded-lg text-center">
            <h3 className="font-bold">Cost to Spend (Pending)</h3>
            <p className="text-xl">${costData.pendingSpent.toFixed(2)}</p>
          </div>
          <div className="bg-white shadow p-4 rounded-lg text-center">
            <h3 className="font-bold">Cost to Earn (Pending)</h3>
            <p className="text-xl">${costData.pendingEarned.toFixed(2)}</p>
          </div>
        </div>
      </main>
    </div>
  );
}