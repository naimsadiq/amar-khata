"use client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import api from "@/lib/axiosInstance";

const formatCurrency = (value) =>
  `৳${new Intl.NumberFormat("en-IN").format(value || 0)}`;

export default function MonthlyProfit() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["dashboardSummary"],
    queryFn: async () => (await api.get("/api/dashboard/summary")).data,
  });

  if (isLoading)
    return (
      <Skeleton className="h-[200px] w-full rounded-xl bg-card border border-border" />
    );
  if (isError)
    return (
      <Card>
        <ErrorState message="ডেটা পাওয়া যায়নি" onRetry={refetch} />
      </Card>
    );

  return (
    <Card className="shadow-sm border-primary/10 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-foreground">এই মাসের লাভ/ক্ষতি</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-muted-foreground">
            মোট আয় (Sales)
          </span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(data?.monthlyIncome)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-medium text-muted-foreground">
            মোট খরচ (Purchase)
          </span>
          <span className="font-bold text-destructive">
            {formatCurrency(data?.monthlyExpense)}
          </span>
        </div>
        <div className="flex justify-between font-bold text-base pt-4 border-t border-border">
          <span className="text-foreground">নেট লাভ</span>
          <span
            className={
              data?.netProfit >= 0 ? "text-primary" : "text-destructive"
            }
          >
            {formatCurrency(data?.netProfit)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
