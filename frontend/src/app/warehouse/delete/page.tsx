'use client';

import { useEffect, useState } from "react";
import { Warehouse } from "../list/page";

export default function DeleteWarehouse() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/warehouses/`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setWarehouses(data))
      .catch((err) => console.error("Error fetching warehouses:", err));
  }, []);

  const handleDelete = async () => {
    if (!selectedWarehouseId) return;
    if (!confirm("Are you sure you want to delete this warehouse? This action cannot be undone.")) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/warehouses/${selectedWarehouseId}/`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setMessage("Warehouse deleted successfully.");
        setWarehouses((prev) => prev.filter((wh) => wh.id !== selectedWarehouseId));
        setSelectedWarehouseId(null);
      } else {
        const errData = await res.json();
        setMessage(errData.error || "Error deleting warehouse.");
      }
    } catch (error) {
      console.error("Error deleting warehouse:", error);
      setMessage("Error deleting warehouse.");
    } finally {
      setSubmitting(false);
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
        disabled={submitting}
        className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Deleting..." : "Delete Warehouse"}
      </button>
      {message && (
        <p className={`mt-4 text-center ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>{message}</p>
      )}
    </div>
  );
}