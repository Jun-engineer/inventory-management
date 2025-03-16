'use client';

import { useEffect, useState } from "react";
import Tabs, { Tab } from "../components/Tabs";

export default function SalesPage() {
  const [initialTab, setInitialTab] = useState(0);

  const tabs: Tab[] = [
    {
      label: "Sales",
      content: <div>Content for Sales</div>,
    },
    {
      label: "Sales History",
      content: <div>Content for Sales History</div>,
    },
  ];

  const updateTabFromHash = () => {
    if (window.location.hash) {
      // Remove the '#' and any trailing slash (and trim whitespace if needed)
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
    // Update on mount
    updateTabFromHash();

    // Listen for hash changes if the URL is modified after load
    window.addEventListener("hashchange", updateTabFromHash);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("hashchange", updateTabFromHash);
    };
  }, [tabs]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Sales Page</h1>
      <Tabs tabs={tabs} initialTabIndex={initialTab} />
    </div>
  );
}