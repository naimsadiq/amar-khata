"use client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axiosInstance";

const formatCurrency = (value) =>
  `৳${new Intl.NumberFormat("en-IN").format(value || 0)}`;

export default function MonthlyProfit() {
  // আগের ক্যাশ করা ডেটাই ব্যবহার করবে
  const { data, isLoading } = useQuery({
    queryKey: ["dashboardSummary"],
    queryFn: async () => {
      const res = await api.get("/api/dashboard/summary");
      return res.data;
    },
  });

  if (isLoading) return <Skeleton className="h-40 w-full" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-gray-700">এই মাসের লাভ/ক্ষতি</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="font-medium">মোট আয় (Sales)</span>
          <span className="font-bold text-green-600">
            {formatCurrency(data?.monthlyIncome)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-medium">মোট খরচ (Purchase)</span>
          <span className="font-bold text-red-600">
            {formatCurrency(data?.monthlyExpense)}
          </span>
        </div>
        <div className="flex justify-between font-bold text-base pt-3 border-t">
          <span>নেট লাভ</span>
          <span
            className={data?.netProfit >= 0 ? "text-green-600" : "text-red-600"}
          >
            {formatCurrency(data?.netProfit)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
