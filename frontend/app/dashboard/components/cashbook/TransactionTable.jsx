import { useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function TransactionTable({ transactions }) {
  const [search, setSearch] = useState("");

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const filteredData = transactions
    ?.filter(
      (item) =>
        item.category?.toLowerCase().includes(search.toLowerCase()) ||
        item.note?.toLowerCase().includes(search.toLowerCase()) ||
        item.partyName?.toLowerCase().includes(search.toLowerCase()) ||
        item.partyPhone?.includes(search),
    )
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      {/* Search Header */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3 justify-between sm:items-center bg-muted/30">
        <span className="font-semibold text-foreground">লেনদেনের তালিকা</span>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="নাম, নম্বর বা বিবরণ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 bg-background border-border"
          />
        </div>
      </div>

      {/* --- DESKTOP VIEW (TABLE) --- */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="py-3 px-5 text-xs font-medium text-muted-foreground whitespace-nowrap">
                তারিখ
              </th>
              <th className="py-3 px-5 text-xs font-medium text-muted-foreground whitespace-nowrap">
                বিবরণ
              </th>
              <th className="py-3 px-5 text-xs font-medium text-muted-foreground whitespace-nowrap">
                পার্টি ইনফো
              </th>
              <th className="py-3 px-5 text-xs font-medium text-muted-foreground whitespace-nowrap">
                ধরন
              </th>
              <th className="py-3 px-5 text-xs font-medium text-right text-muted-foreground whitespace-nowrap">
                পরিমাণ
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData?.length > 0 ? (
              filteredData.map((row) => (
                <tr
                  key={row._id}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="py-4 px-5 text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(row.date)}
                  </td>
                  <td className="py-4 px-5 text-sm">
                    <div className="font-semibold text-foreground">
                      {row.category.replace(/_/g, " ")}
                    </div>
                    {row.note && (
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {row.note}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-5 text-sm">
                    {row.partyName ? (
                      <div>
                        <div className="font-medium text-foreground">
                          {row.partyName}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {row.partyPhone}
                        </div>
                      </div>
                    ) : (
                      <span className="text-[11px] text-muted-foreground italic">
                        সাধারণ লেনদেন
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-sm">
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-2 py-0 h-5 border-none ${row.transactionType === "IN" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-destructive/10 text-destructive"}`}
                    >
                      {row.transactionType === "IN" ? "আয়" : "ব্যয়"}
                    </Badge>
                  </td>
                  <td
                    className={`py-4 px-5 font-bold text-right whitespace-nowrap ${row.transactionType === "IN" ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}
                  >
                    ৳ {row.amount.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-muted-foreground text-sm"
                >
                  কোনো লেনদেন পাওয়া যায়নি
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- MOBILE VIEW (CARDS) --- */}
      <div className="block md:hidden flex flex-col divide-y divide-border">
        {filteredData?.length > 0 ? (
          filteredData.map((row) => {
            const isIn = row.transactionType === "IN";
            return (
              <div
                key={row._id}
                className="p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold text-foreground text-sm">
                      {row.category.replace(/_/g, " ")}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {formatDate(row.date)}
                    </div>
                  </div>
                  <div
                    className={`font-bold text-lg flex items-center gap-1 ${isIn ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}
                  >
                    {isIn ? (
                      <ArrowDownToLine className="w-4 h-4" />
                    ) : (
                      <ArrowUpFromLine className="w-4 h-4" />
                    )}
                    ৳ {row.amount.toLocaleString("en-IN")}
                  </div>
                </div>

                <div className="flex justify-between items-end mt-3">
                  <div>
                    {row.partyName ? (
                      <div>
                        <div className="text-xs font-medium text-foreground">
                          {row.partyName}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {row.partyPhone}
                        </div>
                      </div>
                    ) : (
                      <span className="text-[11px] text-muted-foreground italic">
                        সাধারণ লেনদেন
                      </span>
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-2 py-0 border-none ${isIn ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive"}`}
                  >
                    {isIn ? "আয়" : "ব্যয়"}
                  </Badge>
                </div>

                {row.note && (
                  <div className="mt-3 p-2 bg-muted/50 rounded-md text-[11px] text-muted-foreground italic">
                    "{row.note}"
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center text-muted-foreground text-sm">
            কোনো লেনদেন পাওয়া যায়নি
          </div>
        )}
      </div>
    </div>
  );
}
