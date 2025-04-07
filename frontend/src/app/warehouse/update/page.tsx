'use client';

import { useEffect, useState } from "react";
import { Warehouse } from "../list/page";

export default function WarehouseUpdate() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(null);
  const [warehouseName, setWarehouseName] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");

  // Fetch warehouse list for the dropdown.
  useEffect(() => {
    fetch("/api/warehouses", { credentials: "include" })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch warehouses");
        }
        return res.json();
      })
      .then((data) => setWarehouses(data))
      .catch((err) => console.error(err));
  }, []);

  // When a warehouse is selected, populate form with its details.
  useEffect(() => {
    if (selectedWarehouseId) {
      fetch(`/api/warehouses/${selectedWarehouseId}`, { credentials: "include" })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch warehouse details");
          }
          return res.json();
        })
        .then((data: Warehouse) => {
          setWarehouseName(data.warehouse_name);
          setLocation(data.location);
        })
        .catch((err) => console.error(err));
    }
  }, [selectedWarehouseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWarehouseId) return;
    const data = { warehouse_name: warehouseName, location };
    try {
      const res = await fetch(`/api/warehouses/${selectedWarehouseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setMessage("Warehouse updated successfully. Reloading page...");
        setTimeout(() => window.location.reload(), 3000);
      } else {
        setMessage("Error updating warehouse.");
      }
    } catch (error) {
      console.error("Error updating warehouse:", error);
      setMessage("Error updating warehouse.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Update Warehouse</h2>
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
      {selectedWarehouseId && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Warehouse Name</label>
            <input
              type="text"
              value={warehouseName}
              onChange={(e) => setWarehouseName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Update Warehouse
          </button>
          {message && (
            <p className="mt-4 text-center text-green-600">{message}</p>
          )}
        </form>
      )}
    </div>
  );
}