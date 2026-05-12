"use client";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import ProfileCard from "@/app/dashboard/components/profile/ProfileCard";
import PersonalInfoForm from "@/app/dashboard/components/profile/PersonalInfoForm";
import useAuth from "@/hook/useAuth";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axiosInstance";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();

  // Tanstack Query দিয়ে ডাটা ফেচ করা
  const {
    data: profileData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["userProfile", user?.email], // ইউজারের ইমেইল চেঞ্জ হলে আবার কল হবে
    queryFn: async () => {
      const res = await api.get("/api/users/profile");
      return res.data;
    },
    enabled: !!user?.email, // user.email না পাওয়া পর্যন্ত API কল হবে না
  });

  // লোডিং স্টেট হ্যান্ডেল করা
  if (authLoading || isLoading) {
    return <div className="p-8 text-center text-[#1a6b3a]">লোড হচ্ছে...</div>;
  }

  return (
    <div className="p-4 md:p-8 w-full max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[13px] text-[#7a9482] mb-6">
        {/* <Home size={14} /> হোম <ChevronRight size={12} />{" "} */}
        <span className="text-[#1a6b3a] font-semibold">প্রফাইল</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">
        {/* Left Sidebar Layout */}
        <div>
          <ProfileCard profileData={profileData} />
        </div>

        {/* Right Content */}
        <div>
          <PersonalInfoForm
            profileData={profileData}
            refetch={refetch} // Tanstack এর refetch ফাংশন পাস করা হলো
          />
        </div>
      </div>
    </div>
  );
}