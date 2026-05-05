"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axiosInstance";
import InventoryHeader from "../components/inventory/InventoryHeader";
import SummaryCards from "../components/inventory/SummaryCards";
import FilterBar from "../components/inventory/FilterBar";
import ProductTable from "../components/inventory/ProductTable";
import AddProductModal from "../components/inventory/AddProductModal";
import { Skeleton } from "@/components/ui/skeleton";

export default function InventoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ফিল্টারের জন্য State
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all-cat");
  const [stockStatus, setStockStatus] = useState("all-stock");

  // TanStack Query দিয়ে ডাটা ফেচ
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      const res = await api.get("/api/inventory");
      return res.data;
    },
  });

  // ডাইনামিক সামারি ক্যালকুলেশন
  const summary = useMemo(() => {
    let totalProducts = products.length;
    let lowStock = 0;
    let outOfStock = 0;
    let totalValue = 0;

    products.forEach((p) => {
      totalValue += p.buyPrice * p.stockQuantity; // মোট স্টক মূল্য
      if (p.stockQuantity === 0) outOfStock++;
      else if (p.stockQuantity <= p.lowStockAlert) lowStock++;
    });

    return { totalProducts, lowStock, outOfStock, totalValue };
  }, [products]);

  // ডাইনামিক ফিল্টারিং লজিক
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Name Search
      const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());

      // Category Filter
      const matchCat = category === "all-cat" || p.category === category;

      // Stock Status Filter
      let pStatus = "normal";
      if (p.stockQuantity === 0) pStatus = "out";
      else if (p.stockQuantity <= p.lowStockAlert) pStatus = "low";

      const matchStock = stockStatus === "all-stock" || pStatus === stockStatus;

      return matchSearch && matchCat && matchStock;
    });
  }, [products, search, category, stockStatus]);

  // ডাইনামিক ক্যাটাগরি লিস্ট (ফিল্টার ড্রপডাউনের জন্য)
  const uniqueCategories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="p-4 md:p-6 lg:px-8 bg-[#f5f7fa] min-h-screen font-['Hind_Siliguri']">
      <InventoryHeader
        totalProducts={summary.totalProducts.toLocaleString("en-IN")}
        onAddClick={() => setIsModalOpen(true)}
      />

      {isLoading ? (
        // Skeleton Loader
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton
                key={i}
                className="h-24 w-full rounded-xl bg-slate-200"
              />
            ))}
          </div>
          <div className="flex gap-3 mb-6">
            <Skeleton className="h-10 w-[300px] rounded-lg bg-slate-200" />
            <Skeleton className="h-10 w-[180px] rounded-lg bg-slate-200" />
            <Skeleton className="h-10 w-[180px] rounded-lg bg-slate-200" />
          </div>
          <Skeleton className="h-[400px] w-full rounded-[12px] bg-slate-200" />
        </div>
      ) : (
        <>
          <SummaryCards summary={summary} />

          <FilterBar
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            stockStatus={stockStatus}
            setStockStatus={setStockStatus}
            categories={uniqueCategories}
          />

          <ProductTable products={filteredProducts} />
        </>
      )}

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
