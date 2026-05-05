"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axiosInstance";
import ActionButtons from "../components/cashbook/ActionButtons";
import SummaryCards from "../components/cashbook/SummaryCards";
import TransactionTable from "../components/cashbook/TransactionTable";
import CashbookModal from "../components/cashbook/CashbookModal"; // নতুন মডাল
import { Skeleton } from "@/components/ui/skeleton";

export default function CashbookPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("IN"); // "IN" বা "OUT"

  // TanStack Query দিয়ে ডাটা ফেচ
  const { data, isLoading } = useQuery({
    queryKey: ["cashbook"],
    queryFn: async () => {
      const res = await api.get("/api/cashbook");
      return res.data; // { summary: {...}, transactions: [...] }
    },
  });

  // বাটন ক্লিকের হ্যান্ডলার
  const handleOpenModal = (type) => {
    setTransactionType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f7fa] w-full font-['Hind_Siliguri']">
      <div className="p-4 md:p-6 overflow-y-auto">
        <ActionButtons
          onCashIn={() => handleOpenModal("IN")}
          onCashOut={() => handleOpenModal("OUT")}
        />

        {isLoading ? (
          // Skeleton Loading Animation
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  className="h-[120px] w-full rounded-xl bg-slate-200"
                />
              ))}
            </div>
            <Skeleton className="h-[400px] w-full rounded-xl bg-slate-200" />
          </div>
        ) : (
          <>
            <SummaryCards data={data?.summary} />
            <TransactionTable transactions={data?.transactions || []} />
          </>
        )}
      </div>

      {/* Cashbook Modal */}
      <CashbookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={transactionType}
      />
    </div>
  );
}
