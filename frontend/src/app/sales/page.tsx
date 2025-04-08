'use client';

import { useEffect, useState } from "react";
import Tabs, { Tab } from "../components/Tabs";

interface OrderItem {
  id?: number;
  product_id: number;
  quantity: number;
  price: number;
}

interface Order {
  id?: number;
  company_id: number;
  total: number;
  status: string;
  date: string;
  OrderItems?: OrderItem[];
}

export default function SalesPage() {
  const [salesOrders, setSalesOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function fetchSales() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sales`, { credentials: "include" });
        if (res.ok) {
          const orders = await res.json();
          setSalesOrders(orders);
        } else {
          console.error("Failed to fetch sales orders");
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchSales();
  }, []);

  // Filter orders by status
  const pendingSales = salesOrders.filter(
    (order) => order.status.toLowerCase() === "pending"
  );
  const processingSales = salesOrders.filter(
    (order) => order.status.toLowerCase() === "processing"
  );
  const deliveredSales = salesOrders.filter(
    (order) => order.status.toLowerCase() === "delivered"
  );
  const historySales = salesOrders.filter(
    (order) => order.status.toLowerCase() === "completed"
  );

  // Function to handle Accept action
  const acceptOrder = async (orderId?: number) => {
    if (!orderId) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${orderId}/accept`, {
        method: "PUT",
        credentials: "include",
      });
      if (res.ok) {
        // Optionally refresh the orders
        const updatedOrder = await res.json();
        // Replace the updated order in salesOrders state:
        setSalesOrders((prev) =>
          prev.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order
          )
        );
      } else {
        alert("Failed to accept order.");
      }
    } catch (error) {
      console.error("Error accepting order", error);
    }
  };

  // Function to handle Complete action (for delivered orders)
  const completeOrder = async (orderId?: number) => {
    if (!orderId) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${orderId}/complete`, {
        method: "PUT",
        credentials: "include",
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        setSalesOrders((prev) =>
          prev.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order
          )
        );
      } else {
        alert("Failed to complete order.");
      }
    } catch (error) {
      console.error("Error completing order", error);
    }
  };

  // Helper to render sales table (with optional Accept/Complete buttons)
  const renderSalesContent = (
    orders: Order[],
    showAcceptButton: boolean = false,
    showCompleteButton: boolean = false
  ) => {
    if (orders.length === 0) return <p>No orders available.</p>;
    return (
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Order ID</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Total ($)</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Items Sold</th>
            {(showAcceptButton || showCompleteButton) && (
              <th className="border p-2">Action</th>
            )}
          </tr>
        </thead>
        <tbody>
          {orders.map((order, orderIndex) => {
            const orderKey = order.id ?? `order-${orderIndex}`;
            return (
              <tr key={orderKey}>
                <td className="border p-2">{order.id ?? "N/A"}</td>
                <td className="border p-2">
                  {new Date(order.date).toLocaleString()}
                </td>
                <td className="border p-2">{order.total.toFixed(2)}</td>
                <td className="border p-2">{order.status}</td>
                <td className="border p-2">
                  {(order.OrderItems || []).map((item, i) => {
                    const itemKey = `${orderKey}-item-${item.id ?? i}`;
                    return (
                      <div key={itemKey}>
                        Product ID {item.product_id} (x{item.quantity})
                      </div>
                    );
                  })}
                </td>
                {(showAcceptButton || showCompleteButton) && (
                  <td className="border p-2">
                    {showAcceptButton && (
                      <button
                        className="border px-2 py-1 bg-green-500 text-white"
                        onClick={() => acceptOrder(order.id)}
                      >
                        Accept
                      </button>
                    )}
                    {showCompleteButton && (
                      <button
                        className="border px-2 py-1 bg-blue-500 text-white"
                        onClick={() => completeOrder(order.id)}
                      >
                        Complete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const tabs: Tab[] = [
    {
      label: "Pending",
      content: renderSalesContent(pendingSales, true),
    },
    { 
      label: "Working", 
      content: renderSalesContent(processingSales) 
    },
    {
      label: "Delivered",
      content: renderSalesContent(deliveredSales, false, true),
    },
    { 
      label: "History", 
      content: renderSalesContent(historySales) 
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Sales Page</h1>
      <Tabs tabs={tabs} initialTabIndex={0} />
    </div>
  );
}