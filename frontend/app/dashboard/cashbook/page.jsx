"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ActionButtons from "../components/cashbook/ActionButtons";
import SummaryCards from "../components/cashbook/SummaryCards";
import TransactionTable from "../components/cashbook/TransactionTable";

export default function CashbookPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch dummy data from public folder
  useEffect(() => {
    fetch("/data/cashbook.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f7fa] w-full">
      {/* Top Header Section */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-md">
            কাশবুক
          </h1>
          <span className="text-sm text-gray-500">সোমবার, ২৮ এপ্রিল, ২০২৬</span>
        </div>

        {/* Date Filter Tabs */}
        <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
          <Button
            variant="ghost"
            size="sm"
            className="bg-[#2ecc71] text-white hover:bg-[#2ecc71] hover:text-white rounded-md h-8 text-xs font-normal px-4"
          >
            আজকের হিসাব
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-800 rounded-md h-8 text-xs font-normal px-4"
          >
            এই সপ্তাহ
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-800 rounded-md h-8 text-xs font-normal px-4"
          >
            এই মাস
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64 text-gray-500">
            লোড হচ্ছে...
          </div>
        ) : (
          <>
            <ActionButtons />
            <SummaryCards data={data.summary} />
            <TransactionTable transactions={data.transactions} />
          </>
        )}
      </div>
    </div>
  );
}
