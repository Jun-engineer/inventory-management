'use client';

import { useState, useEffect } from 'react';

type Warehouse = {
  id: number;
  warehouse_name: string;
  location: string;
};

export default function ProductRegister() {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [newWarehouseName, setNewWarehouseName] = useState('');
  const [newWarehouseLocation, setNewWarehouseLocation] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  // Fetch warehouse list from backend
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/warehouses`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setWarehouses(data))
      .catch((err) => console.error('Error fetching warehouses', err));
  }, []);

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

    // Determine warehouse id:
    // If user selects an existing warehouse, warehouse_id is parsed.
    // If "add" is selected, warehouse_id will be 0.
    const warehouseId = warehouse !== 'add' ? parseInt(warehouse) : 0;

    const data = {
      product_name: productName,
      // Remove sku – it will be generated automatically in the backend.
      price: parseFloat(price.replace(/,/g, '')),
      quantity: parseInt(quantity.replace(/,/g, '')),
      description,
      warehouse_id: warehouseId,
      new_warehouse_name: warehouse === 'add' ? newWarehouseName : undefined,
      new_warehouse_location:
        warehouse === 'add' ? newWarehouseLocation : undefined,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setMessage('Product registered successfully. Reloading page...');
        // Reset the form fields
        setProductName('');
        setPrice('');
        setQuantity('');
        setDescription('');
        setWarehouse('');
        setNewWarehouseName('');
        setNewWarehouseLocation('');
        // Wait 3 seconds, then reload the page.
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        const errorData = await res.json();
        setMessage(errorData.error || 'Error registering product.');
      }
    } catch (error) {
      console.error('Error registering product:', error);
      setMessage('Error registering product.');
    }
  };

  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">Register Product</h2>
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
        {/* SKU input removed */}
        <div>
          <label className="block text-gray-700 mb-2">Price (yen)</label>
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
        <div>
          <label className="block text-gray-700 mb-2">Quantity (qty)</label>
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
            {warehouses.map((wh) => (
              <option key={`warehouse-${wh.id}`} value={wh.id}>
                {wh.warehouse_name} ({wh.location})
              </option>
            ))}
            <option key="add" value="add">
              Add New Warehouse
            </option>
          </select>
          {warehouse === 'add' && (
            <>
              <div className="mt-2">
                <label className="block text-gray-700 mb-2">
                  New Warehouse Name
                </label>
                <input
                  type="text"
                  value={newWarehouseName}
                  onChange={(e) => setNewWarehouseName(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mt-2">
                <label className="block text-gray-700 mb-2">
                  New Warehouse Location
                </label>
                <input
                  type="text"
                  value={newWarehouseLocation}
                  onChange={(e) => setNewWarehouseLocation(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </>
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
        {message && <p className="mb-4 text-center">{message}</p>}
      </form>
    </div>
  );
}