"use client";
import { useState } from "react";
import {
  Home,
  ChevronRight,
  Store,
  Bell,
  Shield,
  Palette,
  Database,
  CreditCard,
  Save,
  Download,
} from "lucide-react";
import { mockStore } from "@/lib/mock-data";
import { Toggle } from "@/components/ui/toggle";

const TABS = [
  { id: "store", label: "স্টোর তথ্য", icon: Store },
  { id: "notification", label: "নোটিফিকেশন", icon: Bell },
  { id: "security", label: "নিরাপত্তা", icon: Shield },
  { id: "appearance", label: "চেহারা ও ভাষা", icon: Palette },
  { id: "backup", label: "ব্যাকআপ ও ডেটা", icon: Database },
  { id: "subscription", label: "সাবস্ক্রিপশন", icon: CreditCard },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("store");

  return (
    <div className="p-4 md:p-8 w-full max-w-6xl mx-auto">
      <div className="flex items-center gap-2 text-[13px] text-[#7a9482] mb-6">
        <Home size={14} /> হোম <ChevronRight size={12} />{" "}
        <span className="text-[#1a6b3a] font-semibold">সেটিংস</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 items-start">
        {/* Left Navigation */}
        <div className="bg-white rounded-xl border border-[#d0e4d8] shadow-sm p-3">
          <div className="flex flex-col gap-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[13.5px] transition-colors w-full text-left
                    ${isActive ? "bg-[#e8f5ee] text-[#1a6b3a] font-bold" : "text-[#4a6350] hover:bg-[#f4f6f4]"}
                  `}
                >
                  <Icon size={18} /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content Panels */}
        <div className="bg-white rounded-xl border border-[#d0e4d8] shadow-sm min-h-[500px]">
          {/* STORE PANEL */}
          {activeTab === "store" && (
            <div className="p-6 animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-lg font-bold text-[#1a2e1f] mb-6 border-b pb-4">
                স্টোর তথ্য
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-[12px] font-semibold text-[#4a6350]">
                    স্টোরের নাম
                  </label>
                  <input
                    type="text"
                    defaultValue={mockStore.name}
                    className="p-2.5 border border-[#d0e4d8] rounded-lg text-sm bg-[#f9fbf9] focus:bg-white focus:border-[#1a6b3a] outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-[#4a6350]">
                    স্টোর আইডি
                  </label>
                  <input
                    type="text"
                    value={mockStore.storeId}
                    disabled
                    className="p-2.5 border border-[#d0e4d8] rounded-lg text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-[#4a6350]">
                    ব্যবসার ধরন
                  </label>
                  <select
                    defaultValue={mockStore.businessType}
                    className="p-2.5 border border-[#d0e4d8] rounded-lg text-sm bg-[#f9fbf9] outline-none"
                  >
                    <option>মুদি দোকান</option>
                    <option>ফার্মেসি</option>
                  </select>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t">
                <button className="px-6 py-2.5 bg-[#1a6b3a] text-white rounded-lg text-sm font-semibold flex gap-2 items-center">
                  <Save size={16} /> সংরক্ষণ করুন
                </button>
              </div>
            </div>
          )}

          {/* NOTIFICATION PANEL */}
          {activeTab === "notification" && (
            <div className="p-6 animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-lg font-bold text-[#1a2e1f] mb-6 border-b pb-4">
                নোটিফিকেশন সেটিংস
              </h2>
              <div className="flex flex-col divide-y divide-[#d0e4d8]">
                {[
                  {
                    title: "বিক্রয় নোটিফিকেশন",
                    desc: "নতুন বিক্রয় হলে সাথে সাথে জানান",
                    active: true,
                  },
                  {
                    title: "বকেয়া পাওনা সতর্কতা",
                    desc: "গ্রাহকের বকেয়া থাকলে মনে করিয়ে দিন",
                    active: true,
                  },
                  {
                    title: "SMS নোটিফিকেশন",
                    desc: "ফোনে SMS-এ গুরুত্বপূর্ণ বিজ্ঞপ্তি পান",
                    active: false,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-4"
                  >
                    <div>
                      <div className="text-sm font-bold text-[#1a2e1f]">
                        {item.title}
                      </div>
                      <div className="text-xs text-[#7a9482] mt-1">
                        {item.desc}
                      </div>
                    </div>
                    <Toggle defaultChecked={item.active} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECURITY PANEL */}
          {activeTab === "security" && (
            <div className="p-6 animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-lg font-bold text-[#1a2e1f] mb-6 border-b pb-4">
                নিরাপত্তা সেটিংস
              </h2>
              <div className="flex flex-col gap-4 max-w-md">
                <input
                  type="password"
                  placeholder="বর্তমান পাসওয়ার্ড"
                  className="p-2.5 border rounded-lg text-sm"
                />
                <input
                  type="password"
                  placeholder="নতুন পাসওয়ার্ড"
                  className="p-2.5 border rounded-lg text-sm"
                />
                <button className="bg-[#1a6b3a] text-white py-2 rounded-lg text-sm font-bold mt-2">
                  পাসওয়ার্ড আপডেট করুন
                </button>
              </div>

              <div className="mt-10 p-5 bg-[#fff5f5] border border-[#fecdd3] rounded-xl">
                <h3 className="text-red-600 font-bold mb-2">
                  ⚠️ বিপজ্জনক এলাকা
                </h3>
                <p className="text-sm text-red-800 mb-4">
                  অ্যাকাউন্ট ডিলেট করলে সমস্ত ডেটা স্থায়ীভাবে মুছে যাবে।
                </p>
                <button className="bg-red-600 text-white px-4 py-2 rounded text-sm font-bold">
                  অ্যাকাউন্ট ডিলেট করুন
                </button>
              </div>
            </div>
          )}

          {/* BACKUP PANEL */}
          {activeTab === "backup" && (
            <div className="p-6 animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-lg font-bold text-[#1a2e1f] mb-6 border-b pb-4">
                ব্যাকআপ ও ডেটা
              </h2>
              <div className="bg-[#e8f5ee] p-4 rounded-xl flex items-center gap-4 mb-6">
                <Database className="text-[#1a6b3a]" />
                <div>
                  <div className="text-sm font-bold text-[#1a6b3a]">
                    শেষ ব্যাকআপ সফল হয়েছে
                  </div>
                  <div className="text-xs text-[#7a9482]">
                    ০৯ মে ২০২৬, রাত ১১:৫৮
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="bg-[#1a6b3a] text-white px-5 py-2.5 rounded-lg text-sm font-bold flex gap-2">
                  <Database size={16} /> এখনই ব্যাকআপ নিন
                </button>
                <button className="border-2 border-[#d0e4d8] text-[#4a6350] px-5 py-2.5 rounded-lg text-sm font-bold flex gap-2">
                  <Download size={16} /> ডেটা রপ্তানি (Excel)
                </button>
              </div>
            </div>
          )}

          {/* SUBSCRIPTION PANEL */}
          {activeTab === "subscription" && (
            <div className="p-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-gradient-to-r from-[#1a6b3a] to-[#2d9653] p-6 rounded-xl text-white">
                <p className="text-xs font-bold uppercase opacity-80">
                  বর্তমান প্ল্যান
                </p>
                <h1 className="text-3xl font-bold my-2">ফ্রি প্ল্যান</h1>
                <p className="text-sm opacity-90">সর্বোচ্চ ৫০০ লেনদেন/মাস</p>
              </div>
              <button className="mt-6 bg-[#e85d04] text-white px-6 py-3 rounded-lg font-bold w-full md:w-auto">
                প্রিমিয়াম প্ল্যানে আপগ্রেড করুন
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
