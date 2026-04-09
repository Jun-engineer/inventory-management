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
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/products/", { credentials: "include" })
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
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${selectedProductId}/`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setMessage("Product deleted successfully.");
        setProducts((prev) => prev.filter((p) => p.id !== selectedProductId));
        setSelectedProductId(null);
      } else {
        const errData = await res.json();
        setMessage(errData.error || "Error deleting product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setMessage("Error deleting product.");
    } finally {
      setSubmitting(false);
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
        disabled={submitting}
        className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Deleting..." : "Delete Product"}
      </button>
      {message && <p className={`mt-4 text-center ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>{message}</p>}
    </div>
  );
}