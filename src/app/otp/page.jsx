"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { KeyRound, AlertCircle } from "lucide-react"; // AlertCircle আইকন ইমপোর্ট করা হলো

export default function OtpPage() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(""); // এরর মেসেজ রাখার জন্য স্টেট
  const { verifyOtp, tempPhone } = useAuth();

  const handleVerify = () => {
    if (otp.length === 6) {
      setError(""); // সব ঠিক থাকলে এরর ক্লিয়ার
      verifyOtp(otp); // Context এর ফাংশন কল হবে
    } else {
      setError("Please enter a valid 6-digit code"); // এরর সেট করা
    }
  };

  return (
    <div className="min-h-screen bg-[#f2fcf6] flex items-center justify-center">
      <div className="w-full max-w-[400px] p-6 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Phone</h2>
        <p className="text-gray-500 text-center mb-8">
          We sent a code to{" "}
          <span className="font-semibold text-[#10b981]">{tempPhone}</span>
        </p>

        <div className="relative w-full mb-8">
          <label className="absolute -top-[10px] left-4 bg-[#f2fcf6] px-1 text-[13px] text-gray-400 z-10">
            OTP Code
          </label>

          {/* Input Container: এরর থাকলে বর্ডার লাল হবে */}
          <div
            className={`relative flex items-center w-full border rounded-xl px-4 py-[14px] bg-transparent transition-colors duration-200 ${
              error
                ? "border-red-500 ring-1 ring-red-500/20" // এরর স্টাইল
                : "border-[#10b981]" // নরমাল স্টাইল
            }`}
          >
            <KeyRound
              className={`${
                error ? "text-red-400" : "text-gray-400"
              } w-5 h-5 mr-3 shrink-0 transition-colors`}
              strokeWidth={1.5}
            />
            <input
              type="number"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                if (error) setError(""); // ইউজার টাইপ করা শুরু করলে এরর মুছে যাবে
              }}
              placeholder="123456"
              className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-300 text-[16px] tracking-widest"
              maxLength={6}
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
          onClick={handleVerify}
          className="w-full bg-[#10b981] text-white py-[14px] rounded-xl font-medium shadow-sm hover:bg-[#059669] transition-colors active:scale-[0.98]"
        >
          Verify & Login
        </button>
      </div>
    </div>
  );
}
