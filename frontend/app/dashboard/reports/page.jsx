"use client";

import { useEffect, useState } from "react";
import ReportHeader from "../components/report/ReportHeader";
import PeriodSelector from "../components/report/PeriodSelector";
import KpiCards from "../components/report/KpiCards";
import ChartsSection from "../components/report/ChartsSection";
import TopCustomers from "../components/report/TopCustomers";
import QuickExport from "../components/report/QuickExport";


export default function ReportPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");

  // Toast Functionality
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2500);
  };

  useEffect(() => {
    // Fetch JSON Data
    const fetchReportData = async () => {
      try {
        const res = await fetch("/data/report.json");
        const jsonData = await res.json();
        setData(jsonData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch report data:", error);
        setLoading(false);
      }
    };
    fetchReportData();
  }, []);

  if (loading || !data) {
    return (
      <div className="p-6 text-center text-[#7a8aaa]">রিপোর্ট লোড হচ্ছে...</div>
    );
  }

  return (
    <div className="bg-[#f4f6fb] min-h-screen flex flex-col relative w-full overflow-hidden font-sans">
      {/* Top Header */}
      <ReportHeader date={data.headerDate} onToast={showToast} />

      {/* Main Content Body */}
      <div className="p-[20px] md:p-[24px_28px] flex-1 overflow-y-auto">
        <PeriodSelector onToast={showToast} />
        <KpiCards kpis={data.kpis} />
        <ChartsSection barData={data.barChart} donutData={data.donutChart} />

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px] mb-[22px]">
          <TopCustomers topCustomers={data.topCustomers} />
          <QuickExport summary={data.monthlySummary} onToast={showToast} />
        </div>
      </div>

      {/* Custom Floating Toast (Matches your HTML exact style) */}
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
