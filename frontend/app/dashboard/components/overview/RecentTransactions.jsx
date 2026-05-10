"use client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axiosInstance";

const formatCurrency = (value) =>
  `৳${new Intl.NumberFormat("en-IN").format(value || 0)}`;

export default function RecentTransactions() {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["recentTransactions"],
    queryFn: async () => {
      const res = await api.get("/api/dashboard/recent-transactions");
      return res.data;
    },
  });

  if (isLoading) return <Skeleton className="h-[300px] w-full" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-gray-700">সাম্প্রতিক লেনদেন</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions?.map((txn) => {
            // Sale হলে টাকা আসবে (+), Purchase হলে টাকা যাবে (-)
            const isIn = txn.type === "sale";
            const colorClass = isIn ? "text-green-600" : "text-red-600";
            const bgClass = isIn
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700";
            const sign = isIn ? "+" : "-";

            return (
              <div key={txn._id} className="flex items-center">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={`font-bold ${bgClass}`}>
                    {txn.partyName ? txn.partyName.substring(0, 1) : "N"}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3 space-y-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {txn.partyName || "নগদ লেনদেন"}
                  </p>
                  <p className="text-xs text-gray-500 uppercase">{txn.type}</p>
                </div>
                <div className={`ml-auto font-bold text-sm ${colorClass}`}>
                  {sign} {formatCurrency(txn.grandTotal)}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
