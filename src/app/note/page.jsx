"use client";
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { History, Search, Plus } from "lucide-react";

export default function NotePage() {
  return (
    <AppLayout>
      {/* Top Header */}
      <div className="bg-[#10b981] px-4 py-4 flex items-center justify-between text-white sticky top-0 z-10 shadow-sm">
        <h1 className="text-lg font-medium">Note</h1>
        <button className="hover:bg-white/10 p-1.5 rounded-full transition-colors">
          <History className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 flex flex-col h-full">
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search notes by title, date, amount"
            className="w-full bg-[#f8f9fa] border border-transparent rounded-xl py-3 pl-10 pr-4 text-[14px] outline-none focus:border-[#10b981] focus:bg-white transition-all"
          />
        </div>

        {/* Title */}
        <h2 className="text-gray-800 text-[16px] font-medium mb-10">
          My Notes
        </h2>

        {/* Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center text-center mt-10">
          <p className="text-gray-400 text-[14px] mb-1">
            No incomplete notes found.
          </p>
          <p className="text-gray-400 text-[14px]">
            Tap the + button to add a new note.
          </p>
        </div>
      </div>

      {/* Floating Action Button (Square shape with rounded corners like image) */}
      <button className="absolute bottom-20 right-5 bg-[#10b981] text-white p-4 rounded-2xl shadow-lg hover:bg-[#0e9f6e] hover:-translate-y-1 transition-all active:scale-95 z-20">
        <Plus className="w-7 h-7" />
      </button>
    </AppLayout>
  );
}
