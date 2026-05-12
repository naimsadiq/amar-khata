"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axiosInstance";
import ActionButtons from "../components/cashbook/ActionButtons";
import SummaryCards from "../components/cashbook/SummaryCards";
import TransactionTable from "../components/cashbook/TransactionTable";
import CashbookModal from "../components/cashbook/CashbookModal";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";

export default function CashbookPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("IN");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["cashbook"],
    queryFn: async () => {
      const res = await api.get("/api/cashbook");
      const transactions = res.data;

      const totalIncome = transactions
        .filter((t) => t.transactionType === "IN")
        .reduce((sum, t) => sum + t.amount, 0);
      const totalExpense = transactions
        .filter((t) => t.transactionType === "OUT")
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        transactions,
        summary: {
          totalIncome,
          totalExpense,
          netBalance: totalIncome - totalExpense,
        },
      };
    },
  });

  return (
    <div className="flex flex-col h-full w-full p-4 md:p-6 space-y-6">
      <ActionButtons
        onCashIn={() => {
          setTransactionType("IN");
          setIsModalOpen(true);
        }}
        onCashOut={() => {
          setTransactionType("OUT");
          setIsModalOpen(true);
        }}
      />

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-[120px] rounded-xl bg-card border border-border" />
            <Skeleton className="h-[120px] rounded-xl bg-card border border-border" />
            <Skeleton className="h-[120px] rounded-xl bg-card border border-border" />
          </div>
          <Skeleton className="h-[400px] rounded-xl bg-card border border-border" />
        </div>
      ) : isError ? (
        <ErrorState
          message="ক্যাশবুকের ডাটা লোড করতে সমস্যা হয়েছে!"
          onRetry={refetch}
        />
      ) : (
        <div className="space-y-6">
          <SummaryCards data={data?.summary} />
          <TransactionTable transactions={data?.transactions || []} />
        </div>
      )}

      <CashbookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={transactionType}
      />
    </div>
  );
}
