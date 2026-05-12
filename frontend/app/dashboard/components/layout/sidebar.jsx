"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  BookText,
  Boxes,
  Receipt,
  BarChart4,
} from "lucide-react";
import { BusinessProfile } from "./BusinessProfile";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "ড্যাশবোর্ড" },
  { href: "/dashboard/parties", icon: Users, label: "গ্রাহক/সাপ্লায়ার" },
  { href: "/dashboard/cashbook", icon: BookText, label: "ক্যাশবুক", badge: 3 },
  { href: "/dashboard/inventory", icon: Boxes, label: "ইনভেন্টরি" },
  { href: "/dashboard/pos", icon: Receipt, label: "POS / বিলিং" },
];

const moreNavItems = [
  { href: "/dashboard/reports", icon: BarChart4, label: "রিপোর্ট" },
];

export function Sidebar({ className }) {
  const pathname = usePathname();

  return (
    <aside className={cn("hidden border-r bg-card md:block", className)}>
      <div className="flex h-full max-h-screen flex-col">
        {/* Logo Section */}
        <div className="flex h-16 items-center px-6 border-b">
          <Link href="/" className="flex flex-col items-start gap-0.5">
            <span className="text-2xl font-bold text-primary tracking-tight">
              আমার খাতা
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
              Business Manager
            </span>
          </Link>
        </div>

        {/* Business Switcher */}
        <div className="p-4">
          <BusinessProfile />
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <nav className="grid gap-1 px-3 text-sm font-medium">
            <h3 className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground/70 tracking-wider">
              প্রধান মেন্যু
            </h3>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all",
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4",
                      isActive ? "text-primary" : "text-muted-foreground",
                    )}
                  />
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-destructive/10 text-[10px] font-bold text-destructive">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <h3 className="px-3 pt-6 pb-2 text-xs font-semibold uppercase text-muted-foreground/70 tracking-wider">
              আরও
            </h3>
            {moreNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all",
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
