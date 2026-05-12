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
import { ErrorState } from "@/components/ui/error-state";
import api from "@/lib/axiosInstance";

const formatCurrency = (value) =>
  `৳${new Intl.NumberFormat("en-IN").format(value || 0)}`;

export default function WeeklySalesChart() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

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
  const isError = chartQuery.isError || dueQuery.isError;

  if (isLoading || !isMounted)
    return (
      <Skeleton className="h-[450px] w-full rounded-xl bg-card border border-border" />
    );

  if (isError)
    return (
      <Card className="col-span-1 lg:col-span-1 flex flex-col justify-center min-h-[450px]">
        <ErrorState
          message="চার্ট লোড করতে ব্যর্থ"
          onRetry={() => {
            chartQuery.refetch();
            dueQuery.refetch();
          }}
        />
      </Card>
    );

  const formattedChartData =
    chartQuery.data?.map((item) => ({
      day: new Date(item._id).toLocaleDateString("bn-BD", {
        day: "numeric",
        month: "short",
      }),
      totalSales: item.totalSales,
    })) || [];

  return (
    <Card className="col-span-1 lg:col-span-1 flex flex-col shadow-sm">
      <CardHeader>
        <CardTitle className="text-foreground">সাপ্তাহিক বিক্রয়</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* Chart */}
        <div className="w-full h-[220px] mb-6 min-w-0">
          <ResponsiveContainer width="99%" height={200} minWidth={10}>
            <BarChart
              data={formattedChartData}
              margin={{ top: 5, right: 0, left: -20, bottom: 0 }}
            >
              <XAxis
                dataKey="day"
                stroke="currentColor"
                className="text-muted-foreground text-xs"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="currentColor"
                className="text-muted-foreground text-xs"
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v / 1000}k`}
              />
              <Tooltip
                formatter={formatCurrency}
                cursor={{ fill: "var(--color-muted)", opacity: 0.4 }}
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-foreground)",
                  borderRadius: "8px",
                }}
              />
              <Bar
                dataKey="totalSales"
                fill="var(--color-primary, #0d9488)"
                name="বিক্রয়"
                radius={[4, 4, 0, 0]}
                barSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <hr className="my-2 border-border" />

        {/* Due List */}
        <div className="flex-1 mt-3">
          <h3 className="text-sm font-bold text-amber-600 dark:text-amber-500 mb-4">
            শীর্ষ বকেয়া (Customer)
          </h3>
          <div className="space-y-4">
            {dueQuery.data?.slice(0, 4).map((due) => (
              <div key={due._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-500 flex items-center justify-center font-bold text-sm border border-amber-500/20">
                    {due.name.substring(0, 1)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {due.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{due.phone}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-destructive">
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
