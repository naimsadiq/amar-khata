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
  SheetDescription
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { UserNav } from "./user-nav";
import { BusinessProfile } from "./BusinessProfile";

const navItems = [
  { href: "/dashboard", icon: "⊞", label: "ড্যাশবোর্ড" },
  { href: "/dashboard/parties", icon: "👥", label: "গ্রাহক/সাপ্লায়ার" },
  { href: "/dashboard/cashbook", icon: "📒", label: "ক্যাশবুক" },
  { href: "/dashboard/inventory", icon: "📦", label: "ইনভেন্টরি" },
  { href: "/dashboard/pos", icon: "🧾", label: "POS / বিলিং" },
  { href: "/dashboard/reports", icon: "📊", label: "রিপোর্ট" },
];

const pageTitles = {
  "/dashboard": "ড্যাশবোর্ড",
  "/dashboard/parties": "গ্রাহক ও সাপ্লায়ার",
  "/dashboard/cashbook": "ক্যাশবুক",
  "/dashboard/inventory": "ইনভেন্টরি",
  "/dashboard/pos": "POS / বিলিং",
  "/dashboard/reports": "রিপোর্ট",
};

export function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "ড্যাশবোর্ড";

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
    <header className="flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 sticky top-0 z-30 shadow-sm">
      {/* Mobile Navigation Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0 w-72 bg-card">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="sr-only">প্রধান মেন্যু</SheetTitle>

            <SheetDescription className="sr-only">
              মোবাইল নেভিগেশন মেন্যু
            </SheetDescription>

            <div className="flex flex-col items-start">
              <Link href="/" className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold text-primary">
                  আমার খাতা
                </span>
              </Link>

              <p className="text-xs text-muted-foreground mt-1">
                ব্যবসায়িক হিসাব-নিকাশ
              </p>
            </div>
          </SheetHeader>

          <div className="p-4 border-b">
            <BusinessProfile />
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <span className="text-lg w-5 text-center">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Page Title & Date */}
      <div className="hidden md:flex flex-col">
        <h1 className="text-lg font-semibold text-foreground leading-none mb-1">
          {title}
        </h1>
        <span className="text-xs text-muted-foreground">
          {getBengaliDate()}
        </span>
      </div>

      <div className="flex-1"></div>

      {/* Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="outline" size="sm" className="hidden md:flex gap-2">
          <Languages className="h-4 w-4" />
          <span>EN / বাংলা</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full"
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-destructive ring-2 ring-background"></span>
        </Button>
        <UserNav />
      </div>
    </header>
  );
}
