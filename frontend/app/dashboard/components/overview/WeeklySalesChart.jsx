"use client";
import { useState, useEffect } from "react";
import { useQueries } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axiosInstance";

const formatCurrency = (value) =>
  `৳${new Intl.NumberFormat("en-IN").format(value || 0)}`;

export default function WeeklySalesChart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const results = useQueries({
    queries: [
      {
        queryKey: ["weeklyChart"],
        queryFn: async () =>
          (await api.get("/api/dashboard/weekly-chart")).data,
      },
      {
        queryKey: ["dueList"],
        queryFn: async () => (await api.get("/api/dashboard/due-list")).data,
      },
    ],
  });

  const [chartQuery, dueQuery] = results;
  const isLoading = chartQuery.isLoading || dueQuery.isLoading;

  if (isLoading || !isMounted) return <Skeleton className="h-[450px] w-full" />;

  // API থেকে আসা ডেট ফরমেট ঠিক করা (যেমন: "2026-05-09" থেকে "May 09")
  const formattedChartData =
    chartQuery.data?.map((item) => ({
      day: new Date(item._id).toLocaleDateString("bn-BD", {
        day: "numeric",
        month: "short",
      }),
      totalSales: item.totalSales,
    })) || [];

  return (
    <Card className="col-span-1 lg:col-span-1 flex flex-col">
      <CardHeader>
        <CardTitle className="text-gray-700">সাপ্তাহিক বিক্রয়</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* Chart Section */}
        <div className="w-full h-[220px] mb-6">
          <ResponsiveContainer width="99%" height={200} minWidth={10}>
            <BarChart
              data={formattedChartData}
              margin={{ top: 5, right: 0, left: -20, bottom: 0 }}
            >
              <XAxis
                dataKey="day"
                stroke="#888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip
                formatter={formatCurrency}
                cursor={{ fill: "transparent" }}
              />
              <Bar
                dataKey="totalSales"
                fill="#16a34a"
                name="বিক্রয়"
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <hr className="my-2 border-gray-100" />

        {/* Due List Section */}
        <div className="flex-1 mt-2">
          <h3 className="text-sm font-bold text-orange-600 mb-3">
            শীর্ষ বকেয়া তালিকা (Customer)
          </h3>
          <div className="space-y-3">
            {dueQuery.data?.map((due) => (
              <div key={due._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">
                    {due.name.substring(0, 1)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {due.name}
                    </p>
                    <p className="text-xs text-gray-500">{due.phone}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-red-600">
                  {formatCurrency(due.currentDue)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
