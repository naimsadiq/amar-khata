"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileEdit, LayoutGrid } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname() || "/";

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Note", path: "/note", icon: FileEdit },
    { name: "Menu", path: "/menu", icon: LayoutGrid },
  ];

  return (
    <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 px-6 py-2 flex justify-between items-center z-30 pb-4 sm:pb-2 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.path}
            className="flex flex-col items-center gap-1 min-w-[64px]"
          >
            <div
              className={`p-1.5 px-5 rounded-full transition-all duration-200 ${
                isActive
                  ? "bg-[#10b981] text-white shadow-md"
                  : "text-gray-400 hover:text-[#10b981] hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span
              className={`text-[12px] mt-0.5 transition-colors ${
                isActive
                  ? "text-gray-800 font-semibold"
                  : "text-gray-400 font-medium"
              }`}
            >
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
