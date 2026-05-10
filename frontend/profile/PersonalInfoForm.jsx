"use client";
import { mockUser } from "@/lib/mock-data";
import { Save } from "lucide-react";

export default function PersonalInfoForm() {
  return (
    <div className="bg-white rounded-xl border border-[#d0e4d8] shadow-sm mb-4">
      <div className="p-5 border-b border-[#d0e4d8] flex justify-between items-center">
        <span className="text-[15px] font-bold text-[#1a2e1f]">
          ব্যক্তিগত তথ্য সম্পাদনা
        </span>
        <span className="text-[12px] text-[#7a9482]">
          শেষ আপডেট: ০৮ মে ২০২৬
        </span>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#4a6350] uppercase tracking-wide">
              পূর্ণ নাম
            </label>
            <input
              type="text"
              defaultValue={mockUser.name}
              className="p-2.5 border border-[#d0e4d8] rounded-lg text-sm bg-[#f9fbf9] focus:bg-white focus:border-[#1a6b3a] focus:ring-2 focus:ring-[#1a6b3a]/10 outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#4a6350] uppercase tracking-wide">
              ফোন নম্বর
            </label>
            <input
              type="tel"
              defaultValue={mockUser.phone}
              className="p-2.5 border border-[#d0e4d8] rounded-lg text-sm bg-[#f9fbf9] focus:bg-white focus:border-[#1a6b3a] focus:ring-2 focus:ring-[#1a6b3a]/10 outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-[12px] font-semibold text-[#4a6350] uppercase tracking-wide">
              ইমেইল ঠিকানা
            </label>
            <input
              type="email"
              defaultValue={mockUser.email}
              className="p-2.5 border border-[#d0e4d8] rounded-lg text-sm bg-[#f9fbf9] focus:bg-white focus:border-[#1a6b3a] focus:ring-2 focus:ring-[#1a6b3a]/10 outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#4a6350] uppercase tracking-wide">
              জন্ম তারিখ
            </label>
            <input
              type="date"
              defaultValue={mockUser.dob}
              className="p-2.5 border border-[#d0e4d8] rounded-lg text-sm bg-[#f9fbf9] focus:bg-white focus:border-[#1a6b3a] focus:ring-2 focus:ring-[#1a6b3a]/10 outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#4a6350] uppercase tracking-wide">
              লিঙ্গ
            </label>
            <select
              defaultValue={mockUser.gender}
              className="p-2.5 border border-[#d0e4d8] rounded-lg text-sm bg-[#f9fbf9] focus:bg-white focus:border-[#1a6b3a] focus:ring-2 focus:ring-[#1a6b3a]/10 outline-none transition-all"
            >
              <option>পুরুষ</option>
              <option>মহিলা</option>
              <option>অন্যান্য</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-[12px] font-semibold text-[#4a6350] uppercase tracking-wide">
              ঠিকানা
            </label>
            <input
              type="text"
              defaultValue={mockUser.address}
              className="p-2.5 border border-[#d0e4d8] rounded-lg text-sm bg-[#f9fbf9] focus:bg-white focus:border-[#1a6b3a] focus:ring-2 focus:ring-[#1a6b3a]/10 outline-none transition-all"
            />
          </div>
        </div>

        <div className="h-[1px] bg-[#d0e4d8] my-6"></div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#1a6b3a] text-white rounded-lg text-sm font-semibold hover:bg-[#145f31] transition-colors">
            <Save size={16} /> সংরক্ষণ করুন
          </button>
          <button className="px-5 py-2.5 bg-transparent border-2 border-[#d0e4d8] text-[#4a6350] rounded-lg text-sm font-semibold hover:bg-[#f4f6f4] transition-colors">
            বাতিল
          </button>
        </div>
      </div>
    </div>
  );
}
