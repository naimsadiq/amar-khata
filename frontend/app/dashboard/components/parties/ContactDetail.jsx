import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ReceiptText, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { useRouter } from "next/navigation";

// Helpers
const getInitials = (name) => (name ? name.substring(0, 2).toUpperCase() : "U");
const formatDate = (isoString) =>
  isoString
    ? new Date(isoString).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";
const formatDateTime = (isoString) =>
  isoString
    ? new Date(isoString).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "-";

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

  const totalTxns = validTxns.length;
  const totalBilled = validTxns.reduce(
    (sum, txn) => sum + (Number(txn.grandTotal) || 0),
    0,
  );
  const totalPaid = validTxns.reduce(
    (sum, txn) => sum + (Number(txn.paidAmount) || 0),
    0,
  );
  const lastTxnDate =
    totalTxns > 0
      ? formatDate(validTxns[0].date || validTxns[0].createdAt)
      : formatDate(contact.updatedAt);

  const dueAmount = contact.currentDue ?? contact.openingBalance ?? 0;
  const absDue = Math.abs(dueAmount).toLocaleString("en-IN");

  const amtColor =
    dueAmount > 0
      ? "text-primary"
      : dueAmount < 0
        ? "text-destructive"
        : "text-muted-foreground";
  const amtLabel =
    dueAmount > 0 ? "মোট পাওনা" : dueAmount < 0 ? "মোট দেনা" : "ব্যালেন্স";

  return (
    <div className="bg-card border border-border shadow-sm rounded-2xl overflow-hidden">
      {/* 1. Profile Header */}
      <div className="bg-primary/5 p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-4 border-b border-border">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold shrink-0 ${isCustomer ? "bg-blue-500/10 text-blue-600" : "bg-amber-500/10 text-amber-600"}`}
          >
            {getInitials(contact.name)}
          </div>
          <div className="flex-1 sm:hidden">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-semibold text-foreground">
                {contact.name || "নাম নেই"}
              </span>
              <Badge variant="secondary" className="text-[10px]">
                {isCustomer ? "গ্রাহক" : "সাপ্লায়ার"}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              {contact.phone || "নম্বর নেই"}
            </div>
          </div>
        </div>

        <div className="hidden sm:block flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-semibold text-foreground">
              {contact.name || "নাম নেই"}
            </span>
            <Badge variant="secondary" className="text-[10px]">
              {isCustomer ? "গ্রাহক" : "সাপ্লায়ার"}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {contact.phone || "নম্বর নেই"} <span className="mx-1">|</span>{" "}
            {contact.address || "ঠিকানা নেই"}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-1 sm:mt-0">
          <Button
            className="flex-1 sm:flex-none"
            variant="outline"
            size="sm"
            onClick={() =>
              router.push(
                isCustomer ? "/dashboard/pos" : "/dashboard/inventory",
              )
            }
          >
            নতুন লেনদেন
          </Button>
          <Button className="flex-1 sm:flex-none" size="sm">
            {dueAmount >= 0 ? "টাকা নিন" : "টাকা দিন"}
          </Button>
        </div>
      </div>

      {/* 2. Stats Summary */}
      <div className="p-4 md:p-5 border-b border-border bg-card">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-muted/50 border border-border rounded-xl p-3 md:p-4">
            <div className="text-[11px] md:text-xs text-muted-foreground mb-1 font-medium">
              {amtLabel}
            </div>
            <div className={`text-lg md:text-xl font-bold ${amtColor}`}>
              ৳ {absDue}
            </div>
          </div>
          <div className="bg-muted/50 border border-border rounded-xl p-3 md:p-4">
            <div className="text-[11px] md:text-xs text-muted-foreground mb-1 font-medium">
              মোট বিল / ক্রয়
            </div>
            <div className="text-md md:text-lg font-bold text-foreground">
              ৳ {totalBilled.toLocaleString("en-IN")}
            </div>
          </div>
          <div className="bg-muted/50 border border-border rounded-xl p-3 md:p-4">
            <div className="text-[11px] md:text-xs text-muted-foreground mb-1 font-medium">
              মোট জমা / পরিশোধ
            </div>
            <div className="text-md md:text-lg font-bold text-primary">
              ৳ {totalPaid.toLocaleString("en-IN")}
            </div>
          </div>
          <div className="bg-muted/50 border border-border rounded-xl p-3 md:p-4">
            <div className="text-[11px] md:text-xs text-muted-foreground mb-1 font-medium">
              লেনদেন (শেষ: {lastTxnDate})
            </div>
            <div className="text-md md:text-lg font-bold text-foreground">
              {totalTxns.toLocaleString("en-IN")} টি
            </div>
          </div>
        </div>
      </div>

      {/* 3. Transaction Details */}
      <div>
        <div className="p-4 md:px-5 flex items-center gap-2 bg-muted/30 border-b border-border">
          <ReceiptText className="w-5 h-5 text-primary" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            লেনদেনের বিবরণী
          </h2>
        </div>

        {/* --- DESKTOP VIEW (TABLE) --- */}
        <div className="hidden md:block w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground text-[13px] border-b border-border">
                <th className="py-3 px-5 font-medium whitespace-nowrap">
                  তারিখ ও সময়
                </th>
                <th className="py-3 px-5 font-medium whitespace-nowrap">
                  বিবরণ / ইনভয়েস
                </th>
                <th className="py-3 px-5 font-medium text-right">মোট বিল</th>
                <th className="py-3 px-5 font-medium text-right">
                  জমা / পরিশোধ
                </th>
                <th className="py-3 px-5 font-medium text-right">বাকি</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {isTxnLoading ? (
                <tr>
                  <td colSpan="5" className="p-5">
                    <Skeleton className="h-32 w-full bg-card" />
                  </td>
                </tr>
              ) : isTxnError ? (
                <tr>
                  <td
                    colSpan="5"
                    className="py-10 text-center text-destructive"
                  >
                    লেনদেন লোড করতে সমস্যা হয়েছে।
                  </td>
                </tr>
              ) : validTxns.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="py-12 text-center text-muted-foreground"
                  >
                    কোনো লেনদেন নেই
                  </td>
                </tr>
              ) : (
                validTxns.map((txn) => {
                  const isSale = txn.type === "sale";
                  return (
                    <tr
                      key={txn._id}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-4 px-5 text-muted-foreground text-[13px]">
                        {formatDateTime(txn.date || txn.createdAt)}
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            {txn.invoiceNo}
                          </span>
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0"
                          >
                            {isSale ? "বিক্রয়" : "ক্রয়"}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right font-medium">
                        ৳ {Number(txn.grandTotal).toLocaleString("en-IN")}
                      </td>
                      <td className="py-4 px-5 text-right font-medium text-primary">
                        {txn.paidAmount > 0 && (
                          <span>
                            {isSale ? (
                              <ArrowDownToLine className="w-3 h-3 inline mr-1" />
                            ) : (
                              <ArrowUpFromLine className="w-3 h-3 inline mr-1" />
                            )}
                          </span>
                        )}
                        ৳ {Number(txn.paidAmount).toLocaleString("en-IN")}
                      </td>
                      <td className="py-4 px-5 text-right font-semibold text-destructive">
                        ৳ {Number(txn.dueAmount).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* --- MOBILE VIEW (CARDS) --- */}
        <div className="block md:hidden flex flex-col divide-y divide-border">
          {isTxnLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-24 w-full rounded-xl bg-muted/50"
                />
              ))}
            </div>
          ) : isTxnError ? (
            <div className="py-10 text-center text-destructive text-sm">
              লেনদেন লোড করতে সমস্যা হয়েছে।
            </div>
          ) : validTxns.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm flex flex-col items-center">
              <ReceiptText className="w-8 h-8 mb-2 opacity-20" />
              কোনো লেনদেন নেই
            </div>
          ) : (
            validTxns.map((txn) => {
              const isSale = txn.type === "sale";
              return (
                <div
                  key={txn._id}
                  className="p-4 flex flex-col gap-3 hover:bg-muted/30 transition-colors bg-card"
                >
                  {/* Header: Date + Invoice */}
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium text-foreground">
                        {txn.invoiceNo}
                      </span>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {formatDateTime(txn.date || txn.createdAt)}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0"
                    >
                      {isSale ? "বিক্রয়" : "ক্রয়"}
                    </Badge>
                  </div>

                  {/* Stats Grid for Mobile */}
                  <div className="grid grid-cols-3 gap-2 text-sm bg-muted/30 p-2.5 rounded-lg">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                        মোট বিল
                      </p>
                      <p className="font-medium text-foreground">
                        ৳ {Number(txn.grandTotal).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="text-center border-x border-border/50 px-1">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                        জমা
                      </p>
                      <p className="font-medium text-primary flex items-center justify-center gap-1">
                        {txn.paidAmount > 0 &&
                          (isSale ? (
                            <ArrowDownToLine className="w-3 h-3" />
                          ) : (
                            <ArrowUpFromLine className="w-3 h-3" />
                          ))}
                        {Number(txn.paidAmount).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                        বাকি
                      </p>
                      <p className="font-semibold text-destructive">
                        ৳ {Number(txn.dueAmount).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
