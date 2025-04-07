'use client';

import React from "react";

interface FilterHeaderProps<T> {
  field: keyof T;
  title: string;
  sortField: keyof T;
  sortOrder: "asc" | "desc";
  filterPopup: { field: keyof T } | null;
  filters: Record<string, string>;
  onSort: (field: keyof T) => void;
  onFilterChange: (field: keyof T, value: string) => void;
  onToggleFilterPopup: (field: keyof T) => void;
  onCloseFilterPopup: () => void;
}

export default function FilterHeader<T extends object>({
  field,
  title,
  sortField,
  sortOrder,
  filterPopup,
  filters,
  onSort,
  onFilterChange,
  onToggleFilterPopup,
  onCloseFilterPopup,
}: FilterHeaderProps<T>) {
  return (
    <th
      className="border p-2 text-left cursor-pointer relative"
      onClick={() => onSort(field)}
    >
      {title}{" "}
      {sortField === field
        ? sortOrder === "asc"
          ? "▲"
          : "▼"
        : "⇅"}
      <span
        className="ml-2 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFilterPopup(field);
        }}
      >
        🔍
      </span>
      {filterPopup && filterPopup.field === field && (
        <div className="filter-popup absolute top-full left-0 bg-white border p-2 z-10">
          <input
            type="text"
            placeholder={`Filter by ${title}`}
            value={filters[field as string] || ""}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onFilterChange(field, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onCloseFilterPopup();
              }
            }}
            className="border p-1 rounded"
          />
          <button
            className="ml-2 border px-2"
            onClick={(e) => {
              e.stopPropagation();
              onCloseFilterPopup();
            }}
          >
            Apply
          </button>
        </div>
      )}
    </th>
  );
}