'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import FilterHeader from "../components/FilterHeader";
import Tabs, { Tab } from "../components/Tabs";

interface Product {
  id: number;
  product_name: string;
  sku: string;
  price: number;
  quantity: number;
  description: string;
  warehouse: string;
  supplier_name: string;
}

type SortOrder = "asc" | "desc";

interface CartItem {
  product: Product;
  quantity: number;
}

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

export default function PurchasePage() {
  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cartItems");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [sortField, setSortField] = useState<keyof Product>("product_name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [filters, setFilters] = useState({
    supplier_name: "",
    product_name: "",
    price: "",
  });
  const [filterPopup, setFilterPopup] = useState<{ field: keyof Product } | null>(null);
  const [quantityInputs, setQuantityInputs] = useState<{ [productId: number]: number }>({});

  // Fetch products on mount
  useEffect(() => {
    fetch("/api/purchase-products/", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching purchase products", err));
  }, []);

  // Persist cart updates in localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch order history from backend
  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders/", { credentials: "include" });
        if (res.ok) {
          const orders = await res.json();
          setOrderHistory(orders);
        } else {
          console.error("Failed to load orders");
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchOrders();
  }, []);

  // Filter and sort products in Purchase tab
  const filteredProducts = products.filter((p) => {
    const supplierMatch = p.supplier_name.toLowerCase().includes(filters.supplier_name.toLowerCase());
    const nameMatch = p.product_name.toLowerCase().includes(filters.product_name.toLowerCase());
    const priceMatch = filters.price ? p.price === Number(filters.price) : true;
    return supplierMatch && nameMatch && priceMatch;
  });
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    }
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return 0;
  });
  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };
  const onFilterChange = (field: keyof Product, value: string) => {
    setFilters({ ...filters, [field]: value });
  };
  const onToggleFilterPopup = (field: keyof Product) => {
    setFilterPopup({ field });
  };
  const onCloseFilterPopup = () => {
    setFilterPopup(null);
  };

  const addToCart = (product: Product, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product.id === product.id);
      if (existingIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingIndex].quantity += quantity;
        return updatedCart;
      }
      return [...prevCart, { product, quantity }];
    });
    setQuantityInputs((prev) => ({ ...prev, [product.id]: 0 }));
  };

  const handleQuantityChange = (productId: number, value: number) => {
    setQuantityInputs((prev) => ({ ...prev, [productId]: value }));
  };

  const handleOrder = async () => {
    if (cartItems.length === 0) return;
    const orderPayload = {
      items: cartItems.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
    };
    const res = await fetch("/api/orders/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
      credentials: "include",
    });
    if (res.ok) {
      alert("Order placed successfully!");
      setCartItems([]);
      localStorage.removeItem("cartItems");
      // Optionally refresh the order history:
      const ordersRes = await fetch("/api/orders/", { credentials: "include" });
      if (ordersRes.ok) {
        const orders = await ordersRes.json();
        setOrderHistory(orders);
      }
    } else {
      alert("Failed to place order.");
    }
  };

  // Filter orders by status for the Purchase Pending/Processing/History tabs.
  const pendingOrders = orderHistory.filter(
    (order) => order.status.toLowerCase() === "pending"
  );
  const processingOrders = orderHistory.filter(
    (order) => order.status.toLowerCase() === "processing"
  );
  const deliveredOrders = orderHistory.filter(
    (order) => order.status.toLowerCase() === "delivered"
  );
  const historyOrders = orderHistory.filter(
    (order) => order.status.toLowerCase() === "completed"
  );

  // Function to handle Delivered action (buyer marks a "processing" order as delivered)
  const deliverOrder = async (orderId?: number) => {
    if (!orderId) return;
    try {
      const res = await fetch(`/api/orders/${orderId}/deliver/`, {
        method: "PUT",
        credentials: "include",
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrderHistory((prev) =>
          prev.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order
          )
        );
      } else {
        alert("Failed to mark order as delivered.");
      }
    } catch (error) {
      console.error("Error marking order as delivered", error);
    }
  };

  // Helper to render orders table. For the "Working" tab, include the Delivered button.
  const renderOrderContent = (
    orders: Order[],
    showDeliveredButton: boolean = false
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
            <th className="border p-2">Items</th>
            {showDeliveredButton && <th className="border p-2">Action</th>}
          </tr>
        </thead>
        <tbody>
          {orders.map((order, orderIndex) => {
            const orderKey = order.id ?? `order-${orderIndex}`;
            return (
              <tr key={orderKey}>
                <td className="border p-2">{order.id ?? "N/A"}</td>
                <td className="border p-2">{new Date(order.date).toLocaleString()}</td>
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
                {showDeliveredButton && (
                  <td className="border p-2">
                    <button
                      className="border px-2 py-1 bg-purple-500 text-white"
                      onClick={() => deliverOrder(order.id)}
                    >
                      Delivered
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  // Define the tabs. Note that the Delivered button is now in the Working tab.
  const tabs: Tab[] = [
    {
      label: "Purchase",
      content: (
        <div>
          {/* Render product ordering table */}
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <FilterHeader<Product>
                  field="supplier_name"
                  title="Supplier"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  filterPopup={filterPopup}
                  filters={filters}
                  onSort={handleSort}
                  onFilterChange={onFilterChange}
                  onToggleFilterPopup={onToggleFilterPopup}
                  onCloseFilterPopup={onCloseFilterPopup}
                />
                <FilterHeader<Product>
                  field="product_name"
                  title="Product Name"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  filterPopup={filterPopup}
                  filters={filters}
                  onSort={handleSort}
                  onFilterChange={onFilterChange}
                  onToggleFilterPopup={onToggleFilterPopup}
                  onCloseFilterPopup={onCloseFilterPopup}
                />
                <FilterHeader<Product>
                  field="price"
                  title="Price"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  filterPopup={filterPopup}
                  filters={filters}
                  onSort={handleSort}
                  onFilterChange={onFilterChange}
                  onToggleFilterPopup={onToggleFilterPopup}
                  onCloseFilterPopup={onCloseFilterPopup}
                />
                <th className="border p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.map((product) => (
                <tr key={product.id}>
                  <td className="border p-2">{product.supplier_name}</td>
                  <td className="border p-2">{product.product_name}</td>
                  <td className="border p-2">{product.price}</td>
                  <td className="border p-2">
                    <input
                      type="number"
                      min={1}
                      value={quantityInputs[product.id] || ""}
                      onChange={(e) =>
                        handleQuantityChange(product.id, Number(e.target.value))
                      }
                      className="w-16 border p-1 mr-2"
                    />
                    <button
                      className="border px-2 py-1"
                      onClick={() =>
                        addToCart(product, Number(quantityInputs[product.id] || 0))
                      }
                    >
                      Add to Cart
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end items-center my-4">
            <span className="mr-4 font-bold">
              Total: ${cartItems.reduce((t, i) => t + i.product.price * i.quantity, 0).toFixed(2)}
            </span>
            <button
              onClick={handleOrder}
              className="border px-4 py-2 bg-blue-500 text-white"
            >
              Order
            </button>
          </div>
        </div>
      ),
    },
    {
      label: "Pending",
      content: renderOrderContent(pendingOrders),
    },
    {
      label: "Working",
      content: renderOrderContent(processingOrders, true),
    },
    {
      label: "Delivered",
      content: renderOrderContent(deliveredOrders),
    },
    {
      label: "History",
      content: renderOrderContent(historyOrders),
    },
  ];

  // Manage the initial tab index from URL hash
  const [initialTab, setInitialTab] = useState(0);
  useEffect(() => {
    const updateTabFromHash = () => {
      if (window.location.hash) {
        const hash = window.location.hash.slice(1).replace(/\/$/, "").trim();
        const index = tabs.findIndex(
          (tab) => tab.label.toLowerCase() === hash.toLowerCase()
        );
        if (index !== -1) setInitialTab(index);
      }
    };
    updateTabFromHash();
    window.addEventListener("hashchange", updateTabFromHash);
    return () => window.removeEventListener("hashchange", updateTabFromHash);
  }, [tabs]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Purchase Page</h1>
        <Link href="/purchase/cart">
          <button className="flex items-center border px-4 py-2">
            🛒 Cart ({cartItems.reduce((total, item) => total + item.quantity, 0)})
          </button>
        </Link>
      </div>
      <Tabs tabs={tabs} initialTabIndex={initialTab} />
    </div>
  );
}