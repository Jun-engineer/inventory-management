'use client';

import { useState } from "react";
import Tabs, { Tab } from "../components/Tabs";
import ProductList from "./list/page";
import ProductUpdate from "./update/page";
import ProductRegister from "./register/page";
import ProductDelete from "./delete/page";

export default function ProductsPage() {
  const [initialTab] = useState(0);

  const tabs: Tab[] = [
    { label: "Product List", content: <ProductList /> },
    { label: "Product Update", content: <ProductUpdate /> },
    { label: "Product Registration", content: <ProductRegister /> },
    { label: "Product Deletion", content: <ProductDelete /> },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Products</h1>
      <Tabs tabs={tabs} initialTabIndex={initialTab} />
    </div>
  );
}