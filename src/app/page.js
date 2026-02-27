"use client";
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Header from "@/components/layout/Header";

import CustomersTab from "@/components/home/CustomersTab";
import SuppliersTab from "@/components/home/SuppliersTab";
import AccountTab from "@/components/home/AccountTab";
import AllTab from "@/components/home/AllTab";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("Customers");
  const tabs = ["Customers", "Suppliers", "Account", "All"];

  return (
    <AppLayout>
      {/* Top Header */}
      <Header />

      {/* Tabs Menu */}
      <div className="flex items-center justify-between px-2 mt-2 sticky top-0 bg-white z-10 pb-2 border-b border-gray-50">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-[14px] transition-all duration-200 ${
              activeTab === tab
                ? "bg-[#eaf8f0] text-[#10b981] font-semibold"
                : "text-gray-600 hover:bg-gray-50 font-medium"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="flex-1 mt-2">
        {activeTab === "Customers" && <CustomersTab />}
        {activeTab === "Suppliers" && <SuppliersTab />}
        {activeTab === "Account" && <AccountTab />}
        {activeTab === "All" && <AllTab />}
      </div>
    </AppLayout>
  );
}
