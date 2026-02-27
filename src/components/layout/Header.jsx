"use client";
import React from "react";
import { Menu, ChevronDown } from "lucide-react";
import { useLayout } from "@/context/LayoutContext";
import { useAuth } from "@/context/AuthContext"; // AuthContext ইমপোর্ট করা হলো

export default function Header() {
  const { setIsSidebarOpen } = useLayout();
  const { user } = useAuth(); // ইউজার ডাটা আনা হলো

  return (
    <header className="bg-[#10b981] px-4 py-3 flex items-center gap-4 shadow-sm z-10 sticky top-0">
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="text-white hover:bg-white/10 p-1.5 rounded-md transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Business Name Dropdown */}
      <button className="bg-white/20 hover:bg-white/30 text-white flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors max-w-[200px]">
        {/* ডাইনামিক বিজনেস নেম অথবা ইউজার নেম */}
        <span className="font-medium text-[15px] truncate">
          {user?.businessName || user?.name || "My Business"}
        </span>
        <ChevronDown className="w-4 h-4 shrink-0" />
      </button>
    </header>
  );
}
