// app/components/parties/SummaryGrid.jsx

import { useMemo } from "react";

export default function SummaryGrid({ partiesData = [] }) {
  // useMemo ব্যবহার করে ক্যালকুলেশনগুলো অপ্টিমাইজ করা হয়েছে
  const summary = useMemo(() => {
    return partiesData.reduce(
      (acc, contact) => {
        const dueAmount = contact.due ?? contact.dueBalance ?? 0;

        if (contact.type === "customer") {
          acc.totalCustomers += 1;
          acc.totalReceivable += dueAmount;
          if (dueAmount > 0) {
            acc.dueCustomersCount += 1;
          }
        } else if (contact.type === "supplier") {
          acc.totalSuppliers += 1;
          acc.totalPayable += dueAmount;
          if (dueAmount > 0) {
            acc.dueSuppliersCount += 1;
          }
        }

        return acc;
      },
      {
        totalCustomers: 0,
        totalSuppliers: 0,
        totalReceivable: 0, 
        totalPayable: 0, 
        dueCustomersCount: 0, 
        dueSuppliersCount: 0, 
      },
    );
  }, [partiesData]); // partiesData পরিবর্তন হলেই কেবল এই ক্যালকুলেশন আবার হবে

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition">
        <div className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">
          মোট গ্রাহক
        </div>
        <div className="text-2xl font-semibold text-gray-900 leading-none">
          {summary.totalCustomers}
        </div>
        <div className="text-xs mt-2 text-gray-400">
          {`মোট ${summary.totalCustomers + summary.totalSuppliers} জন সক্রিয়`}
        </div>
      </div>
      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition">
        <div className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">
          মোট সাপ্লায়ার
        </div>
        <div className="text-2xl font-semibold text-gray-900 leading-none">
          {summary.totalSuppliers}
        </div>
        <div className="text-xs mt-2 text-gray-400">
          {summary.dueSuppliersCount > 0
            ? `${summary.dueSuppliersCount} জনের কাছে দেনা`
            : "কোনো দেনা নেই"}
        </div>
      </div>
      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition border-l-4 border-l-[#1a7a4a]">
        <div className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">
          মোট পাওনা
        </div>
        <div className="text-2xl font-semibold text-[#1a7a4a] leading-none">
          {summary.totalReceivable}
        </div>
        <div className="text-xs mt-2 text-[#1a7a4a]">
          {summary.dueCustomersCount > 0
            ? `${summary.dueCustomersCount} জনের কাছে বকেয়া`
            : "সব আদায় হয়েছে"}
        </div>
      </div>
      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition border-l-4 border-l-[#c0392b]">
        <div className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">
          মোট দেনা
        </div>
        <div className="text-2xl font-semibold text-[#c0392b] leading-none">
          {summary.totalPayable}
        </div>
        <div className="text-xs mt-2 text-gray-400">
          {`${summary.dueSuppliersCount} জন সাপ্লায়ার`}
        </div>
      </div>
    </div>
  );
}
