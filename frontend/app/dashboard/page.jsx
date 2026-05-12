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
    <div className="flex-1 w-full space-y-4 md:space-y-6">
      {/* Quick Actions (Mobile Responsive) */}
      <QuickActions
        setIsModalOpen={setIsModalOpen}
        setTransactionType={setTransactionType}
        setIsCashbookModalOpen={setIsCashbookModalOpen}
        onAddClick={() => setIsAddProductModalOpen(true)}
        onPurchaseClick={() => setIsPurchaseModalOpen(true)}
      />

      <div className="space-y-4">
        <StatCards />
      </div>

      {/* Grid Layout Update for better responsiveness */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 xl:grid-cols-3">
        {/* Left Side (Takes 2 columns on extra large screens) */}
        <div className="xl:col-span-2 grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
          <div className="min-w-0">
            <WeeklySalesChart />
          </div>
          <div className="min-w-0">
            <TopProducts />
          </div>
        </div>

        {/* Right Side (Takes 1 column on extra large screens) */}
        <div className="xl:col-span-1 flex flex-col gap-4 md:gap-6 min-w-0">
          <RecentTransactions />
          <MonthlyProfit />
        </div>
      </div>

      {/* Modals */}
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
