"use client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import api from "@/lib/axiosInstance";

const formatCurrency = (value) =>
  `৳${new Intl.NumberFormat("en-IN").format(value || 0)}`;

export default function StatCards() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["dashboardSummary"],
    queryFn: async () => {
      const res = await api.get("/api/dashboard/summary");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton
            key={i}
            className="h-28 w-full rounded-xl bg-card border border-border"
          />
        ))}
      </div>
    );
  }

  if (isError)
    return (
      <ErrorState message="ডেটা লোড করতে সমস্যা হয়েছে!" onRetry={refetch} />
    );

  const stats = [
    { label: "মোট ব্যালেন্স", value: data.totalBalance, color: "text-primary" },
    {
      label: "হাতে নগদ",
      value: data.cashInHand,
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "মোট পাওনা (Customer)",
      value: data.totalReceivable,
      color: "text-amber-600 dark:text-amber-500",
    },
    {
      label: "মোট দেনা (Supplier)",
      value: data.totalPayable,
      color: "text-destructive",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {formatCurrency(stat.value)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
