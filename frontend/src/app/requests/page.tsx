'use client';

import { useState } from "react";
import Tabs, { Tab } from "../components/Tabs";
import SendRequest from "./send/page";
import PermissionSearch from "./search/page";

export default function RequestPage() {
  const [initialTab, setInitialTab] = useState(0);

  const tabs: Tab[] = [
    { label: "Send Request", content: <SendRequest />, },
    { label: "Search Requests", content: <PermissionSearch />, },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Permission Requests</h1>
      <Tabs tabs={tabs} initialTabIndex={initialTab} />
    </div>
  );
}