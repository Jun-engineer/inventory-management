'use client';

import { useEffect, useState } from 'react';

interface Product {
  id: string;
  product_name: string;
  sku: string;
  price: string;
  quantity: string;
  description: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);

  // Simulate fetching data from a database/API
  useEffect(() => {
    const sampleProducts: Product[] = [
      {
        id: 'p1',
        product_name: 'Product 1',
        sku: 'SKU1',
        price: '1,000 yen',
        quantity: '10 qty',
        description: 'Description for product 1',
      },
      {
        id: 'p2',
        product_name: 'Product 2',
        sku: 'SKU2',
        price: '2,000 yen',
        quantity: '20 qty',
        description: 'Description for product 2',
      },
      {
        id: 'p3',
        product_name: 'Product 3',
        sku: 'SKU3',
        price: '3,000 yen',
        quantity: '30 qty',
        description: 'Description for product 3',
      },
    ];
    setProducts(sampleProducts);
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
            <th className="border p-2 text-left">Description</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="border p-2">{product.product_name}</td>
              <td className="border p-2">{product.price}</td>
              <td className="border p-2">{product.quantity}</td>
              <td className="border p-2">{product.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}