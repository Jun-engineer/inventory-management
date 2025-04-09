'use client';

import { useEffect, useState } from "react";

export type Warehouse = {
  id: number;
  warehouse_name: string;
  location: string;
};

export default function WarehouseList() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/warehouses/`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch warehouses");
        }
        return res.json();
      })
      .then((data) => setWarehouses(data))
      .catch((err) => {
        console.error(err);
        setError("Error fetching warehouses");
      });
  }, []);

  return (
    <>
      {error && <p className="text-red-500">{error}</p>}
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Warehouse Name</th>
            <th className="border p-2">Location</th>
          </tr>
        </thead>
        <tbody>
          {warehouses.map((wh) => (
            <tr key={wh.id}>
              <td className="border p-2">{wh.id}</td>
              <td className="border p-2">{wh.warehouse_name}</td>
              <td className="border p-2">{wh.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}