// app/parties/page.jsx

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search, Download, Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import AddModal from "../components/parties/AddModal";
import SummaryGrid from "../components/parties/SummaryGrid";
import PartiesCard from "../components/parties/PartiesCard";
import api from "@/lib/axiosInstance";

// 'tr' from framer-motion অপ্রয়োজনীয়, তাই সরানো হলো

export default function PartiesListPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // TanStack Query দিয়ে parties fetch করা হচ্ছে
  const {
    data: partiesData = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["parties"],
    queryFn: async () => {
      // এখানে সরাসরি URL না দিয়ে api instance ব্যবহার করাই ভালো
      const res = await api.get("/api/parties");
      return res.data;
    },
  });

  // ফিল্টার করা parties এর তালিকা
  const filterParties = partiesData
    .filter((p) => {
      // API ডাটা অনুযায়ী `dueBalance` এবং `openingBalance` ব্যবহার করা হয়েছে
      const dueAmount = p.dueBalance ?? Number(p.openingBalance) ?? 0;
      const term = search?.trim().toLowerCase();

      // ট্যাব অনুযায়ী ফিল্টার
      if (activeTab === "customer" && p.type !== "customer") return false;
      if (activeTab === "supplier" && p.type !== "supplier") return false;

      // বকেয়া ফিল্টার (যাদের কাছে টাকা পাওনা আছে বা যাদেরকে টাকা দিতে হবে)
      if (filter === "due" && dueAmount <= 0) return false;

      // সার্চ টার্ম অনুযায়ী ফিল্টার
      if (term) {
        const matchName = p.name?.toLowerCase().includes(term);
        const matchPhone = p.phone?.includes(term);
        if (!matchName && !matchPhone) return false;
      }

      return true;
    })
    .sort((a, b) => {
      // createdAt এর পরিবর্তে updatedAt ব্যবহার করা হলো
      const dateA = new Date(a.updatedAt || a.createdAt || 0);
      const dateB = new Date(b.updatedAt || b.createdAt || 0);

      return dateB - dateA; // Descending order (নতুন এবং আপডেট হওয়া ডাটা উপরে)
    });
    
  const handleCardClick = (partiesId) => {
    router.push(`/dashboard/parties/${partiesId}`);
  };

  return (
    <div className="p-4 md:p-6 flex flex-col gap-5 h-full overflow-y-auto bg-[#f5f4f0] font-['Hind_Siliguri']">
      {/* Action Bar */}
      <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
        <div className="flex bg-white border border-gray-200 rounded-lg p-1">
          {["all", "customer", "supplier"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-sm rounded-md transition-all ${
                activeTab === tab
                  ? "bg-[#1a7a4a] text-white font-medium"
                  : "text-gray-600 hover:bg-gray-100"
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
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="নাম বা ফোন নম্বর..."
            className="pl-9 h-9 border-gray-200 focus-visible:ring-[#1a7a4a] bg-white rounded-lg"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>

        <div className="flex gap-2 w-full lg:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="h-9 bg-white border-gray-200 flex-1 lg:flex-none"
          >
            <Download className="h-4 w-4 mr-2" /> এক্সপোর্ট
          </Button>
          <Button
            size="sm"
            className="h-9 bg-[#1a7a4a] hover:bg-[#0f5234] text-white flex-1 lg:flex-none"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> নতুন যোগ করুন
          </Button>
        </div>
      </div>

      <SummaryGrid partiesData={partiesData} />

      {/* Filter Chips */}
      <div className="flex items-center gap-2 flex-wrap text-sm">
        {["all", "due"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full border transition-all ${
              filter === f
                ? "bg-[#e8f5ee] border-[#1a7a4a] text-[#0f5234]"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f === "all" ? "সব" : "বকেয়া আছে"}
          </button>
        ))}
        <span className="text-gray-400 text-xs ml-auto">
          {filterParties.length} জন
        </span>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col gap-3 w-full">
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin text-[#1a7a4a] h-8 w-8" />
          </div>
        ) : isError ? (
          <div className="text-center py-10 text-red-500 bg-white rounded-xl border border-red-100">
            ডাটা লোড করতে সমস্যা হয়েছে!
          </div>
        ) : filterParties.length > 0 ? (
          filterParties.map((p) => (
            <PartiesCard
              key={p._id}
              contact={p}
              onClick={() => handleCardClick(p._id)}
            />
          ))
        ) : (
          <div className="text-center py-10 text-gray-500 text-sm bg-white rounded-xl border border-gray-100">
            কোনো ফলাফল পাওয়া যায়নি
          </div>
        )}
      </div>

      <AddModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
