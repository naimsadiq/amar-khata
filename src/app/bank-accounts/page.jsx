"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search, UserPlus, ChevronRight } from "lucide-react";

export default function BankAccountsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
      <div className="w-full max-w-[480px] bg-white h-[100dvh] shadow-2xl relative flex flex-col overflow-hidden sm:rounded-2xl sm:h-[90vh]">
        {/* Top Header */}
        <div className="bg-[#10b981] px-4 py-3.5 flex items-center text-white shadow-sm z-10">
          <button
            onClick={() => router.back()}
            className="hover:bg-white/20 p-1.5 rounded-full transition-colors active:scale-95 mr-3"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-[18px] font-medium">Bank Accounts</h1>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-white flex flex-col">
          {/* Search Bar */}
          <div className="px-4 py-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search here..."
                className="w-full bg-[#f4f4f5] border border-transparent rounded-full py-3 pl-12 pr-4 text-[15px] outline-none focus:border-[#10b981] focus:bg-white focus:ring-1 focus:ring-[#10b981] transition-all"
              />
            </div>
          </div>

          {/* Info Text (Italic text with link) */}
          <div className="px-5 pb-5">
            <p className="text-gray-500 text-[14px] leading-relaxed italic">
              If you don't have a bank, you can create a custom bank then add
              accounts to it. To create a custom bank,{" "}
              <Link
                href="#"
                className="text-[#10b981] font-semibold not-italic hover:underline"
              >
                click here
              </Link>
              .
            </p>
          </div>

          {/* Add A Bank Account Button (List Item) */}
          <div className="px-4">
            <button className="w-full flex items-center bg-white hover:bg-gray-50 py-2 rounded-xl transition-colors group">
              {/* Green Icon Circle */}
              <div className="w-12 h-12 bg-[#10b981] rounded-full flex items-center justify-center text-white shadow-sm shrink-0">
                <UserPlus className="w-6 h-6" />
              </div>

              {/* Text */}
              <span className="text-[#10b981] font-medium text-[16px] ml-4 text-left">
                Add A Bank Account
              </span>

              {/* Arrow Icon */}
              <ChevronRight className="w-5 h-5 text-[#10b981] ml-auto group-hover:translate-x-1 transition-transform shrink-0" />
            </button>
          </div>

          {/* Empty State */}
          <div className="flex-1 flex flex-col items-center justify-center text-center pb-20 mt-10">
            <p className="text-gray-700 text-[15px]">No bank accounts found.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
