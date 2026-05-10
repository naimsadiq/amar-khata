
import Link from "next/link";
import { Home, ChevronRight, Store, Shield } from "lucide-react";
import ProfileCard from "@/profile/ProfileCard";
import PersonalInfoForm from "@/profile/PersonalInfoForm";
import RecentActivity from "@/profile/RecentActivity";

export default function ProfilePage() {
  return (
    <div className="p-4 md:p-8 w-full max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[13px] text-[#7a9482] mb-6">
        <Home size={14} /> হোম <ChevronRight size={12} />{" "}
        <span className="text-[#1a6b3a] font-semibold">প্রফাইল</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">
        {/* Left Sidebar Layout */}
        <div>
          <ProfileCard />

          {/* Quick Links */}
          <div className="bg-white rounded-xl border border-[#d0e4d8] shadow-sm">
            <div className="p-4 border-b border-[#d0e4d8] font-bold text-[15px]">
              দ্রুত লিংক
            </div>
            <ul className="flex flex-col py-2">
              <li className="px-5 py-3 flex items-center gap-3 text-[#1a6b3a] bg-[#e8f5ee] border-l-4 border-[#1a6b3a] font-semibold cursor-pointer">
                <Home size={16} /> ব্যক্তিগত তথ্য
              </li>
              <Link
                href="/settings"
                className="px-5 py-3 flex items-center gap-3 text-[#4a6350] hover:bg-[#f4f6f4] border-l-4 border-transparent transition-colors"
              >
                <Store size={16} /> স্টোর তথ্য
              </Link>
              <Link
                href="/settings"
                className="px-5 py-3 flex items-center gap-3 text-[#4a6350] hover:bg-[#f4f6f4] border-l-4 border-transparent transition-colors"
              >
                <Shield size={16} /> নিরাপত্তা ও পাসওয়ার্ড
              </Link>
            </ul>
          </div>
        </div>

        {/* Right Content */}
        <div>
          <PersonalInfoForm />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
