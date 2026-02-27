"use client";
import React from "react";
import Link from "next/link";
import { X, LogOut, User, Settings } from "lucide-react";
import { useLayout } from "@/context/LayoutContext";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const { isSidebarOpen, setIsSidebarOpen } = useLayout();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    setIsSidebarOpen(false);
    logout();
  };

  const handleLinkClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Black Overlay */}
      {isSidebarOpen && (
        <div
          className="absolute inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <div
        className={`absolute top-0 left-0 w-[75%] h-full bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-xl ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header Section (Dynamic) */}
        <div className="bg-[#10b981] p-5 h-36 text-white flex justify-between items-start">
          <div className="flex flex-col justify-end h-full pb-2">
            <h2 className="text-xl font-bold truncate max-w-[200px]">
              {user?.businessName || user?.name || "Menu"}
            </h2>

            <p className="text-sm opacity-90 mt-1">
              {user?.phone || "No Phone Number"}
            </p>
          </div>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="bg-white/20 p-1 rounded-md hover:bg-white/30 transition mt-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-4 flex flex-col gap-2 text-gray-700">
          {/* Profile Link */}
          <Link
            href="/menu"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 hover:text-[#10b981] font-medium transition-colors"
          >
            <User className="w-5 h-5" strokeWidth={1.5} />
            Profile
          </Link>

          {/* Settings Link */}
          <Link
            href="/menu"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 hover:text-[#10b981] font-medium transition-colors"
          >
            <Settings className="w-5 h-5" strokeWidth={1.5} />
            Settings
          </Link>

          {/* Divider */}
          <div className="h-[1px] bg-gray-100 my-2"></div>

          {/* Log Out Button (Dynamic) */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-red-500 hover:bg-red-50 font-medium transition-colors text-left w-full"
          >
            <LogOut className="w-5 h-5 rotate-180" strokeWidth={1.5} />
            Log Out
          </button>
        </div>
      </div>
    </>
  );
}
