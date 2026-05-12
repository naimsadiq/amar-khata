"use client";
import { useQueries } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import api from "@/lib/axiosInstance";

export default function TopProducts() {
  const results = useQueries({
    queries: [
      { queryKey: ["topProducts"], queryFn: async () => (await api.get("/api/dashboard/top-products")).data },
      { queryKey: ["stockAlerts"], queryFn: async () => (await api.get("/api/dashboard/stock-alerts")).data },
    ],
  });

  const [productsQuery, alertsQuery] = results;
  const isLoading = productsQuery.isLoading || alertsQuery.isLoading;
  const isError = productsQuery.isError || alertsQuery.isError;

  if (isLoading) return <Skeleton className="h-[400px] w-full rounded-xl bg-card border border-border" />;
  if (isError) return <Card className="h-[400px] flex items-center justify-center"><ErrorState message="ডেটা লোড করতে সমস্যা!" /></Card>;

  const products = productsQuery.data || [];
  const alerts = alertsQuery.data || [];
  const maxSold = Math.max(...products.map((p) => p.totalQuantitySold), 1);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-foreground">শীর্ষ পণ্য</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Top Products */}
        <div className="space-y-4">
          {products.length === 0 && <p className="text-sm text-muted-foreground">কোনো ডেটা নেই</p>}
          {products.map((product, index) => (
            <div key={product._id} className="flex items-center gap-4 text-sm">
              <span className="font-bold text-muted-foreground w-4">#{index + 1}</span>
              <div className="flex-1">
                <p className="font-medium text-foreground">{product.name}</p>
                <div className="w-full bg-muted rounded-full h-1.5 mt-1.5 overflow-hidden">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: `${(product.totalQuantitySold / maxSold) * 100}%` }}></div>
                </div>
              </div>
              <span className="font-bold text-foreground">{product.totalQuantitySold} টি</span>
            </div>
          ))}
        </div>

        <hr className="my-6 border-border" />

        {/* Stock Alerts */}
        <div>
          <h4 className="text-sm font-bold text-destructive mb-3 flex items-center gap-2">স্টক সতর্কতা ⚠️</h4>
          <div className="space-y-3">
            {alerts.length === 0 && <p className="text-sm text-muted-foreground">সব স্টক ঠিক আছে</p>}
            {alerts.map((alert) => (
              <div key={alert._id} className="flex justify-between items-center text-sm p-2 rounded-lg bg-destructive/5 border border-destructive/10">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Low</Badge>
                  <span className="font-medium text-foreground">{alert.name}</span>
                </div>
                <span className="font-bold text-destructive">মাত্র {alert.stockQuantity} টি</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}