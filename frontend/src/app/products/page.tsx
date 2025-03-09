'use client';

import { useEffect, useState } from "react";
import Tabs, { Tab } from "../components/Tabs";
import ProductList from "./list/page";
import ProductUpdate from "./update/page";
import ProductRegister from "./register/page";

export default function ProductsPage() {
  const [initialTab, setInitialTab] = useState(0);

  const tabs: Tab[] = [
    {
      label: "Product List",
      content: <ProductList />,
    },
    {
      label: "Product Update",
      content: <ProductUpdate />,
    },
    {
      label: "Product Registration",
      content: <ProductRegister />,
    },
  ];

  const updateTabFromHash = () => {
    if (window.location.hash) {
      const hash = window.location.hash.substring(1).replace(/\/$/, "").trim();
      const index = tabs.findIndex(
        (tab) => tab.label.toLowerCase() === hash.toLowerCase()
      );
      if (index !== -1) {
        setInitialTab(index);
      }
    }
  };

  useEffect(() => {
    updateTabFromHash();
    window.addEventListener("hashchange", updateTabFromHash);
    return () => {
      window.removeEventListener("hashchange", updateTabFromHash);
    };
  }, [tabs]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Products</h1>
      <Tabs tabs={tabs} initialTabIndex={initialTab} />
    </div>
  );
}