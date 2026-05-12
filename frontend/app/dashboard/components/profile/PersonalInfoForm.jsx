"use client";
import { Save } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
import api from "@/lib/axiosInstance";

export default function PersonalInfoForm({ profileData, refetch }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    const form = e.target;
    const updatedData = {
      name: form.name.value,
      phone: form.phone.value,
      businessName: form.businessName.value,
      dob: form.dob.value,
      gender: form.gender.value,
      address: form.address.value,
    };

    try {
      // Axios instance (api) ব্যবহার করে PUT রিকোয়েস্ট
      const res = await api.put("/api/users/profile", updatedData);

      if (res.data) {
        // Success Alert
        Swal.fire({
          icon: "success",
          title: "সফল!",
          text: "প্রোফাইল সফলভাবে আপডেট হয়েছে!",
          confirmButtonColor: "#1a6b3a",
        });

        refetch(); // আপডেট হওয়ার পর লেটেস্ট ডাটা আনবে
      }
    } catch (error) {
      // Error Alert (Axios এর মাধ্যমে ব্যাকেন্ডের error message ধরা)
      const errorMsg =
        error.response?.data?.message ||
        "সার্ভার এরর! দয়া করে আবার চেষ্টা করুন।";

      Swal.fire({
        icon: "error",
        title: "ব্যর্থ!",
        text: errorMsg,
        confirmButtonColor: "#1a6b3a",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!profileData) return null;

  return (
    <div className="bg-white rounded-xl border border-[#d0e4d8] shadow-sm mb-4">
      <div className="p-5 border-b border-[#d0e4d8] flex justify-between items-center">
        <span className="text-[15px] font-bold text-[#1a2e1f]">
          ব্যক্তিগত তথ্য সম্পাদনা
        </span>
      </div>

      <form onSubmit={handleUpdate} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#4a6350] uppercase tracking-wide">
              পূর্ণ নাম
            </label>
            <input
              type="text"
              name="name"
              defaultValue={profileData.name || ""}
              required
              className="p-2.5 border border-[#d0e4d8] rounded-lg text-sm bg-[#f9fbf9] focus:bg-white focus:border-[#1a6b3a] focus:ring-2 focus:ring-[#1a6b3a]/10 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#4a6350] uppercase tracking-wide">
              ব্যবসার নাম
            </label>
            <input
              type="text"
              name="businessName"
              defaultValue={profileData.businessName || ""}
              required
              className="p-2.5 border border-[#d0e4d8] rounded-lg text-sm bg-[#f9fbf9] focus:bg-white focus:border-[#1a6b3a] focus:ring-2 focus:ring-[#1a6b3a]/10 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#4a6350] uppercase tracking-wide">
              ফোন নম্বর
            </label>
            <input
              type="tel"
              name="phone"
              defaultValue={profileData.phone || ""}
              className="p-2.5 border border-[#d0e4d8] rounded-lg text-sm bg-[#f9fbf9] focus:bg-white focus:border-[#1a6b3a] focus:ring-2 focus:ring-[#1a6b3a]/10 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#4a6350] uppercase tracking-wide">
              ইমেইল ঠিকানা
            </label>
            <input
              type="email"
              defaultValue={profileData.email}
              disabled // ইমেইল পরিবর্তন করতে না দিলে
              className="p-2.5 border border-[#d0e4d8] rounded-lg text-sm bg-gray-100 cursor-not-allowed outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#4a6350] uppercase tracking-wide">
              জন্ম তারিখ
            </label>
            <input
              type="date"
              name="dob"
              defaultValue={profileData.dob || ""}
              className="p-2.5 border border-[#d0e4d8] rounded-lg text-sm bg-[#f9fbf9] focus:bg-white focus:border-[#1a6b3a] focus:ring-2 focus:ring-[#1a6b3a]/10 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#4a6350] uppercase tracking-wide">
              লিঙ্গ
            </label>
            <select
              name="gender"
              defaultValue={profileData.gender || "পুরুষ"}
              className="p-2.5 border border-[#d0e4d8] rounded-lg text-sm bg-[#f9fbf9] focus:bg-white focus:border-[#1a6b3a] focus:ring-2 focus:ring-[#1a6b3a]/10 outline-none transition-all"
            >
              <option value="পুরুষ">পুরুষ</option>
              <option value="মহিলা">মহিলা</option>
              <option value="অন্যান্য">অন্যান্য</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-[12px] font-semibold text-[#4a6350] uppercase tracking-wide">
              ঠিকানা
            </label>
            <input
              type="text"
              name="address"
              defaultValue={profileData.address || ""}
              placeholder="আপনার ঠিকানা লিখুন"
              className="p-2.5 border border-[#d0e4d8] rounded-lg text-sm bg-[#f9fbf9] focus:bg-white focus:border-[#1a6b3a] focus:ring-2 focus:ring-[#1a6b3a]/10 outline-none transition-all"
            />
          </div>
        </div>

        <div className="h-[1px] bg-[#d0e4d8] my-6"></div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isUpdating}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1a6b3a] text-white rounded-lg text-sm font-semibold hover:bg-[#145f31] transition-colors disabled:opacity-70"
          >
            <Save size={16} />{" "}
            {isUpdating ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
          </button>
          <button
            type="reset"
            className="px-5 py-2.5 bg-transparent border-2 border-[#d0e4d8] text-[#4a6350] rounded-lg text-sm font-semibold hover:bg-[#f4f6f4] transition-colors"
          >
            বাতিল
          </button>
        </div>
      </form>
    </div>
  );
}
