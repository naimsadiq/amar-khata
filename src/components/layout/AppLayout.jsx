"use client";
import React from "react";
import { LayoutProvider } from "@/context/LayoutContext";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

export default function AppLayout({ children }) {
  return (
    <LayoutProvider>
      {/* ডেস্কটপ বা বড় স্ক্রিনের জন্য ব্যাকগ্রাউন্ড */}
      <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
        {/* মোবাইল ফ্রেম কন্টেইনার (ল্যাপটপে মোবাইলের মত দেখাবে, মোবাইলে ফুল স্ক্রিন) */}
        <div className="w-full max-w-[480px] bg-white h-[100dvh] shadow-2xl relative flex flex-col overflow-hidden sm:rounded-2xl sm:h-[90vh]">
          {/* সাইডবার (Drawer) */}
          <Sidebar />

          {/* মূল কন্টেন্ট এরিয়া (এখানে আপনার পেজগুলো লোড হবে) */}
          {/* pb-16 দেওয়া হয়েছে যেন নিচের মেনুর জন্য জায়গা খালি থাকে */}
          <div className="flex-1 overflow-y-auto pb-16 relative bg-white flex flex-col scrollbar-hide">
            {children}
          </div>

          {/* নিচের ন্যাভিগেশন বার */}
          <BottomNav />
        </div>
      </div>
    </LayoutProvider>
  );
}
