'use client';

import { useEffect, useState } from "react";
import { Warehouse } from "../list/page";

export default function DeleteWarehouse() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/warehouses/`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setWarehouses(data))
      .catch((err) => console.error("Error fetching warehouses:", err));
  }, []);

  const handleDelete = async () => {
    if (!selectedWarehouseId) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/warehouses/${selectedWarehouseId}/`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setMessage("Warehouse deleted successfully. Reloading page...");
        setTimeout(() => window.location.reload(), 3000);
      } else {
        setMessage("Error deleting warehouse.");
      }
    } catch (error) {
      console.error("Error deleting warehouse:", error);
      setMessage("Error deleting warehouse.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Delete Warehouse</h2>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Select Warehouse</label>
        <select
          value={selectedWarehouseId || ""}
          onChange={(e) => setSelectedWarehouseId(Number(e.target.value))}
          className="w-full p-2 border rounded"
          required
        >
          <option value="" disabled>
            Select a Warehouse
          </option>
          {warehouses.map((wh) => (
            <option key={wh.id} value={wh.id}>
              {wh.warehouse_name} ({wh.location})
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleDelete}
        className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
      >
        Delete Warehouse
      </button>
      {message && (
        <p className="mt-4 text-center text-green-600">{message}</p>
      )}
    </div>
  );
}