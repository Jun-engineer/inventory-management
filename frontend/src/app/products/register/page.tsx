'use client';

import { useState } from 'react';

export default function ProductRegister() {
  const [productName, setProductName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [newWarehouse, setNewWarehouse] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const warehouseOptions = [
    { id: 'warehouseA', name: 'Warehouse A' },
    { id: 'warehouseB', name: 'Warehouse B' },
    { id: 'add', name: 'Add New Warehouse' },
  ];

  const formatNumber = (value: string) => {
    const num = parseFloat(value.replace(/,/g, ''));
    if (isNaN(num)) return '';
    return num.toLocaleString('en-US');
  };

  const handlePriceBlur = () => {
    if (price !== '') {
      setPrice(formatNumber(price));
    }
  };

  const handleQuantityBlur = () => {
    if (quantity !== '') {
      setQuantity(formatNumber(quantity));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Determine the warehouse value to send
    const selectedWarehouse = warehouse === 'add' ? newWarehouse : warehouse;

    const data = {
      product_name: productName,
      sku,
      price,
      quantity,
      description,
      warehouse_id: selectedWarehouse,
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setMessage('Product registered successfully.');
        // Reset the form fields
        setProductName('');
        setSku('');
        setPrice('');
        setQuantity('');
        setDescription('');
        setWarehouse('');
        setNewWarehouse('');
      } else {
        setMessage('Error registering product.');
      }
    } catch (error) {
      console.error('Error registering product:', error);
      setMessage('Error registering product.');
    }
  };

  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">Register Product</h2>
      {message && <p className="mb-4 text-center">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <label className="block text-gray-700 mb-2">SKU</label>
          <input
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {/* Price Input with formatted suffix */}
        <div>
          <label className="block text-gray-700 mb-2">Price</label>
          <div className="flex">
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              onBlur={handlePriceBlur}
              className="w-full p-2 border rounded-l"
              required
            />
            <span className="px-2 border border-l-0 rounded-r bg-gray-200">
              yen
            </span>
          </div>
        </div>
        {/* Quantity Input with formatted suffix */}
        <div>
          <label className="block text-gray-700 mb-2">Quantity</label>
          <div className="flex">
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              onBlur={handleQuantityBlur}
              className="w-full p-2 border rounded-l"
              required
            />
            <span className="px-2 border border-l-0 rounded-r bg-gray-200">
              qty
            </span>
          </div>
        </div>
        {/* Warehouse Dropdown */}
        <div>
          <label className="block text-gray-700 mb-2">Warehouse</label>
          <select
            value={warehouse}
            onChange={(e) => setWarehouse(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="" disabled>
              Select Warehouse
            </option>
            {warehouseOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
          </select>
          {warehouse === 'add' && (
            <div className="mt-2">
              <label className="block text-gray-700 mb-2">New Warehouse</label>
              <input
                type="text"
                value={newWarehouse}
                onChange={(e) => setNewWarehouse(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          )}
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
          Register Product
        </button>
      </form>
    </div>
  );
}