// components/SalesAndDuesCard.js

"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SalesAndDuesCard({ salesData, duesData }) {
  const formatCurrency = (value) =>
    `৳${new Intl.NumberFormat("en-IN").format(value)}`;

  const getRiskColor = (level) => {
    switch (level) {
      case "high":
        return "text-red-600 font-semibold";
      case "medium":
        return "text-amber-600";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card className="col-span-1 lg:col-span-1">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>সাপ্তাহিক বিক্রয় ও বকেয়া</CardTitle>
          <a href="#" className="text-sm text-blue-600 hover:underline">
            বিস্তারিত রিপোর্ট →
          </a>
        </div>
      </CardHeader>
      <CardContent>
        {/* Weekly Sales Chart Section */}
        <div style={{ height: "220px" }}>
          {" "}
          {/* চার্টের জন্য নির্দিষ্ট উচ্চতা */}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={salesData.chartData}
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
              <Tooltip
                formatter={formatCurrency}
                contentStyle={{
                  borderRadius: "0.5rem",
                  borderColor: "#e5e7eb",
                }}
              />
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
        </div>

        {/* Divider */}
        <hr className="my-4 border-t border-gray-200" />

        {/* Due Receivables List Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-md font-semibold text-gray-800">
              শীর্ষ বকেয়া তালিকা
            </h3>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              সব দেখুন
            </a>
          </div>
          <div className="space-y-3">
            {duesData.slice(0, 3).map(
              (
                item,
                index, // Show top 3 for brevity
              ) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center font-bold">
                      {item.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-800">
                        {item.name}
                      </p>
                      <p className={`text-xs ${getRiskColor(item.riskLevel)}`}>
                        {item.daysOverdue} দিন বকেয়া
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-900">{item.amount}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
