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
  warehouse_id: number;
  supplier_id: number;
}

export default function ProductUpdate() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  
  // Fields for product details
  const [productName, setProductName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [description, setDescription] = useState('');
  // We'll store the warehouse name for display.
  const [warehouseDisplay, setWarehouseDisplay] = useState('');
  const [message, setMessage] = useState('');

  // Fetch products list
  useEffect(() => {
    fetch('/api/products', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error fetching products', err));
  }, []);

  // When a product is selected, fetch its details
  useEffect(() => {
    if (selectedProductId) {
      fetch(`/api/products/${selectedProductId}`, { credentials: 'include' })
        .then((res) => res.json())
        .then((data: Product) => {
          setProductName(data.product_name);
          setSku(data.sku);
          setPrice(data.price);
          setQuantity(data.quantity);
          setDescription(data.description);
          setWarehouseDisplay(data.warehouse);
        })
        .catch((err) => console.error('Error fetching product details', err));
    }
  }, [selectedProductId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      product_name: productName,
      sku, // sent for reference (though not editable)
      price,
      quantity,
      description,
      // The warehouse is not updatable, so no warehouse_id is sent.
    };

    try {
      const res = await fetch(`/api/products/${selectedProductId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setMessage('Product updated successfully. Reloading page...');
        // Reload the page after 3 seconds.
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        setMessage('Error updating product.');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setMessage('Error updating product.');
    }
  };

  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">Update Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Selection Dropdown */}
        <div>
          <label className="block text-gray-700 mb-2">Select Product</label>
          <select
            value={selectedProductId || ''}
            onChange={(e) => setSelectedProductId(Number(e.target.value))}
            className="w-full p-2 border rounded"
            required
          >
            <option value="" disabled>
              Select a Product
            </option>
            {products.map((prod) => (
              <option key={prod.id} value={prod.id}>
                {prod.product_name} - {prod.sku} ({prod.warehouse})
              </option>
            ))}
          </select>
        </div>

        {/* Display Warehouse as non-editable field */}
        <div>
          <label className="block text-gray-700 mb-2">Warehouse</label>
          <input
            type="text"
            value={warehouseDisplay}
            className="w-full p-2 border rounded bg-gray-200 cursor-not-allowed"
            disabled
          />
        </div>

        {/* Display SKU as read-only */}
        <div>
          <label className="block text-gray-700 mb-2">SKU</label>
          <input
            type="text"
            value={sku}
            className="w-full p-2 border rounded bg-gray-200 cursor-not-allowed"
            readOnly
          />
        </div>

        {/* Editable Fields */}
        <div>
          <label className="block text-gray-700 mb-2">Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Price (yen)</label>
          <div className="flex">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full p-2 border rounded-l"
              required
            />
            <span className="px-2 border border-l-0 rounded-r bg-gray-200">yen</span>
          </div>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Quantity (qty)</label>
          <div className="flex">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full p-2 border rounded-l"
              required
            />
            <span className="px-2 border border-l-0 rounded-r bg-gray-200">qty</span>
          </div>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Update Product
        </button>
        {message && <p className="mt-4 text-center text-green-600">{message}</p>}
      </form>
    </div>
  );
}