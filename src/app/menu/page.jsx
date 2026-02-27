"use client";
import React from "react";
import Image from "next/image";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import {
  Edit,
  Building2,
  Phone,
  Settings,
  ChevronDown,
  Info,
  LogOut,
} from "lucide-react";

export default function MenuPage() {
  const { user, logout } = useAuth();

  return (
    <AppLayout>
      {/* Top Header */}
      <div className="bg-[#10b981] px-4 py-4 text-white sticky top-0 z-10">
        <h1 className="text-lg font-medium">Menu</h1>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Profile Card */}
        <div className="border border-gray-100 rounded-2xl shadow-sm overflow-hidden bg-white">
          {/* Top Green Section */}
          <div className="bg-gradient-to-br from-[#10b981] to-[#047857] p-5 flex items-start justify-between text-white">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                <Image
                  src="/image/amar-khata.webp"
                  alt="Amar Khata Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>

              {/* Name & Badge (Dynamic Data) */}
              <div className="flex flex-col items-start gap-1">
                <h2 className="text-xl font-semibold">
                  {user?.name || "Guest User"}
                </h2>
                <span className="bg-white/20 px-3 py-1 rounded-full text-[11px] backdrop-blur-sm">
                  Not Verified
                </span>
              </div>
            </div>

            {/* Edit Icon */}
            <button className="hover:bg-white/20 p-1.5 rounded-lg transition-colors">
              <Edit className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Info Section */}
          <div className="p-5 flex flex-col gap-5">
            {/* Business Info (Dynamic Data) */}
            <div className="flex items-center gap-4">
              <div className="bg-[#f0fdf4] p-2.5 rounded-xl text-[#10b981]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[12px] text-gray-400 font-medium">
                  Business
                </p>

                <p className="text-[15px] text-gray-800 font-medium">
                  {user?.businessName || "No Business Added"}
                </p>
              </div>
            </div>

            {/* Phone Info (Dynamic Data) */}
            <div className="flex items-center gap-4">
              <div className="bg-[#f0fdf4] p-2.5 rounded-xl text-[#10b981]">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[12px] text-gray-400 font-medium">Phone</p>

                <p className="text-[15px] text-gray-800 font-medium">
                  {user?.phone || "No Phone Number"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Options List */}

        {/* Settings */}
        <button className="w-full border border-gray-100 rounded-xl p-4 flex items-center justify-between bg-white shadow-sm hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3 text-gray-700">
            <Settings className="w-5 h-5 text-[#10b981]" strokeWidth={1.5} />
            <span className="text-[16px]">Settings</span>
          </div>
          <ChevronDown className="w-5 h-5 text-[#10b981]" />
        </button>

        {/* About */}
        <button className="w-full border border-gray-100 rounded-xl p-4 flex items-center justify-start gap-3 bg-white shadow-sm hover:bg-gray-50 transition-colors">
          <Info className="w-5 h-5 text-[#10b981]" strokeWidth={1.5} />
          <span className="text-[16px] text-gray-700">About</span>
        </button>

        {/* Log Out Button (Dynamic Action) */}
        <button
          onClick={logout}
          className="w-full border border-gray-100 rounded-xl p-4 flex items-center justify-start gap-3 bg-white shadow-sm hover:bg-red-50 transition-colors"
        >
          <LogOut
            className="w-5 h-5 text-[#10b981] rotate-180"
            strokeWidth={1.5}
          />
          <span className="text-[16px] text-gray-700">Log Out</span>
        </button>
      </div>
    </AppLayout>
  );
}
