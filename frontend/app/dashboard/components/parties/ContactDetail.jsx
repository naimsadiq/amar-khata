import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  ReceiptText,
  ArrowDownToLine,
  ArrowUpFromLine,
  Wallet,
  CreditCard,
  Banknotes,
} from "lucide-react";
import { useRouter } from "next/navigation";

const getInitials = (name) => {
  if (!name) return "U";
  const words = name.split(" ");
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (isoString) => {
  if (!isoString) return "-";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export default function ContactDetail({
  contact,
  transactions,
  isTxnLoading,
  isTxnError,
}) {
  if (!contact) return null;
  const router = useRouter();

  const isCustomer = contact.type === "customer";
  const validTxns = transactions || [];
  const handleNewTransaction = () => {
    if (isCustomer) {
      // কাস্টমার হলে POS বা Sales পেজে যাবে (সাথে কাস্টমার ID দিয়ে দিলাম)
      router.push(`/dashboard/pos`);
    } else {
      // সাপ্লায়ার হলে Purchase পেজে যাবে
      router.push(`/dashboard/inventory`);
    }
  };

  // ডাইনামিক ক্যালকুলেশন (Transactions থেকে)
  const totalTxns = validTxns.length;
  const totalBilled = validTxns.reduce(
    (sum, txn) => sum + (Number(txn.grandTotal) || 0),
    0,
  );
  const totalPaid = validTxns.reduce(
    (sum, txn) => sum + (Number(txn.paidAmount) || 0),
    0,
  );

  // লাস্ট ট্রানজেকশন ডেট (লিস্টের প্রথমটা ধরে নিচ্ছি, যদি লেটেস্ট উপরে থাকে)
  const lastTxnDate =
    totalTxns > 0
      ? formatDate(validTxns[0].date || validTxns[0].createdAt)
      : formatDate(contact.updatedAt);

  const dueAmount = contact.currentDue ?? contact.openingBalance ?? 0;
  const address = contact.address || contact.addr || "ঠিকানা নেই";
  const phone = contact.phone || "নম্বর নেই";
  const initials = contact.init || getInitials(contact.name);

  const avatarClass =
    contact.av ||
    (isCustomer
      ? "bg-[#e3f0ff] text-[#1565c0]"
      : "bg-[#faeeda] text-[#854f0b]");

  const amtColor =
    dueAmount > 0
      ? "text-[#1a7a4a]"
      : dueAmount < 0
        ? "text-[#c0392b]"
        : "text-gray-600";
  const amtLabel =
    dueAmount > 0 ? "মোট পাওনা" : dueAmount < 0 ? "মোট দেনা" : "ব্যালেন্স";
  const absDue = Math.abs(dueAmount).toLocaleString("en-IN");

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
      {/* 1. Profile Header */}
      <div className="bg-[#e8f5ee]/50 p-5 flex flex-col sm:flex-row sm:items-center gap-4 border-b border-gray-100">
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold shrink-0 ${avatarClass}`}
        >
          {initials}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-semibold text-[#0f5234]">
              {contact.name || "নাম নেই"}
            </span>
            <Badge
              className={`text-[10px] shadow-none ${isCustomer ? "bg-[#e3f0ff] hover:bg-[#e3f0ff] text-[#1565c0]" : "bg-[#faeeda] hover:bg-[#faeeda] text-[#854f0b]"}`}
            >
              {isCustomer ? "গ্রাহক" : "সাপ্লায়ার"}
            </Badge>
          </div>
          <div className="text-sm text-gray-600">
            {phone} <span className="text-gray-300 mx-1">|</span> {address}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          <Button
            variant="outline"
            size="sm"
            className="border-[#c3e6d0] text-[#1a7a4a] hover:bg-[#e8f5ee]"
            onClick={handleNewTransaction}
          >
            নতুন লেনদেন
          </Button>
          <Button
            size="sm"
            className="bg-[#1a7a4a] hover:bg-[#0f5234] text-white"
          >
            {dueAmount >= 0 ? "টাকা নিন" : "টাকা দিন"}
          </Button>
        </div>
      </div>

      {/* 2. Dynamic Summary Stats */}
      <div className="p-5 border-b border-gray-100 bg-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-1 font-medium">
              {amtLabel}
            </div>
            <div className={`text-xl font-bold ${amtColor}`}>৳ {absDue}</div>
          </div>

          <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-1 font-medium">
              মোট বিল / ক্রয়
            </div>
            <div className="text-lg font-bold text-gray-800">
              ৳ {totalBilled.toLocaleString("en-IN")}
            </div>
          </div>

          <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-1 font-medium">
              মোট জমা / পরিশোধ
            </div>
            <div className="text-lg font-bold text-[#1a7a4a]">
              ৳ {totalPaid.toLocaleString("en-IN")}
            </div>
          </div>

          <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-1 font-medium">
              মোট লেনদেন (শেষ: {lastTxnDate})
            </div>
            <div className="text-lg font-bold text-gray-800">
              {totalTxns.toLocaleString("en-IN")} টি
            </div>
          </div>
        </div>
      </div>

      {/* 3. Transaction Table Section (Integrated) */}
      <div className="bg-white">
        <div className="p-4 md:px-5 flex items-center gap-2 bg-gray-50/50 border-b border-gray-100">
          <ReceiptText className="w-5 h-5 text-[#1a7a4a]" />
          <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
            লেনদেনের বিবরণী
          </h2>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-[13px] border-b border-gray-200">
                <th className="py-3 px-5 font-medium whitespace-nowrap">
                  তারিখ ও সময়
                </th>
                <th className="py-3 px-5 font-medium whitespace-nowrap">
                  বিবরণ / ইনভয়েস
                </th>
                <th className="py-3 px-5 font-medium text-right whitespace-nowrap">
                  মোট বিল
                </th>
                <th className="py-3 px-5 font-medium text-right whitespace-nowrap">
                  জমা / পরিশোধ
                </th>
                <th className="py-3 px-5 font-medium text-right whitespace-nowrap">
                  বাকি
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {isTxnLoading ? (
                <tr>
                  <td colSpan="5" className="py-10 text-center">
                    <Loader2 className="animate-spin text-[#1a7a4a] h-6 w-6 mx-auto" />
                  </td>
                </tr>
              ) : isTxnError ? (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-red-500">
                    লেনদেন লোড করতে সমস্যা হয়েছে।
                  </td>
                </tr>
              ) : validTxns.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <ReceiptText className="w-10 h-10 mb-2 opacity-20" />
                      <p>কোনো লেনদেনের তথ্য পাওয়া যায়নি</p>
                    </div>
                  </td>
                </tr>
              ) : (
                validTxns.map((txn) => {
                  const isSale = txn.type === "sale";

                  return (
                    <tr
                      key={txn._id}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="py-4 px-5 text-gray-600 whitespace-nowrap text-[13px]">
                        {formatDateTime(txn.date || txn.createdAt)}
                      </td>

                      <td className="py-4 px-5 min-w-[200px]">
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

                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <span className="text-gray-800 font-medium">
                          ৳ {Number(txn.grandTotal).toLocaleString("en-IN")}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <span
                          className={`flex items-center justify-end gap-1 font-medium ${
                            txn.paidAmount > 0
                              ? "text-[#1a7a4a]"
                              : "text-gray-400"
                          }`}
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

                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <span
                          className={`font-semibold ${
                            txn.dueAmount > 0
                              ? "text-[#c0392b]"
                              : "text-gray-500"
                          }`}
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
    </div>
  );
}
