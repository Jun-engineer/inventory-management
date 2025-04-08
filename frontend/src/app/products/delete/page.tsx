'use client';

import { useEffect, useState } from "react";

export default function ProductDelete() {
  type Product = {
    id: number;
    product_name: string;
    sku: string;
    // add additional fields if needed
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const handleDelete = async () => {
    if (!selectedProductId) return;
    try {
      const res = await fetch(`/api/products/${selectedProductId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setMessage("Product deleted successfully. Reloading page...");
        setTimeout(() => window.location.reload(), 3000);
      } else {
        const errData = await res.json();
        setMessage(errData.error || "Error deleting product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setMessage("Error deleting product.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Delete Product</h2>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Select Product</label>
        <select
          value={selectedProductId || ""}
          onChange={(e) => setSelectedProductId(Number(e.target.value))}
          className="w-full p-2 border rounded"
          required
        >
          <option value="" disabled>
            Select a Product
          </option>
          {products.map((prod) => (
            <option key={prod.id} value={prod.id}>
              {prod.product_name} - {prod.sku}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleDelete}
        className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
      >
        Delete Product
      </button>
      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
  );
}