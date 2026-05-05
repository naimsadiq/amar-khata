// app/parties/page.jsx

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query"; // TanStack Query ইম্পোর্ট
import { Search, Filter, Download, Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import AddModal from "../components/parties/AddModal";
import SummaryGrid from "../components/parties/SummaryGrid";
import ContactCard from "../components/parties/ContactCard";
import api from "@/lib/axiosInstance";

export default function PartiesListPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // TanStack Query দিয়ে ডাটা ফেচিং
  const {
    data: contacts = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["parties"],
    queryFn: async () => {
      const res = await api.get("http://localhost:5000/api/parties");
      return res.data;
    },
  });

  // filtering, searching এবং sorting একসাথে করা হচ্ছে এখানে
  const filteredContacts = contacts
    .filter((c) => {
      const dueAmount = c.due ?? c.dueBalance ?? 0;
      const isOverdue = c.overdue ?? false;

      if (activeTab === "customer" && c.type !== "customer") return false;
      if (activeTab === "supplier" && c.type !== "supplier") return false;
      if (filter === "due" && dueAmount === 0) return false;
      if (filter === "overdue" && !isOverdue) return false;
      if (
        search &&
        !c.name?.toLowerCase().includes(search.toLowerCase()) &&
        !c.phone?.includes(search)
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      // createdAt এর ওপর ভিত্তি করে নতুন ডাটা সবার উপরে রাখা (Descending Order)
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB - dateA;
    });

  const handleCardClick = (contactId) => {
    router.push(`/dashboard/parties/${contactId}`);
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

      <SummaryGrid contacts={contacts} />

      {/* Filter Chips */}
      <div className="flex items-center gap-2 flex-wrap text-sm">
        {["all", "due", "overdue"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full border transition-all ${
              filter === f
                ? f === "overdue"
                  ? "bg-[#fde8e8] border-[#c0392b] text-[#c0392b]"
                  : "bg-[#e8f5ee] border-[#1a7a4a] text-[#0f5234]"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f === "all" ? "সব" : f === "due" ? "বকেয়া আছে" : "মেয়াদোত্তীর্ণ"}
          </button>
        ))}
        <span className="text-gray-400 text-xs ml-auto">
          {filteredContacts.length} জন
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
        ) : filteredContacts.length > 0 ? (
          filteredContacts.map((c) => (
            <ContactCard
              key={c._id}
              contact={c}
              onClick={() => handleCardClick(c._id)}
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
