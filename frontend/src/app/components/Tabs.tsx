'use client';

import React, { useEffect, useState } from "react";

export interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  initialTabIndex?: number;
  onTabChange?: (index: number) => void;
}

export default function Tabs({ tabs, initialTabIndex = 0, onTabChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(initialTabIndex);

  // Update active tab when initialTabIndex prop changes
  useEffect(() => {
    setActiveTab(initialTabIndex);
  }, [initialTabIndex]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    if (onTabChange) onTabChange(index);
  };

  return (
    <div>
      {/* Tab Labels */}
      <div className="flex border-b border-gray-300">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(index)}
            className={`px-4 py-2 -mb-px border-b-2 focus:outline-none ${
              activeTab === index
                ? "border-blue-500 text-blue-500"
                : "border-transparent text-gray-500 hover:text-blue-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Active Tab Content */}
      <div className="py-4">
        {tabs[activeTab] && tabs[activeTab].content}
      </div>
    </div>
  );
}