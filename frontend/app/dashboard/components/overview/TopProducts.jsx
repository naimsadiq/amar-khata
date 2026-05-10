"use client";
import { useQueries } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axiosInstance";

export default function TopProducts() {
  const results = useQueries({
    queries: [
      {
        queryKey: ["topProducts"],
        queryFn: async () =>
          (await api.get("/api/dashboard/top-products")).data,
      },
      {
        queryKey: ["stockAlerts"],
        queryFn: async () =>
          (await api.get("/api/dashboard/stock-alerts")).data,
      },
    ],
  });

  const [productsQuery, alertsQuery] = results;
  const isLoading = productsQuery.isLoading || alertsQuery.isLoading;

  if (isLoading) return <Skeleton className="h-[400px] w-full" />;

  const products = productsQuery.data || [];
  const alerts = alertsQuery.data || [];

  // সবচেয়ে বেশি বিক্রি হওয়া পরিমাণের সাপেক্ষে প্রগ্রেস বার বের করা
  const maxSold = Math.max(...products.map((p) => p.totalQuantitySold), 1);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-gray-700">শীর্ষ পণ্য</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.length === 0 ? (
            <p className="text-sm text-gray-500">কোনো ডেটা নেই</p>
          ) : null}
          {products.map((product, index) => (
            <div key={product._id} className="flex items-center gap-4 text-sm">
              <span className="font-bold text-gray-400">#{index + 1}</span>
              <div className="flex-1">
                <p className="font-medium text-gray-700">{product.name}</p>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
                  <div
                    className="bg-green-500 h-1.5 rounded-full"
                    style={{
                      width: `${(product.totalQuantitySold / maxSold) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <span className="font-bold text-gray-700">
                {product.totalQuantitySold} টি
              </span>
            </div>
          ))}
        </div>

        <hr className="my-6" />

        <div>
          <h4 className="text-sm font-bold text-red-500 mb-3 flex items-center gap-2">
            স্টক সতর্কতা ⚠️
          </h4>
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <p className="text-sm text-gray-500">সব স্টক ঠিক আছে</p>
            ) : null}
            {alerts.map((alert) => (
              <div
                key={alert._id}
                className="flex justify-between items-center text-sm"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="text-[10px]">
                    Low Stock
                  </Badge>
                  <span className="font-medium text-gray-700">
                    {alert.name}
                  </span>
                </div>
                <span className="font-bold text-red-600">
                  মাত্র {alert.stockQuantity} টি
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
