"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpDown,
  Search,
  UserPlus,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function CustomersPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
      <div className="w-full max-w-[480px] bg-white h-[100dvh] shadow-2xl relative flex flex-col overflow-hidden sm:rounded-2xl sm:h-[90vh]">
        {/* Top Header */}
        <div className="bg-[#10b981] px-4 py-3.5 flex items-center justify-between text-white shadow-sm z-10">
          <div className="flex items-center gap-3">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="hover:bg-white/20 p-1.5 rounded-full transition-colors active:scale-95"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-[18px] font-medium">Customers</h1>
          </div>

          {/* Sort Icon */}
          <button className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
            <ArrowUpDown className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-white pt-2">
          {/* Search Bar */}
          <div className="px-4 py-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search Customers"
                className="w-full bg-[#f4f4f5] border border-transparent rounded-full py-3.5 pl-12 pr-4 text-gray-800 text-[15px] outline-none focus:border-[#10b981] focus:bg-white focus:ring-1 focus:ring-[#10b981] transition-all"
              />
            </div>
          </div>

          {/* Add A Customer Button (List Item) */}
          <div className="px-4 mt-4">
            <Link
              href="/add-customer"
              className="w-full flex items-center bg-white hover:bg-gray-50 p-2 rounded-xl transition-colors group"
            >
              {/* Green Icon Circle */}
              <div className="w-12 h-12 bg-[#10b981] rounded-full flex items-center justify-center text-white shadow-sm">
                <UserPlus className="w-6 h-6" />
              </div>

              {/* Text */}
              <span className="text-[#10b981] font-medium text-[16px] ml-4">
                Add A Customer
              </span>

              {/* Arrow Icon */}
              <ChevronRight className="w-5 h-5 text-[#10b981] ml-auto group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
