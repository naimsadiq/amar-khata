"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search, Download, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";

import AddModal from "../components/parties/AddModal";
import SummaryGrid from "../components/parties/SummaryGrid";
import PartiesCard from "../components/parties/PartiesCard";
import api from "@/lib/axiosInstance";

export default function PartiesListPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: partiesData = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["parties"],
    queryFn: async () => (await api.get("/api/parties")).data,
  });

  const filterParties = partiesData
    .filter((p) => {
      const dueAmount = p.dueBalance ?? Number(p.openingBalance) ?? 0;
      const term = search?.trim().toLowerCase();

      if (activeTab === "customer" && p.type !== "customer") return false;
      if (activeTab === "supplier" && p.type !== "supplier") return false;
      if (filter === "due" && dueAmount <= 0) return false;
      if (term) {
        const matchName = p.name?.toLowerCase().includes(term);
        const matchPhone = p.phone?.includes(term);
        if (!matchName && !matchPhone) return false;
      }
      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt || 0) -
        new Date(a.updatedAt || a.createdAt || 0),
    );

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* Action Bar */}
      <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
        <div className="flex bg-muted p-1 rounded-lg w-full lg:w-auto">
          {["all", "customer", "supplier"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 lg:flex-none px-4 py-1.5 text-sm rounded-md transition-all font-medium ${
                activeTab === tab
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "all"
                ? "সবাই"
                : tab === "customer"
                  ? "গ্রাহক"
                  : "সাপ্লায়ার"}
            </button>
          ))}
        </div>

        <div className="flex-1 w-full lg:max-w-xs relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="নাম বা ফোন নম্বর..."
            className="pl-9 h-9 bg-card border-border focus-visible:ring-primary"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>

        <div className="flex gap-2 w-full lg:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="h-9 flex-1 lg:flex-none"
          >
            <Download className="h-4 w-4 mr-2" /> এক্সপোর্ট
          </Button>
          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="h-9 flex-1 lg:flex-none"
          >
            <Plus className="h-4 w-4 mr-2" /> নতুন যোগ
          </Button>
        </div>
      </div>

      <SummaryGrid partiesData={partiesData} />

      {/* Filter Chips */}
      <div className="flex items-center gap-2 text-sm">
        {["all", "due"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full border transition-all text-xs font-medium ${
              filter === f
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-card border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {f === "all" ? "সব" : "বকেয়া আছে"}
          </button>
        ))}
        <span className="text-muted-foreground text-xs ml-auto">
          {filterParties.length} জন
        </span>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col gap-3 w-full">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-24 w-full rounded-xl bg-card border border-border"
            />
          ))
        ) : isError ? (
          <ErrorState message="ডাটা লোড করতে সমস্যা হয়েছে!" onRetry={refetch} />
        ) : filterParties.length > 0 ? (
          filterParties.map((p) => (
            <PartiesCard
              key={p._id}
              contact={p}
              onClick={() => router.push(`/dashboard/parties/${p._id}`)}
            />
          ))
        ) : (
          <div className="text-center py-10 text-muted-foreground text-sm bg-card rounded-xl border border-border">
            কোনো ফলাফল পাওয়া যায়নি
          </div>
        )}
      </div>

      <AddModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
