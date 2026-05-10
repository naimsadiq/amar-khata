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

// মাসের নাম বাংলায়
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

export default function ReportPage() {
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2500);
  };

  // 1. Fetch Summary Data (KPIs & Monthly summary)
  const { data: summaryData, isLoading: sumLoading } = useQuery({
    queryKey: ["reportSummary"],
    queryFn: async () => {
      const res = await api.get("/api/reports/summary-cards");
      return res.data;
    },
  });

  // 2. Fetch Chart Data (Income vs Expense)
  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ["reportChart"],
    queryFn: async () => {
      const res = await api.get("/api/reports/income-expense-chart");
      return res.data;
    },
  });

  // 3. Fetch Expense Categories Data
  const { data: categoryData, isLoading: catLoading } = useQuery({
    queryKey: ["reportCategories"],
    queryFn: async () => {
      const res = await api.get("/api/reports/expense-categories");
      return res.data;
    },
  });

  // 4. Fetch Top Customers Data
  const { data: topCustomersData, isLoading: topCustLoading } = useQuery({
    queryKey: ["reportTopCustomers"],
    queryFn: async () => {
      const res = await api.get("/api/reports/top-customers");
      return res.data;
    },
  });

  // ================= DATA TRANSFORMATION =================

  // Transform KPI Data
  const kpis = useMemo(() => {
    if (!summaryData) return [];
    return [
      {
        id: 1,
        icon: "💰",
        label: "মোট আয়",
        value: `৳ ${summaryData.totalIncome?.toLocaleString() || 0}`,
        colorClass: "text-[#1a2236]",
        changeType: summaryData.incomeGrowth >= 0 ? "up" : "down",
        changeText: `${summaryData.incomeGrowth >= 0 ? "↑" : "↓"} ${Math.abs(summaryData.incomeGrowth)}% গত মাসের তুলনায়`,
      },
      {
        id: 2,
        icon: "💸",
        label: "মোট ব্যয়",
        value: `৳ ${summaryData.totalExpense?.toLocaleString() || 0}`,
        colorClass: "text-[#e53935]",
        changeType: summaryData.expenseGrowth >= 0 ? "up" : "down", // ব্যয় বাড়লে সাধারণত খারাপ, কিন্তু UI ডিজাইনের জন্য up/down দেয়া হলো
        changeText: `${summaryData.expenseGrowth >= 0 ? "↑" : "↓"} ${Math.abs(summaryData.expenseGrowth)}% গত মাসের তুলনায়`,
      },
      {
        id: 3,
        icon: "📈",
        label: "নিট মুনাফা",
        value: `৳ ${summaryData.netProfit?.toLocaleString() || 0}`,
        colorClass: "text-[#2ea86b]",
        changeType: summaryData.profitGrowth >= 0 ? "up" : "down",
        changeText: `${summaryData.profitGrowth >= 0 ? "↑" : "↓"} ${Math.abs(summaryData.profitGrowth)}% গত মাসের তুলনায়`,
      },
      {
        id: 4,
        icon: "🧾",
        label: "মোট ইনভয়েস",
        value: summaryData.totalInvoices || 0,
        colorClass: "text-[#1a2236]",
        changeType: "up", // Invoices এর জন্য ডিফল্ট আপ
        changeText: "এই মাসের মোট বিক্রয়",
      },
    ];
  }, [summaryData]);

  // Transform Bar Chart Data
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
      // চার্টে দেখানোর জন্য হাজার (k) তে কনভার্ট করা হচ্ছে (যেমন: ৫০০০ -> ৫)
      income: chartData.map((d) => Math.round((d.income || 0) / 1000)),
      expense: chartData.map((d) => Math.round((d.expense || 0) / 1000)),
      currentMonthIndex: new Date().getMonth(),
    };
  }, [chartData]);

  // Transform Donut Chart Data
  const donutChartConfig = useMemo(() => {
    if (!categoryData || categoryData.length === 0) return [];
    const totalExp = categoryData.reduce((sum, item) => sum + item.amount, 0);
    const colorMap = {
      "পণ্য ক্রয়": "#2ea86b",
      বেতন: "#3b82f6",
      "ভাড়া/বিল": "#f59e0b",
      অন্যান্য: "#f87171",
    };

    return categoryData.map((d, index) => ({
      id: index,
      label: d.category,
      pct: totalExp > 0 ? `${Math.round((d.amount / totalExp) * 100)}%` : "0%",
      color: colorMap[d.category] || "#7a8aaa",
    }));
  }, [categoryData]);

  // Transform Top Customers Data
  const formattedTopCustomers = useMemo(() => {
    if (!topCustomersData) return [];
    const maxVal = topCustomersData[0]?.totalPurchaseAmount || 1; // পার্সেন্টেজ বের করার জন্য
    const ranks = ["১", "২", "৩", "৪", "৫"];
    const bgs = [
      "bg-[#fff4e5]",
      "bg-[#f0f4ff]",
      "bg-[#ffedec]",
      "bg-[#f4f6fb]",
      "bg-[#f4f6fb]",
    ];
    const colors = [
      "text-[#f59e0b]",
      "text-[#3b82f6]",
      "text-[#f87171]",
      "text-[#7a8aaa]",
      "text-[#7a8aaa]",
    ];

    return topCustomersData.map((c, i) => ({
      id: c._id,
      rank: ranks[i] || i + 1,
      rankBg: bgs[i] || "bg-[#f4f6fb]",
      rankColor: colors[i] || "text-[#7a8aaa]",
      name: c.name,
      txn: `${c.totalTransactions}`, // কয়টি ইনভয়েস
      total: c.totalPurchaseAmount?.toLocaleString(),
      progress: (c.totalPurchaseAmount / maxVal) * 100, // প্রগ্রেস বারের জন্য
    }));
  }, [topCustomersData]);

  // Transform Monthly Summary (For QuickExport Component)
  const monthlySummary = useMemo(() => {
    if (!summaryData) return {};
    const d = new Date();
    const currMonthStr = `${fullMonthsBn[d.getMonth()]} ${d.getFullYear()}`;
    d.setMonth(d.getMonth() - 1);
    const prevMonthStr = `${fullMonthsBn[d.getMonth()]} ${d.getFullYear()}`;

    // গত মাসের ইনকাম ক্যালকুলেট করা হচ্ছে (Current / (1 + growth/100))
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

  // Header Date Setup
  const today = new Date();
  const headerDateStr = `শনিবার, ${today.getDate()} ${fullMonthsBn[today.getMonth()]}, ${today.getFullYear()}`;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f4f6fb]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2ea86b]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f6fb] min-h-screen flex flex-col relative w-full overflow-hidden font-sans">
      <ReportHeader date={headerDateStr} onToast={showToast} />

      <div className="p-[20px] md:p-[24px_28px] flex-1 overflow-y-auto">
        <PeriodSelector onToast={showToast} />
        <KpiCards kpis={kpis} />
        <ChartsSection barData={barChartConfig} donutData={donutChartConfig} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px] mb-[22px]">
          <TopCustomers topCustomers={formattedTopCustomers} />
          <QuickExport summary={monthlySummary} onToast={showToast} />
        </div>
      </div>

      {/* Floating Toast */}
      <div
        className={`fixed bottom-[24px] right-[24px] bg-[#1a2236] text-white p-[12px_20px] rounded-[10px] text-[13px] z-[999] transition-all duration-300 ${
          toastMsg
            ? "translate-y-0 opacity-100"
            : "translate-y-[60px] opacity-0 pointer-events-none"
        }`}
      >
        {toastMsg}
      </div>
    </div>
  );
}
