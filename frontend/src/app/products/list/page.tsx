'use client';

import { useEffect, useState } from 'react';

interface Product {
  id: number;
  product_name: string;
  sku: string;
  price: number;
  quantity: number;
  description: string;
  warehouse: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error fetching products', err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Product List</h2>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-left">Name</th>
            <th className="border p-2 text-left">Price</th>
            <th className="border p-2 text-left">Quantity</th>
            <th className="border p-2 text-left">Warehouse</th>
            <th className="border p-2 text-left">Description</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="border p-2">{product.product_name}</td>
              <td className="border p-2">{product.price}</td>
              <td className="border p-2">{product.quantity}</td>
              <td className="border p-2">{product.warehouse}</td>
              <td className="border p-2">{product.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}