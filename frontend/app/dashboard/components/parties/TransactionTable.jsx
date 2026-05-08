import React from "react";
import {
  Loader2,
  ReceiptText,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// তারিখ এবং সময় ফরম্যাট করার ফাংশন
const formatDateTime = (isoString) => {
  if (!isoString) return "-";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export default function TransactionTable({ transactions, isLoading, isError }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-5">
      <div className="p-4 md:p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div className="flex items-center gap-2">
          <ReceiptText className="w-5 h-5 text-[#1a7a4a]" />
          <h2 className="text-base font-semibold text-gray-800 uppercase tracking-wide">
            লেনদেনের বিবরণী
          </h2>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-[13px] border-b border-gray-200">
              <th className="py-3 px-4 font-medium whitespace-nowrap">
                তারিখ ও সময়
              </th>
              <th className="py-3 px-4 font-medium whitespace-nowrap">
                বিবরণ / ইনভয়েস
              </th>
              <th className="py-3 px-4 font-medium text-right whitespace-nowrap">
                মোট বিল
              </th>
              <th className="py-3 px-4 font-medium text-right whitespace-nowrap">
                জমা / পরিশোধ
              </th>
              <th className="py-3 px-4 font-medium text-right whitespace-nowrap">
                বাকি
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="py-10 text-center">
                  <Loader2 className="animate-spin text-[#1a7a4a] h-6 w-6 mx-auto" />
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan="5" className="py-10 text-center text-red-500">
                  লেনদেন লোড করতে সমস্যা হয়েছে।
                </td>
              </tr>
            ) : !transactions || transactions.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center">
                    <ReceiptText className="w-10 h-10 mb-2 opacity-20" />
                    <p>কোনো লেনদেনের তথ্য পাওয়া যায়নি</p>
                  </div>
                </td>
              </tr>
            ) : (
              transactions.map((txn) => {
                // সেলস নাকি পার্চেস সেটা চেক করা
                const isSale = txn.type === "sale";

                return (
                  <tr
                    key={txn._id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50/70 transition-colors"
                  >
                    {/* তারিখ ও সময় */}
                    <td className="py-4 px-4 text-gray-600 whitespace-nowrap text-[13px]">
                      {formatDateTime(txn.date || txn.createdAt)}
                    </td>

                    {/* বিবরণ / ইনভয়েস */}
                    <td className="py-4 px-4 min-w-[200px]">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">
                          {txn.invoiceNo}
                        </span>
                        <Badge
                          variant="secondary"
                          className={`text-[10px] px-1.5 py-0 shadow-none ${
                            isSale
                              ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                              : "bg-purple-50 text-purple-600 hover:bg-purple-100"
                          }`}
                        >
                          {isSale ? "বিক্রয়" : "ক্রয়"}
                        </Badge>
                      </div>
                      <div className="text-[12px] text-gray-400 mt-0.5">
                        আইটেম: {txn.items?.length || 0} টি
                      </div>
                    </td>

                    {/* মোট বিল (Grand Total) */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <span className="text-gray-800 font-medium">
                        ৳ {Number(txn.grandTotal).toLocaleString("en-IN")}
                      </span>
                    </td>

                    {/* জমা / পরিশোধ (Paid Amount) */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <span
                        className={`flex items-center justify-end gap-1 font-medium ${txn.paidAmount > 0 ? "text-[#1a7a4a]" : "text-gray-400"}`}
                      >
                        {txn.paidAmount > 0 &&
                          (isSale ? (
                            <ArrowDownToLine className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowUpFromLine className="w-3.5 h-3.5" />
                          ))}
                        ৳ {Number(txn.paidAmount).toLocaleString("en-IN")}
                      </span>
                    </td>

                    {/* বাকি (Due Amount) */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <span
                        className={`font-semibold ${txn.dueAmount > 0 ? "text-[#c0392b]" : "text-gray-500"}`}
                      >
                        ৳ {Number(txn.dueAmount).toLocaleString("en-IN")}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
