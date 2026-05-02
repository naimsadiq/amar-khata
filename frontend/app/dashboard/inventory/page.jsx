"use client";

import { useEffect, useState } from "react";
import InventoryHeader from "../components/inventory/InventoryHeader";
import SummaryCards from "../components/inventory/SummaryCards";
import FilterBar from "../components/inventory/FilterBar";
import ProductTable from "../components/inventory/ProductTable";


export default function InventoryPage() {
  const [data, setData] = useState({ summary: null, products: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Public ফোল্ডার থেকে JSON ডাটা ফেচ করা
    const fetchInventoryData = async () => {
      try {
        const res = await fetch("/data/inventory.json");
        const jsonData = await res.json();
        setData(jsonData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch inventory data:", error);
        setLoading(false);
      }
    };

    fetchInventoryData();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-slate-500">লোড হচ্ছে...</div>;
  }

  return (
    <div className="p-4 md:p-6 lg:px-8 bg-[#f5f7fa] min-h-screen">
      {/* Header Section */}
      <InventoryHeader totalProducts={data.summary?.totalProducts || "0"} />

      {/* Summary Cards */}
      <SummaryCards summary={data.summary} />

      {/* Filters (Search & Dropdowns) */}
      <FilterBar />

      {/* Data Table */}
      <ProductTable products={data.products} />
    </div>
  );
}
