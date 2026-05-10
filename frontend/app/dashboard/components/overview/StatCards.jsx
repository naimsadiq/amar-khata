"use client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axiosInstance";

const formatCurrency = (value) =>
  `৳${new Intl.NumberFormat("en-IN").format(value || 0)}`;

export default function StatCards() {
  const { data, isLoading, isError } = useQuery({
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
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError)
    return <div className="text-red-500">ডেটা লোড করতে সমস্যা হয়েছে!</div>;

  const stats = [
    {
      label: "মোট ব্যালেন্স",
      value: formatCurrency(data.totalBalance),
      color: "text-blue-600",
    },
    {
      label: "হাতে নগদ",
      value: formatCurrency(data.cashInHand),
      color: "text-green-600",
    },
    {
      label: "মোট পাওনা (Customer)",
      value: formatCurrency(data.totalReceivable),
      color: "text-orange-600",
    },
    {
      label: "মোট দেনা (Supplier)",
      value: formatCurrency(data.totalPayable),
      color: "text-red-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              {stat.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
