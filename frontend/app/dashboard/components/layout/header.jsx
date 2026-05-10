"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Bell, Languages, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { UserNav } from "./user-nav";
import { BusinessProfile } from "./BusinessProfile";

// Sidebar এর নেভিগেশন আইটেমগুলো এখানে আবার ব্যবহার করছি মোবাইল মেন্যুর জন্য
// আগের কোড থেকে কপি করে আনা হয়েছে
const navItems = [
  { href: "/", icon: "⊞", label: "ড্যাশবোর্ড" },
  { href: "/parties", icon: "👥", label: "গ্রাহক/সাপ্লায়ার" },
  { href: "/cashbook", icon: "📒", label: "ক্যাশবুক" },
  { href: "/inventory", icon: "📦", label: "ইনভেন্টরি" },
  { href: "/pos", icon: "🧾", label: "POS / বিলিং" },
  { href: "/banking", icon: "🏦", label: "ব্যাংক হিসাব" },
  { href: "/staff", icon: "🧑‍💼", label: "স্টাফ" },
  { href: "/reports", icon: "📊", label: "রিপোর্ট" },
];

const pageTitles = {
  "/": "ড্যাশবোর্ড",
  "/parties": "গ্রাহক ও সাপ্লায়ার",
  "/cashbook": "ক্যাশবুক",
  "/inventory": "ইনভেন্টরি",
  "/pos": "POS / বিলিং",
  "/banking": "ব্যাংক হিসাব",
  "/staff": "স্টাফ",
  "/reports": "রিপোর্ট",
};

export function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "ড্যাশবোর্ড";

  // বাংলা তারিখ দেখানোর জন্য একটি ফাংশন
  const getBengaliDate = () => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date().toLocaleDateString("bn-BD", options);
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-paper px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
      {/* --- Mobile Navigation --- */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden border-paper-3"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="sr-only">প্রধান মেন্যু</SheetTitle>{" "}
            {/* <-- এই লাইনটি যোগ করা হয়েছে */}
            {/* Mobile Sidebar Header */}
            <div className="flex flex-col items-start">
              <Link href="/" className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold text-brand">
                  আমার খাতা
                </span>
              </Link>
              <p className="text-xs text-ink-3">ব্যবসায়িক হিসাব-নিকাশ</p>
            </div>
          </SheetHeader>

          <div className="p-4 border-b">
            <BusinessProfile />
          </div>

          {/* Mobile Sidebar Navigation */}
          <nav className="grid gap-1 p-4 text-base font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-ink-2 transition-all hover:bg-paper-2",
                  pathname === item.href &&
                    "bg-brand-l font-semibold text-brand-d",
                )}
              >
                <span className="text-lg w-5 text-center">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* --- Page Title & Date --- */}
      <div className="hidden md:flex items-baseline gap-2">
        <h1 className="text-lg font-semibold text-ink-2">{title}</h1>
        <span className="text-xs text-ink-3">{getBengaliDate()}</span>
      </div>

      {/* --- Spacer --- */}
      <div className="flex-1"></div>

      {/* --- Center Tab/Toggle Group --- */}
      {/* <div className="hidden md:block">
        <ToggleGroup
          type="single"
          defaultValue="today"
          size="sm"
          className="bg-paper-2 rounded-lg p-1"
        >
          <ToggleGroupItem
            value="today"
            aria-label="Today's stats"
            className="px-3 data-[state=on]:bg-background data-[state=on]:shadow-sm"
          >
            আজকের হিসাব
          </ToggleGroupItem>
          <ToggleGroupItem
            value="week"
            aria-label="This week's stats"
            className="px-3 data-[state=on]:bg-background data-[state=on]:shadow-sm"
          >
            এই সপ্তাহ
          </ToggleGroupItem>
          <ToggleGroupItem
            value="month"
            aria-label="This month's stats"
            className="px-3 data-[state=on]:bg-background data-[state=on]:shadow-sm"
          >
            এই মাস
          </ToggleGroupItem>
        </ToggleGroup>
      </div> */}

      {/* --- Header Right Side Actions --- */}
      <div className="flex items-center gap-2 md:gap-3">
        <Button
          variant="outline"
          size="sm"
          className="hidden md:inline-flex gap-2"
        >
          <Languages className="h-4 w-4" />
          <span>EN / বাংলা</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red ring-1 ring-paper"></span>
          <span className="sr-only">Toggle notifications</span>
        </Button>
        <UserNav />
      </div>
    </header>
  );
}
