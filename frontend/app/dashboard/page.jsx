"use client";
import { useState } from "react";
import QuickActions from "./components/overview/QuickActions";
import StatCards from "./components/overview/StatCards";
import WeeklySalesChart from "./components/overview/WeeklySalesChart";
import TopProducts from "./components/overview/TopProducts";
import RecentTransactions from "./components/overview/RecentTransactions";
import MonthlyProfit from "./components/overview/MonthlyProfit";
import AddModal from "./components/parties/AddModal";
import CashbookModal from "./components/cashbook/CashbookModal";
import PurchaseModal from "./components/inventory/PurchaseModal";
import AddProductModal from "./components/inventory/AddProductModal";

export default function OverviewPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCashbookModalOpen, setIsCashbookModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("IN");
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  return (
    <div className="flex-1 min-w-0 space-y-4 p-4 md:p-8 pt-6 bg-slate-50 min-h-screen">
      <QuickActions
        setIsModalOpen={setIsModalOpen}
        setTransactionType={setTransactionType}
        setIsCashbookModalOpen={setIsCashbookModalOpen}
        onAddClick={() => setIsAddProductModalOpen(true)}
        onPurchaseClick={() => setIsPurchaseModalOpen(true)}
      />

      <div className="mt-6 space-y-4">
        {/* StatCards নিজেই নিজের ডেটা ফেচ করবে */}
        <StatCards />
      </div>

      <div className="mt-6 grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Left Side */}
        <div className="lg:col-span-2 grid gap-6 grid-cols-1 md:grid-cols-2 min-w-0">
          <WeeklySalesChart />
          <TopProducts />
        </div>

        {/* Right Side */}
        <div className="lg:col-span-1 flex flex-col gap-6 min-w-0">
          <RecentTransactions />
          <MonthlyProfit />
        </div>
      </div>

      <AddModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <CashbookModal
        isOpen={isCashbookModalOpen}
        onClose={() => setIsCashbookModalOpen(false)}
        type={transactionType}
      />

      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
      />

      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
      />
    </div>
  );
}
