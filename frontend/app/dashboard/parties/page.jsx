// app/parties/page.jsx

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // next/navigation থেকে useRouter ইম্পোর্ট করুন
import { Search, Filter, Download, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import AddModal from "../components/parties/AddModal";
import SummaryGrid from "../components/parties/SummaryGrid";
import ContactCard from "../components/parties/ContactCard";

// ContactDetail কম্পোনেন্টটি এই পেইজ থেকে সরিয়ে ফেলা হয়েছে

export default function PartiesListPage() {
  const router = useRouter(); // useRouter হুক ব্যবহার করুন
  const [contacts, setContacts] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // selectedId state-এর আর প্রয়োজন নেই, তাই এটি মুছে ফেলা হয়েছে
  // const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetch("/data/contacts.json")
      .then((res) => res.json())
      .then((data) => setContacts(data));
  }, []);

  const filteredContacts = contacts.filter((c) => {
    if (activeTab === "customer" && c.type !== "customer") return false;
    if (activeTab === "supplier" && c.type !== "supplier") return false;
    if (filter === "due" && c.due === 0) return false;
    if (filter === "overdue" && !c.overdue) return false;
    if (
      search &&
      !c.name.toLowerCase().includes(search.toLowerCase()) &&
      !c.phone.includes(search)
    )
      return false;
    return true;
  });

  // selectedContact ভ্যারিয়েবলের আর প্রয়োজন নেই
  // const selectedContact = contacts.find((c) => c.id === selectedId);

  const handleCardClick = (contactId) => {
    // কার্ডে ক্লিক করলে ডিটেলস পেইজে নেভিগেট করবে
    router.push(`/dashboard/parties/${contactId}`);
  };

  return (
    <div className="p-4 md:p-6 flex flex-col gap-5 h-full overflow-y-auto bg-[#f5f4f0] font-['Hind_Siliguri']">
      {/* Action Bar এবং অন্যান্য UI অপরিবর্তিত থাকবে */}
      <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
        {/* ... আপনার আগের Action Bar কোড ... */}
        <div className="flex bg-white border border-gray-200 rounded-lg p-1">
          {["all", "customer", "supplier"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-sm rounded-md transition-all ${activeTab === tab ? "bg-[#1a7a4a] text-white font-medium" : "text-gray-600 hover:bg-gray-100"}`}
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
            <Filter className="h-4 w-4 mr-2" /> ফিল্টার
          </Button>
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

      <SummaryGrid />

      {/* Filter Chips */}
      <div className="flex items-center gap-2 flex-wrap text-sm">
        {/* ... আপনার আগের Filter Chips কোড ... */}
        {["all", "due", "overdue"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full border transition-all ${filter === f ? (f === "overdue" ? "bg-[#fde8e8] border-[#c0392b] text-[#c0392b]" : "bg-[#e8f5ee] border-[#1a7a4a] text-[#0f5234]") : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            {f === "all" ? "সব" : f === "due" ? "বকেয়া আছে" : "মেয়াদোত্তীর্ণ"}
          </button>
        ))}
        <span className="text-gray-400 text-xs ml-auto">
          {filteredContacts.length} জন
        </span>
      </div>

      {/* Main Content Area - এখন এটি ফুল-উইডথ */}
      <div className="flex flex-col gap-3 w-full">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((c) => (
            <ContactCard
              key={c.id}
              contact={c}
              // isSelected prop-এর আর প্রয়োজন নেই
              onClick={() => handleCardClick(c.id)} // নতুন হ্যান্ডলার যুক্ত করা হয়েছে
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
