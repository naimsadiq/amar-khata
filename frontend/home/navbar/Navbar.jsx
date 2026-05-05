"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import useAuth from "@/hook/useAuth";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // useAuth থেকে user এবং logout ফাংশন নিয়ে আসা হচ্ছে (আপনার হুকের রিটার্ন অনুযায়ী পরিবর্তন করে নিতে পারেন)
  const { user, logout, loading } = useAuth();
  // console.log("Navbar - User:", user, "Loading:", loading);

  return (
    <header className="sticky top-0 w-full border-b border-gray-200 bg-[#FBFBFB] z-50">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8 max-w-[1400px]">
        {/* Left Side - Logo Section */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#1AA676] text-white shadow-sm">
            <span className="text-2xl font-bold leading-none mt-1">খ</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-800 tracking-tight">
              আমার খাতা
            </span>
            <span className="text-[11px] font-medium text-gray-500 -mt-1">
              ডিজিটাল হিসাব-নিকাশ
            </span>
          </div>
        </Link>

        {/* Middle Side - Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-semibold text-[#1AA676] hover:text-[#1AA676] transition-colors"
          >
            ফিচারসমূহ
          </Link>
          <Link
            href="#how"
            className="text-sm font-medium text-gray-600 hover:text-[#1AA676] transition-colors"
          >
            কীভাবে কাজ করে
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-gray-600 hover:text-[#1AA676] transition-colors"
          >
            মূল্য তালিকা
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-gray-600 hover:text-[#1AA676] transition-colors"
          >
            সাহায্য
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-gray-600 hover:text-[#1AA676] transition-colors"
          >
            যোগাযোগ
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-gray-600 hover:text-[#1AA676] transition-colors"
          >
            ব্লগ
          </Link>
        </nav>

        {/* Right Side - Buttons (Desktop only) */}
        {loading ? (
          <>
            <div className="flex items-center gap-3">
              <div className="h-10 w-28 bg-gray-200 animate-pulse rounded-md"></div>
              <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-md"></div>
            </div>
          </>
        ) : (
          <>
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                // ইউজার লগইন থাকলে এই বাটনগুলো দেখাবে
                <>
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-medium px-6 h-10"
                    asChild
                  >
                    <Link href="/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" /> ড্যাশবোর্ড
                    </Link>
                  </Button>

                  <Button
                    variant="destructive"
                    className="font-medium px-6 h-10 transition-colors"
                    onClick={logout}
                  >
                    লগআউট <LogOut className="ml-2 h-4 w-4" />
                  </Button>
                </>
              ) : (
                // ইউজার লগইন না থাকলে এই বাটনগুলো দেখাবে
                <>
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-medium px-6 h-10"
                    asChild
                  >
                    <Link href="/login">লগিন</Link>
                  </Button>

                  <Button
                    className="bg-[#1AA676] hover:bg-[#158f64] text-white font-medium px-6 h-10 transition-colors"
                    asChild
                  >
                    <Link href="/register">
                      বিনামূল্যে শুরু করুন{" "}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </>
        )}

        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:bg-gray-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-200 shadow-lg px-4 py-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-4">
            <Link
              href="#"
              className="text-base font-semibold text-[#1AA676] hover:bg-gray-50 p-2 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ফিচারসমূহ
            </Link>
            <Link
              href="#"
              className="text-base font-medium text-gray-700 hover:text-[#1AA676] hover:bg-gray-50 p-2 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              কীভাবে কাজ করে
            </Link>
            <Link
              href="#"
              className="text-base font-medium text-gray-700 hover:text-[#1AA676] hover:bg-gray-50 p-2 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              মূল্য তালিকা
            </Link>
            <Link
              href="#"
              className="text-base font-medium text-gray-700 hover:text-[#1AA676] hover:bg-gray-50 p-2 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              সাহায্য
            </Link>
            <Link
              href="#"
              className="text-base font-medium text-gray-700 hover:text-[#1AA676] hover:bg-gray-50 p-2 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ব্লগ
            </Link>
          </nav>

          {/* Mobile Buttons */}
          {loading ? (
            <>
              <div className="flex flex-col gap-3 mt-4">
                <div className="h-11 w-full bg-gray-200 animate-pulse rounded-md"></div>
                <div className="h-11 w-full bg-gray-200 animate-pulse rounded-md"></div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-100">
                {user ? (
                  // মোবাইল ভিউতে ইউজার লগইন থাকলে
                  <>
                    <Button
                      variant="outline"
                      className="w-full border-gray-300 text-gray-700 font-medium h-11 flex items-center justify-center"
                      asChild
                    >
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" /> ড্যাশবোর্ড
                      </Link>
                    </Button>

                    <Button
                      variant="destructive"
                      className="w-full font-medium h-11 transition-colors flex items-center justify-center"
                      onClick={() => {
                        logout(); // লগআউট ফাংশন কল হবে
                        setIsMobileMenuOpen(false); // মোবাইল মেন্যু বন্ধ হবে
                      }}
                    >
                      লগআউট <LogOut className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  // মোবাইল ভিউতে ইউজার লগইন না থাকলে
                  <>
                    <Button
                      variant="outline"
                      className="w-full border-gray-300 text-gray-700 font-medium h-11"
                      asChild
                    >
                      <Link
                        href="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        লগিন
                      </Link>
                    </Button>

                    <Button
                      className="w-full bg-[#1AA676] hover:bg-[#158f64] text-white font-medium h-11 transition-colors"
                      asChild
                    >
                      <Link
                        href="/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        বিনামূল্যে শুরু করুন{" "}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}
