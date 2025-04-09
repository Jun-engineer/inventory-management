'use client';

import { useState } from "react";

export default function AddWarehouse() {
  const [warehouseName, setWarehouseName] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { warehouse_name: warehouseName, location };
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/warehouses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setMessage("Warehouse added successfully. Reloading page...");
        setWarehouseName("");
        setLocation("");
        setTimeout(() => window.location.reload(), 3000);
      } else {
        setMessage("Error adding warehouse.");
      }
    } catch (error) {
      console.error("Error adding warehouse:", error);
      setMessage("Error adding warehouse.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Register Warehouse</h2>
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
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Register Warehouse
        </button>
        {message && (
          <p className="mt-4 text-center text-green-600">{message}</p>
        )}
      </form>
    </div>
  );
}