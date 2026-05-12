"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axiosInstance";

import ReportHeader from "../components/report/ReportHeader";
import PeriodSelector from "../components/report/PeriodSelector";
import KpiCards from "../components/report/KpiCards";
import ChartsSection from "../components/report/ChartsSection";
import TopCustomers from "../components/report/TopCustomers";
import QuickExport from "../components/report/QuickExport";

const monthsBn = [
  "জানু",
  "ফেব্রু",
  "মার্চ",
  "এপ্রি",
  "মে",
  "জুন",
  "জুল",
  "আগ",
  "সেপ",
  "অক্টো",
  "নভে",
  "ডিসে",
];
const fullMonthsBn = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

// ───── Skeleton Components ─────
function PageSkeleton() {
  return (
    <div className="bg-background min-h-screen p-5 md:p-6 flex flex-col gap-5 animate-pulse">
      {/* Period Selector Skeleton */}
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div className="h-10 w-full lg:w-72 bg-muted rounded-lg" />
        <div className="h-10 w-48 bg-muted rounded-lg" />
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-card rounded-xl p-5 border border-border flex flex-col gap-3"
          >
            <div className="h-7 w-7 bg-muted rounded-full" />
            <div className="h-3 w-20 bg-muted rounded" />
            <div className="h-7 w-32 bg-muted rounded" />
            <div className="h-3 w-28 bg-muted rounded" />
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card rounded-xl p-5 border border-border">
          <div className="h-4 w-40 bg-muted rounded mb-4" />
          <div className="h-40 bg-muted rounded-lg" />
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="h-4 w-28 bg-muted rounded mb-4" />
          <div className="h-32 w-32 bg-muted rounded-full mx-auto mb-4" />
          <div className="flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-3 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl p-5 border border-border h-56 flex flex-col gap-3">
          <div className="h-4 w-36 bg-muted rounded" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-3 bg-muted rounded" />
          ))}
        </div>
        <div className="bg-card rounded-xl p-5 border border-border h-56 flex flex-col gap-3">
          <div className="h-4 w-36 bg-muted rounded" />
          <div className="grid grid-cols-2 gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ───── Error Banner ─────
function ErrorBanner({ message, onRetry }) {
  return (
    <div className="mx-5 md:mx-6 mt-4 flex items-start gap-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-xl p-4 text-sm">
      <span className="text-lg leading-none mt-0.5">⚠️</span>
      <div className="flex-1">
        <p className="font-semibold mb-0.5">ডেটা লোড করতে সমস্যা হয়েছে</p>
        <p className="text-destructive/70 text-xs">
          {message || "সার্ভারের সাথে সংযোগ ব্যর্থ হয়েছে।"}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="shrink-0 px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          আবার চেষ্টা করুন
        </button>
      )}
    </div>
  );
}

export default function ReportPage() {
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2500);
  };

  const {
    data: summaryData,
    isLoading: sumLoading,
    isError: sumError,
    error: sumErr,
    refetch: refetchSummary,
  } = useQuery({
    queryKey: ["reportSummary"],
    queryFn: async () => {
      const res = await api.get("/api/reports/summary-cards");
      return res.data;
    },
  });

  const {
    data: chartData,
    isLoading: chartLoading,
    isError: chartError,
    error: chartErr,
    refetch: refetchChart,
  } = useQuery({
    queryKey: ["reportChart"],
    queryFn: async () => {
      const res = await api.get("/api/reports/income-expense-chart");
      return res.data;
    },
  });

  const {
    data: categoryData,
    isLoading: catLoading,
    isError: catError,
    error: catErr,
    refetch: refetchCat,
  } = useQuery({
    queryKey: ["reportCategories"],
    queryFn: async () => {
      const res = await api.get("/api/reports/expense-categories");
      return res.data;
    },
  });

  const {
    data: topCustomersData,
    isLoading: topCustLoading,
    isError: topCustError,
    error: topCustErr,
    refetch: refetchTopCust,
  } = useQuery({
    queryKey: ["reportTopCustomers"],
    queryFn: async () => {
      const res = await api.get("/api/reports/top-customers");
      return res.data;
    },
  });

  // ─── Data Transformation (unchanged) ───
  const kpis = useMemo(() => {
    if (!summaryData) return [];
    return [
      {
        id: 1,
        icon: "💰",
        label: "মোট আয়",
        value: `৳ ${summaryData.totalIncome?.toLocaleString() || 0}`,
        colorClass: "text-foreground",
        changeType: summaryData.incomeGrowth >= 0 ? "up" : "down",
        changeText: `${summaryData.incomeGrowth >= 0 ? "↑" : "↓"} ${Math.abs(summaryData.incomeGrowth)}% গত মাসের তুলনায়`,
      },
      {
        id: 2,
        icon: "💸",
        label: "মোট ব্যয়",
        value: `৳ ${summaryData.totalExpense?.toLocaleString() || 0}`,
        colorClass: "text-destructive",
        changeType: summaryData.expenseGrowth >= 0 ? "up" : "down",
        changeText: `${summaryData.expenseGrowth >= 0 ? "↑" : "↓"} ${Math.abs(summaryData.expenseGrowth)}% গত মাসের তুলনায়`,
      },
      {
        id: 3,
        icon: "📈",
        label: "নিট মুনাফা",
        value: `৳ ${summaryData.netProfit?.toLocaleString() || 0}`,
        colorClass: "text-primary",
        changeType: summaryData.profitGrowth >= 0 ? "up" : "down",
        changeText: `${summaryData.profitGrowth >= 0 ? "↑" : "↓"} ${Math.abs(summaryData.profitGrowth)}% গত মাসের তুলনায়`,
      },
      {
        id: 4,
        icon: "🧾",
        label: "মোট ইনভয়েস",
        value: summaryData.totalInvoices || 0,
        colorClass: "text-foreground",
        changeType: "up",
        changeText: "এই মাসের মোট বিক্রয়",
      },
    ];
  }, [summaryData]);

  const barChartConfig = useMemo(() => {
    if (!chartData)
      return {
        months: monthsBn,
        income: [],
        expense: [],
        currentMonthIndex: 0,
      };
    return {
      months: monthsBn,
      income: chartData.map((d) => Math.round((d.income || 0) / 1000)),
      expense: chartData.map((d) => Math.round((d.expense || 0) / 1000)),
      currentMonthIndex: new Date().getMonth(),
    };
  }, [chartData]);

  const donutChartConfig = useMemo(() => {
    if (!categoryData || categoryData.length === 0) return [];
    const totalExp = categoryData.reduce((sum, item) => sum + item.amount, 0);
    const colorMap = {
      "পণ্য ক্রয়": "#2ea86b",
      বেতন: "#3b82f6",
      "ভাড়া/বিল": "#f59e0b",
      অন্যান্য: "#f87171",
    };
    return categoryData.map((d, index) => ({
      id: index,
      label: d.category,
      pct: totalExp > 0 ? `${Math.round((d.amount / totalExp) * 100)}%` : "0%",
      color: colorMap[d.category] || "#7a8aaa",
    }));
  }, [categoryData]);

  const formattedTopCustomers = useMemo(() => {
    if (!topCustomersData) return [];
    const maxVal = topCustomersData[0]?.totalPurchaseAmount || 1;
    const ranks = ["১", "২", "৩", "৪", "৫"];
    const bgs = [
      "bg-amber-l",
      "bg-blue-50",
      "bg-red-l",
      "bg-muted",
      "bg-muted",
    ];
    const colors = [
      "text-amber",
      "text-blue-500",
      "text-red",
      "text-muted-foreground",
      "text-muted-foreground",
    ];
    return topCustomersData.map((c, i) => ({
      id: c._id,
      rank: ranks[i] || i + 1,
      rankBg: bgs[i] || "bg-muted",
      rankColor: colors[i] || "text-muted-foreground",
      name: c.name,
      txn: `${c.totalTransactions}`,
      total: c.totalPurchaseAmount?.toLocaleString(),
      progress: (c.totalPurchaseAmount / maxVal) * 100,
    }));
  }, [topCustomersData]);

  const monthlySummary = useMemo(() => {
    if (!summaryData) return {};
    const d = new Date();
    const currMonthStr = `${fullMonthsBn[d.getMonth()]} ${d.getFullYear()}`;
    d.setMonth(d.getMonth() - 1);
    const prevMonthStr = `${fullMonthsBn[d.getMonth()]} ${d.getFullYear()}`;
    const prevTotalIncome =
      summaryData.totalIncome / (1 + summaryData.incomeGrowth / 100);
    return {
      currMonth: currMonthStr,
      currTotal: `৳ ${summaryData.totalIncome?.toLocaleString() || 0}`,
      prevMonth: prevMonthStr,
      prevTotal: `৳ ${Math.round(prevTotalIncome || 0).toLocaleString()}`,
      growth: `${summaryData.incomeGrowth >= 0 ? "+" : ""}${summaryData.incomeGrowth}%`,
    };
  }, [summaryData]);

  const isLoading = sumLoading || chartLoading || catLoading || topCustLoading;

  const today = new Date();
  const headerDateStr = `শনিবার, ${today.getDate()} ${fullMonthsBn[today.getMonth()]}, ${today.getFullYear()}`;

  // Collect any errors
  const errors = [
    sumError && { msg: sumErr?.message, retry: refetchSummary },
    chartError && { msg: chartErr?.message, retry: refetchChart },
    catError && { msg: catErr?.message, retry: refetchCat },
    topCustError && { msg: topCustErr?.message, retry: refetchTopCust },
  ].filter(Boolean);

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="bg-background min-h-screen flex flex-col relative w-full overflow-hidden font-sans">
      {/* Error Banners */}
      {errors.map((err, i) => (
        <ErrorBanner key={i} message={err.msg} onRetry={err.retry} />
      ))}

      <div className="p-5 md:p-6 flex-1 overflow-y-auto">
        <PeriodSelector onToast={showToast} />
        <KpiCards kpis={kpis} />
        <ChartsSection barData={barChartConfig} donutData={donutChartConfig} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <TopCustomers topCustomers={formattedTopCustomers} />
          <QuickExport summary={monthlySummary} onToast={showToast} />
        </div>
      </div>

      {/* Floating Toast */}
      <div
        className={`fixed bottom-6 right-6 bg-foreground text-background px-5 py-3 rounded-xl text-[13px] z-[999] shadow-lg transition-all duration-300 ${
          toastMsg
            ? "translate-y-0 opacity-100"
            : "translate-y-16 opacity-0 pointer-events-none"
        }`}
      >
        {toastMsg}
      </div>
    </div>
  );
}
