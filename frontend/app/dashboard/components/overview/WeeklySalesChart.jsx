"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function WeeklySalesChart({ salesData, dueData }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // DOM লেআউট পুরোপুরি রেডি হওয়ার জন্য ৫০ মিলিসেকেন্ড সময় দেওয়া হলো
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (value) =>
    `৳${new Intl.NumberFormat("en-IN").format(value)}`;

  const getRiskColor = (level) => {
    switch (level) {
      case "high": return "text-red-600 bg-red-50";
      case "medium": return "text-orange-600 bg-orange-50";
      case "low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getRiskLabel = (level) => {
    if (level === "high") return "উচ্চ ঝুঁকি";
    if (level === "medium") return "মাঝারি";
    return "স্বল্প ঝুঁকি";
  };

  return (
    <Card className="col-span-1 lg:col-span-1">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>সাপ্তাহিক বিক্রয় ও বকেয়া</CardTitle>
          <a href="#" className="text-sm text-blue-600 hover:underline">
            বিস্তারিত →
          </a>
        </div>
      </CardHeader>
      <CardContent>
        {/* চার্ট কন্টেইনার */}
        <div className="w-full h-[200px] mb-6 relative">
          {!isMounted ? (
            // একটি সুন্দর অ্যানিমেটেড স্কেলেটন (Skeleton) লোডার
            <div className="w-full h-full flex items-end justify-between px-2 pb-6 space-x-2 animate-pulse">
              {[40, 70, 45, 90, 60, 30, 80].map((h, i) => (
                <div
                  key={i}
                  className="w-full bg-gray-200 rounded-t dark:bg-gray-700"
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
          ) : (
            // width 99% এবং height 200 দেওয়া হয়েছে (Recharts এর গ্রিড বাগ ফিক্স করতে)
            <ResponsiveContainer width="99%" height={200} minWidth={10}>
              <BarChart
                data={salesData?.chartData || []}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <XAxis
                  dataKey="day"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `৳${value / 1000}k`}
                />
                <Tooltip formatter={formatCurrency} />
                <Bar
                  dataKey="lastWeek"
                  fill="#d1d5db"
                  name="গত সপ্তাহ"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="thisWeek"
                  fill="#16a34a"
                  name="এই সপ্তাহ"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* বকেয়া পাওনা সেকশন */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">
            বকেয়া পাওনা তালিকা
          </h3>
          <div className="overflow-y-auto pr-2">
            {dueData?.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                    {item.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.daysOverdue} দিন অতিবাহিত
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    {item.amount}
                  </p>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getRiskColor(
                      item.riskLevel
                    )}`}
                  >
                    {getRiskLabel(item.riskLevel)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}