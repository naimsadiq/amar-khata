"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Smartphone, AlertCircle } from "lucide-react"; // AlertCircle আইকন আনা হলো
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(""); // এরর মেসেজ রাখার জন্য স্টেট
  const { sendOtp } = useAuth();

  const handleNext = () => {
    // ভ্যালিডেশন চেক
    if (phone.length === 11) {
      setError(""); // সব ঠিক থাকলে এরর ক্লিয়ার
      sendOtp(phone);
    } else {
      setError("Please enter a valid 11-digit phone number"); // এরর সেট করা
    }
  };

  return (
    <div className="min-h-screen bg-[#f2fcf6] sm:bg-[#f0f2f5] flex items-center justify-center relative overflow-hidden">
      <div className="hidden sm:block absolute top-0 w-full h-48 bg-[#10b981]"></div>

      <div className="w-full max-w-[400px] p-6 sm:p-10 sm:bg-white sm:shadow-lg sm:rounded-2xl z-10 flex flex-col items-center h-screen sm:h-auto justify-center">
        {/* Logo Section */}
        <div className="mb-8 flex flex-col items-center">
          <div className="w-[80px] h-[80px] mb-6 relative rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <Image
              src="/image/amar-khata.webp"
              alt="Logo"
              fill
              className="object-contain p-1"
            />
          </div>
          <h1 className="text-[28px] font-semibold text-gray-800 tracking-wide">
            Welcome!
          </h1>
        </div>

        {/* Input Section */}
        <div className="w-full flex flex-col mt-4">
          <div className="relative w-full mb-8">
            <label className="absolute -top-[10px] left-4 bg-[#f2fcf6] sm:bg-white px-1 text-[13px] text-gray-400 z-10">
              Phone Number
            </label>

            {/* Input Container: এরর থাকলে বর্ডার লাল হবে */}
            <div
              className={`relative flex items-center w-full border rounded-xl px-4 py-[14px] bg-transparent transition-colors duration-200 ${
                error
                  ? "border-red-500 ring-1 ring-red-500/20" // এরর স্টাইল
                  : "border-[#10b981]" // নরমাল স্টাইল
              }`}
            >
              <Smartphone
                className={`${
                  error ? "text-red-400" : "text-gray-400"
                } w-5 h-5 mr-3 shrink-0 transition-colors`}
                strokeWidth={1.5}
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (error) setError(""); // টাইপ করা শুরু করলে এরর মুছে যাবে
                }}
                placeholder="01XXXXXXXXX"
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-300 text-[16px]"
                maxLength={11}
              />
            </div>

            {/* Error Message Display (ইনপুট এর নিচে) */}
            {error && (
              <div className="absolute -bottom-6 left-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-300">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <p className="text-red-500 text-[12px] font-medium">{error}</p>
              </div>
            )}
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-medium py-[14px] rounded-xl transition-all shadow-sm active:scale-[0.98]"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
