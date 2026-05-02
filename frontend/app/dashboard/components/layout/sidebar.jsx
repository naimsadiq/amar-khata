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
  Landmark,
  UserCog,
  BarChart4,
} from "lucide-react";
import { BusinessProfile } from "./BusinessProfile"; // নতুন কম্পোনেন্ট ইম্পোর্ট করুন

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "ড্যাশবোর্ড" },
  { href: "/dashboard/parties", icon: Users, label: "গ্রাহক/সাপ্লায়ার" },
  { href: "/dashboard/cashbook", icon: BookText, label: "ক্যাশবুক", badge: 3 },
  { href: "/dashboard/inventory", icon: Boxes, label: "ইনভেন্টরি" },
  { href: "/dashboard/pos", icon: Receipt, label: "POS / বিলিং" },
];

const moreNavItems = [
  { href: "/dashboard/banking", icon: Landmark, label: "ব্যাংক হিসাব" },
  { href: "/dashboard/staff", icon: UserCog, label: "স্টাফ" },
  { href: "/dashboard/reports", icon: BarChart4, label: "রিপোর্ট" },
];

export function Sidebar({ className }) {
  const pathname = usePathname();

  return (
    <div className={cn("hidden border-r bg-paper md:block", className)}>
      <div className="flex h-full max-h-screen flex-col">
        {/* লোগো সেকশন */}
        <div className="flex h-auto flex-col items-start border-b p-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-brand">আমার খাতা</span>
          </Link>
          <p className="text-xs text-ink-3">ব্যবসায়িক হিসাব-নিকাশ</p>
        </div>

        {/* Business Switcher এখানে যুক্ত করা হয়েছে */}
        <div className="p-4">
          <BusinessProfile />
        </div>

        {/* নেভিগেশন সেকশন */}
        <div className="flex-1 overflow-y-auto">
          <nav className="grid items-start px-4 text-sm font-medium">
            <h3 className="px-2 py-2 text-xs font-semibold uppercase text-ink-3 tracking-wider">
              প্রধান মেন্যু
            </h3>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-ink-2 transition-all hover:bg-paper-2 hover:text-ink",
                  pathname === item.href &&
                    "bg-brand-l font-semibold text-brand-d",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.badge && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-l text-xs font-semibold text-red">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}

            <h3 className="px-2 pt-6 pb-2 text-xs font-semibold uppercase text-ink-3 tracking-wider">
              আরও
            </h3>
            {moreNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-ink-2 transition-all hover:bg-paper-2 hover:text-ink",
                  pathname === item.href &&
                    "bg-brand-l font-semibold text-brand-d",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* সাইডবার ফুটার - User Info (যদি লাগে) */}
        {/* <div className="mt-auto p-4 border-t">
            ... User Info Here
        </div> */}
      </div>
    </div>
  );
}
