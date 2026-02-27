"use client";
import React from "react";
import { LayoutProvider } from "@/context/LayoutContext";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

export default function AppLayout({ children }) {
  return (
    <LayoutProvider>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
        <div className="w-full max-w-[480px] bg-white h-[100dvh] shadow-2xl relative flex flex-col overflow-hidden sm:rounded-2xl sm:h-[90vh]">
          <Sidebar />

          <div className="flex-1 overflow-y-auto pb-16 relative bg-white flex flex-col scrollbar-hide">
            {children}
          </div>

          <BottomNav />
        </div>
      </div>
    </LayoutProvider>
  );
}
