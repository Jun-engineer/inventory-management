'use client';

import { useState } from "react";
import Tabs, { Tab } from "../components/Tabs";
import WarehouseList from "./list/page";
import WarehouseUpdate from "./update/page";
import AddWarehouse from "./register/page";
import DeleteWarehouse from "./delete/page";

export default function WarehousePage() {
  const [initialTab, setInitialTab] = useState(0);
  const tabs: Tab[] = [
    { label: "Warehouse List", content: <WarehouseList /> },
    { label: "Warehouse Update", content: <WarehouseUpdate /> },
    { label: "Warehouse Registration", content: <AddWarehouse /> },
    { label: "Warehouse Deletion", content: <DeleteWarehouse /> },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Warehouse Page</h1>
      <Tabs tabs={tabs} initialTabIndex={initialTab} />
    </div>
  );
}