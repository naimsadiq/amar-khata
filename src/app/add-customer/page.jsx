"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Contact } from "lucide-react";
import toast from "react-hot-toast";

export default function AddCustomerPage() {
  const router = useRouter();

  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSave = () => {
    if (!customerName || !phoneNumber) {
      toast.error("Please fill out both fields!");
      return;
    }

    console.log("=== New Customer Data ===");
    console.log("Customer Name:", customerName);
    console.log("Phone Number:", phoneNumber);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
      {/* Mobile Frame */}
      <div className="w-full max-w-[480px] bg-white h-[100dvh] shadow-2xl relative flex flex-col overflow-hidden sm:rounded-2xl sm:h-[90vh]">
        {/* Top Header */}
        <div className="bg-[#10b981] px-4 py-4 flex items-center text-white shrink-0">
          <button
            onClick={() => router.back()}
            className="hover:bg-white/20 p-1.5 rounded-full transition-colors active:scale-95 mr-3"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-[18px] font-medium tracking-wide">
            Add Customer
          </h1>
        </div>

        {/* Form Content Area */}
        <div className="flex-1 p-5 bg-white mt-2">
          {/* Customer Name Input */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-[14px] text-[15px] text-gray-800 placeholder-gray-400 outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition-all"
            />
          </div>

          {/* Phone Number Input */}
          <div className="w-full border border-gray-300 rounded-xl bg-white flex items-center pr-4 transition-all focus-within:border-[#10b981] focus-within:ring-1 focus-within:ring-[#10b981]">
            <input
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1 pl-4 py-[14px] text-[15px] text-gray-800 placeholder-gray-400 outline-none bg-transparent rounded-l-xl"
            />
            {/* Green Contact Icon */}
            <Contact
              className="w-6 h-6 text-[#10b981] shrink-0"
              strokeWidth={2}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="p-4 bg-white pb-6 sm:pb-4 shrink-0">
          <button
            onClick={handleSave}
            className="w-full bg-[#10b981] text-white py-[14px] rounded-xl text-[16px] font-medium hover:bg-[#0e9f6e] active:scale-[0.98] transition-all shadow-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
