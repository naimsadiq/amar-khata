"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: "সোম", total: 8400 },
  { name: "মঙ্গল", total: 6800 },
  { name: "বুধ", total: 10500 },
  { name: "বৃহ", total: 7500 },
  { name: "শুক্র", total: 5280 },
  { name: "শনি", total: 9200 },
  { name: "রবি", total: 4500 },
];

export function SalesChart() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>এই সপ্তাহের বিক্রয়</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
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
              contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}
              labelStyle={{ color: 'var(--foreground)' }}
              formatter={(value) => [`৳${value.toLocaleString('bn-BD')}`, 'বিক্রয়']}
            />
            <Bar dataKey="total" fill="var(--color-brand)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}