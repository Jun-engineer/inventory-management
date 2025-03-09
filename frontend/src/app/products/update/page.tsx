'use client';

import { useEffect, useState } from 'react';

interface Product {
  id: string;
  product_name: string;
  sku: string;
  price: string;
  quantity: string;
  description: string;
  warehouse_id: string;
}

export default function ProductUpdate() {
  // Dummy products data (simulate data from DB)
  const dummyProducts: Product[] = [
    {
      id: 'p1',
      product_name: 'Product 1',
      sku: 'SKU1',
      price: '1,000',
      quantity: '10',
      description: 'Description for Product 1',
      warehouse_id: 'warehouseA',
    },
    {
      id: 'p2',
      product_name: 'Product 2',
      sku: 'SKU2',
      price: '2,000',
      quantity: '20',
      description: 'Description for Product 2',
      warehouse_id: 'warehouseB',
    },
  ];

  const warehouseOptions = [
    { id: 'warehouseA', name: 'Warehouse A' },
    { id: 'warehouseB', name: 'Warehouse B' },
    { id: 'add', name: 'Add New Warehouse' },
  ];

  const [selectedProduct, setSelectedProduct] = useState('');
  const [productName, setProductName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState(''); // format like "1,000"
  const [quantity, setQuantity] = useState(''); // format like "10"
  const [description, setDescription] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [newWarehouse, setNewWarehouse] = useState('');
  const [message, setMessage] = useState('');

  // When user selects a product and warehouse, auto-fill product data if available.
  useEffect(() => {
    if (selectedProduct && warehouse && warehouse !== 'add') {
      const prod = dummyProducts.find((p) => p.id === selectedProduct);
      if (prod) {
        if (prod.warehouse_id !== warehouse) {
          // If product doesn't match the selected warehouse, clear fields or show a message.
          setMessage('The selected product is not available in the chosen warehouse.');
          setProductName('');
          setSku('');
          setPrice('');
          setQuantity('');
          setDescription('');
        } else {
          setProductName(prod.product_name);
          setSku(prod.sku);
          setPrice(prod.price);
          setQuantity(prod.quantity);
          setDescription(prod.description);
          setMessage('');
        }
      }
    }
  }, [selectedProduct, warehouse]);

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
      // Simulate an update via a PUT request.
      const res = await fetch(`/api/products/${selectedProduct}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setMessage('Product updated successfully.');
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
      {message && <p className="mb-4 text-center">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Selection */}
        <div>
          <label className="block text-gray-700 mb-2">Select Product</label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="" disabled>
              Select a Product
            </option>
            {dummyProducts.map((prod) => (
              <option key={prod.id} value={prod.id}>
                {prod.product_name}
              </option>
            ))}
          </select>
        </div>
        {/* Warehouse Selection */}
        <div>
          <label className="block text-gray-700 mb-2">Select Warehouse</label>
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
        {/* SKU */}
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
        {/* Price with suffix */}
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
        {/* Quantity with suffix */}
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
        {/* Description */}
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
      </form>
    </div>
  );
}