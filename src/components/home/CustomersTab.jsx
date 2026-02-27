"use client";
import React, { useState } from "react";
import { EyeOff, Eye, Search, UserPlus } from "lucide-react";

export default function CustomersTab() {
  const [isHidden, setIsHidden] = useState(false);

  return (
    <div className="animate-in fade-in slide-in-from-right-2 duration-300">
      {/* Balance Card */}
      <div className="mx-4 mt-2 border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Net Balance */}
        <div className="bg-[#f3fbf6] py-3 text-center text-gray-600 text-[14px]">
          Net Balance{" "}
          <span className="font-semibold text-gray-800 ml-1">
            {isHidden ? "..." : "0.0৳"}
          </span>
        </div>

        {/* Give & Get Balance */}
        <div className="flex divide-x divide-gray-100 bg-white">
          <div className="flex-1 py-4 text-center">
            <div className="text-[#10b981] text-2xl font-bold mb-1">
              {isHidden ? "..." : "0.00৳"}
            </div>
            <div className="text-gray-400 text-[12px]">You Will Give</div>
          </div>
          <div className="flex-1 py-4 text-center">
            <div className="text-red-500 text-2xl font-bold mb-1">
              {isHidden ? "..." : "0.00৳"}
            </div>
            <div className="text-gray-400 text-[12px]">You Will Get</div>
          </div>
        </div>

        {/* Hide/Show Button */}
        <div className="border-t border-gray-100 py-2.5 bg-white">
          <button
            onClick={() => setIsHidden(!isHidden)}
            className="w-full flex items-center justify-center gap-2 text-[#10b981] text-[14px] font-medium hover:bg-gray-50 transition-colors"
          >
            {isHidden ? (
              <>
                <Eye className="w-4 h-4" /> Show
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4" /> Hide
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mx-4 mt-5 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search Customers..."
          className="w-full border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-gray-400 text-[14px] outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition-all"
        />
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center mt-16 text-center px-4">
        <p className="text-gray-400 text-[15px]">No customers found.</p>
        <p className="text-gray-400 text-[15px]">Please add some customers.</p>
      </div>

      {/* Floating Add Button */}
      <button className="fixed sm:absolute bottom-20 right-5 bg-[#10b981] text-white p-4 rounded-full shadow-lg hover:bg-[#0e9f6e] hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 z-20">
        <UserPlus className="w-6 h-6" />
      </button>
    </div>
  );
}
