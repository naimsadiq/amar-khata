"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axiosInstance";
import InventoryHeader from "../components/inventory/InventoryHeader";
import SummaryCards from "../components/inventory/SummaryCards";
import FilterBar from "../components/inventory/FilterBar";
import ProductTable from "../components/inventory/ProductTable";
import AddProductModal from "../components/inventory/AddProductModal";
import PurchaseModal from "../components/inventory/PurchaseModal";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";

export default function InventoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all-cat");
  const [stockStatus, setStockStatus] = useState("all-stock");

  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["inventory"],
    queryFn: async () => (await api.get("/api/inventory")).data,
  });

  const summary = useMemo(() => {
    let totalProducts = products.length;
    let lowStock = 0,
      outOfStock = 0,
      totalValue = 0;

    products.forEach((p) => {
      totalValue += p.buyPrice * p.stockQuantity;
      if (p.stockQuantity === 0) outOfStock++;
      else if (p.stockQuantity <= p.lowStockAlert) lowStock++;
    });

    return { totalProducts, lowStock, outOfStock, totalValue };
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchSearch = p.name
          ?.toLowerCase()
          .includes((search || "").trim().toLowerCase());
        const matchCat = category === "all-cat" || p.category === category;
        let pStatus = "normal";
        if (p.stockQuantity === 0) pStatus = "out";
        else if (p.stockQuantity <= p.lowStockAlert) pStatus = "low";
        const matchStock =
          stockStatus === "all-stock" || pStatus === stockStatus;

        return matchSearch && matchCat && matchStock;
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt || 0) -
          new Date(a.updatedAt || a.createdAt || 0),
      );
  }, [products, search, category, stockStatus]);

  const uniqueCategories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="p-4 md:p-6 lg:px-8 w-full h-full space-y-6">
      <InventoryHeader
        totalProducts={summary.totalProducts.toLocaleString("en-IN")}
        onAddClick={() => setIsModalOpen(true)}
        onPurchaseClick={() => setIsPurchaseModalOpen(true)}
      />

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-24 w-full rounded-xl bg-card border border-border"
              />
            ))}
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <Skeleton className="h-10 w-full md:w-[300px] rounded-lg bg-card" />
            <Skeleton className="h-10 w-full md:w-[180px] rounded-lg bg-card" />
            <Skeleton className="h-10 w-full md:w-[180px] rounded-lg bg-card" />
          </div>
          <Skeleton className="h-[400px] w-full rounded-xl bg-card border border-border" />
        </div>
      ) : isError ? (
        <ErrorState
          message="ইনভেন্টরির ডাটা লোড করতে সমস্যা হয়েছে!"
          onRetry={refetch}
        />
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
      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
      />
    </div>
  );
}
