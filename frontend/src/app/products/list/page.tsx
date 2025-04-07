'use client';

import { useEffect, useState } from "react";
import FilterHeader from "../../components/FilterHeader";

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

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortField, setSortField] = useState<keyof Product>("product_name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [filters, setFilters] = useState({
    product_name: "",
    price: "",
    quantity: "",
    warehouse: "",
    description: "",
  });
  const [filterPopup, setFilterPopup] = useState<{ field: keyof Product } | null>(null);

  useEffect(() => {
    fetch("/api/products", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products", err));
  }, []);

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
    const nameMatch = p.product_name
      .toLowerCase()
      .includes(filters.product_name.toLowerCase());
    const priceMatch = filters.price ? p.price === Number(filters.price) : true;
    const quantityMatch = filters.quantity ? p.quantity === Number(filters.quantity) : true;
    const warehouseMatch = p.warehouse
      .toLowerCase()
      .includes(filters.warehouse.toLowerCase());
    const descriptionMatch = p.description
      .toLowerCase()
      .includes(filters.description.toLowerCase());
    return nameMatch && priceMatch && quantityMatch && warehouseMatch && descriptionMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
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

  return (
    <div className="p-6">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <FilterHeader<Product>
              field="product_name"
              title="Name"
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
            <FilterHeader<Product>
              field="description"
              title="Description"
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