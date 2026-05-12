"use client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import api from "@/lib/axiosInstance";

const formatCurrency = (value) =>
  `৳${new Intl.NumberFormat("en-IN").format(value || 0)}`;

export default function RecentTransactions() {
  const {
    data: transactions,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["recentTransactions"],
    queryFn: async () => {
      const res = await api.get("/api/dashboard/recent-transactions");
      return res.data;
    },
  });

  if (isLoading)
    return (
      <Skeleton className="h-[350px] w-full rounded-xl bg-card border border-border" />
    );
  if (isError)
    return (
      <Card>
        <ErrorState message="লেনদেন লোড হয়নি" onRetry={refetch} />
      </Card>
    );

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-foreground">সাম্প্রতিক লেনদেন</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions?.length === 0 && (
            <p className="text-sm text-muted-foreground">কোনো লেনদেন নেই</p>
          )}
          {transactions?.map((txn) => {
            const isIn = txn.type === "sale";
            const colorClass = isIn
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-destructive";
            const bgClass = isIn
              ? "bg-emerald-500/10 text-emerald-600"
              : "bg-destructive/10 text-destructive";
            const sign = isIn ? "+" : "-";

            return (
              <div
                key={txn._id}
                className="flex items-center p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarFallback className={`font-bold ${bgClass}`}>
                    {txn.partyName ? txn.partyName.substring(0, 1) : "N"}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3 space-y-0.5">
                  <p className="text-sm font-semibold text-foreground">
                    {txn.partyName || "নগদ লেনদেন"}
                  </p>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    {txn.type}
                  </p>
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
