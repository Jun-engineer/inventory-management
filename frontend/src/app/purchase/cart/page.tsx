'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  product_name: string;
  sku: string;
  price: number;
  supplier_name: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart items from localStorage on mount.
  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const handleOrder = async () => {
    if (cartItems.length === 0) return;
  
    const orderPayload = {
      items: cartItems.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
    };
  
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });
  
    if (res.ok) {
      alert("Order placed successfully!");
      // Clear cart items in state and localStorage:
      setCartItems([]);
      localStorage.removeItem("cartItems");
    } else {
      alert("Failed to place order.");
    }
  };

  const removeFromCart = (productId: number) => {
    const updatedCart = cartItems.filter(item => item.product.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <div className="p-6">
      {/* Back Button */}
      <Link href="/purchase">
        <button className="border px-4 py-2 mb-4">Back</button>
      </Link>
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className="min-w-full border-collapse mb-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Product Name</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Subtotal</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.product.id}>
                  <td className="border p-2">{item.product.product_name}</td>
                  <td className="border p-2">${item.product.price}</td>
                  <td className="border p-2">{item.quantity}</td>
                  <td className="border p-2">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </td>
                  <td className="border p-2">
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="border px-2 py-1 bg-red-500 text-white"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end items-center mb-4">
            <span className="mr-4 font-bold">Total: ${totalPrice.toFixed(2)}</span>
            <button
              onClick={handleOrder}
              className="border px-4 py-2 bg-blue-500 text-white"
            >
              Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}