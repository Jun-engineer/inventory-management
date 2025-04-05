'use client';

import { useEffect, useState } from "react";
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

export default function PurchasePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortField, setSortField] = useState<keyof Product>("product_name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [filters, setFilters] = useState({
    supplier_name: "",
    product_name: "",
    price: "",
    quantity: "",
    warehouse: "",
  });
  const [filterPopup, setFilterPopup] = useState<{ field: keyof Product } | null>(null);

  useEffect(() => {
    fetch("/api/purchase-products", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching purchase products", err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const popupElement = document.querySelector(".filter-popup");
      if (popupElement && !popupElement.contains(event.target as Node)) {
        onCloseFilterPopup();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [filterPopup]);

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

  const filteredProducts = products.filter((p) => {
    const supplierMatch = p.supplier_name
      .toLowerCase()
      .includes(filters.supplier_name.toLowerCase());
    const nameMatch = p.product_name
      .toLowerCase()
      .includes(filters.product_name.toLowerCase());
    const priceMatch = filters.price ? p.price === Number(filters.price) : true;
    const quantityMatch = filters.quantity ? p.quantity === Number(filters.quantity) : true;
    const warehouseMatch = p.warehouse
      .toLowerCase()
      .includes(filters.warehouse.toLowerCase());
    return supplierMatch && nameMatch && priceMatch && quantityMatch && warehouseMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    }
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    return 0;
  });

  const tabs: Tab[] = [
    {
      label: "Purchase",
      content: (
        <div>
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
                <FilterHeader<Product>
                  field="quantity"
                  title="Quantity"
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
                  field="warehouse"
                  title="Warehouse"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  filterPopup={filterPopup}
                  filters={filters}
                  onSort={handleSort}
                  onFilterChange={onFilterChange}
                  onToggleFilterPopup={onToggleFilterPopup}
                  onCloseFilterPopup={onCloseFilterPopup}
                />
              </tr>
            </thead>
            <tbody>
              {sortedProducts.map((product) => (
                <tr key={product.id}>
                  <td className="border p-2">{product.supplier_name}</td>
                  <td className="border p-2">{product.product_name}</td>
                  <td className="border p-2">{product.price}</td>
                  <td className="border p-2">{product.quantity}</td>
                  <td className="border p-2">{product.warehouse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
    {
      label: "Purchase History",
      content: <div>Content for Purchase History</div>,
    },
  ];

  // A simple tab switcher (if needed)
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
      <h1 className="text-3xl font-bold mb-4">Purchase Page</h1>
      <Tabs tabs={tabs} initialTabIndex={initialTab} />
    </div>
  );
}