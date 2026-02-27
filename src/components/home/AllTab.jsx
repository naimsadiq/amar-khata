"use client";
import React, { useState } from "react";
import { EyeOff, Eye } from "lucide-react";

export default function AllTab() {
  const [isHidden, setIsHidden] = useState(false);

  return (
    <div className="animate-in fade-in slide-in-from-right-2 duration-300 pb-10">
      {/* Balance Card */}
      <div className="mx-4 mt-2 border border-gray-100 rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="bg-[#f3fbf6] py-3 text-center text-gray-600 text-[14px]">
          Net Balance{" "}
          <span className="font-semibold text-gray-800 ml-1">
            {isHidden ? "..." : "0.0৳"}
          </span>
        </div>
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

      {/* All Empty States List */}
      <div className="flex flex-col gap-6 text-center px-4">
        {/* Customers */}
        <div>
          <h3 className="text-gray-600 font-medium mb-2">Customers</h3>
          <p className="text-gray-400 text-[14px]">No customers found.</p>
          <p className="text-gray-400 text-[14px]">
            Please add some customers.
          </p>
        </div>

        {/* Suppliers */}
        <div>
          <h3 className="text-gray-600 font-medium mb-2">Suppliers</h3>
          <p className="text-gray-400 text-[14px]">No suppliers found.</p>
          <p className="text-gray-400 text-[14px]">
            Please add some suppliers.
          </p>
        </div>

        {/* Bank Accounts */}
        <div>
          <h3 className="text-gray-600 font-medium mb-2">Bank Accounts</h3>
          <p className="text-gray-400 text-[14px]">No bank accounts found.</p>
          <p className="text-gray-400 text-[14px]">
            Please add a bank account to see transactions.
          </p>
        </div>
      </div>
    </div>
  );
}
