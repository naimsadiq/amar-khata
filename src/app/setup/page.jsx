"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { User, Building2 } from "lucide-react";
// import toast from "react-hot-toast";

export default function SetupPage() {
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const { completeSetup } = useAuth();

  const handleSubmit = () => {
    if (name && businessName) {
      completeSetup(name, businessName);
    } else {
      // toast.error("Please fill all fields");
    }
  };

  return (
    <div className="min-h-screen bg-[#f2fcf6] sm:bg-[#f0f2f5] flex items-center justify-center font-sans relative overflow-hidden">
      <div className="hidden sm:block absolute top-0 w-full h-48 bg-[#10b981]"></div>

      <div className="w-full max-w-[480px] bg-white h-screen sm:h-auto sm:rounded-2xl sm:shadow-2xl p-6 sm:p-10 flex flex-col justify-center z-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Setup Profile</h1>
        <p className="text-gray-500 mb-8">Complete your profile to continue.</p>

        {/* Name Input */}
        <div className="mb-4 border border-gray-200 rounded-xl px-4 py-3.5 flex items-center gap-3 focus-within:border-[#10b981] focus-within:ring-1 focus-within:ring-[#10b981] transition-all bg-white">
          <User className="text-gray-400 w-5 h-5 shrink-0" />
          <input
            type="text"
            placeholder="Your Name"
            className="w-full outline-none text-gray-700 bg-transparent"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Business Name Input */}
        <div className="mb-8 border border-gray-200 rounded-xl px-4 py-3.5 flex items-center gap-3 focus-within:border-[#10b981] focus-within:ring-1 focus-within:ring-[#10b981] transition-all bg-white">
          <Building2 className="text-gray-400 w-5 h-5 shrink-0" />
          <input
            type="text"
            placeholder="Business Name"
            className="w-full outline-none text-gray-700 bg-transparent"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-[#10b981] text-white py-[14px] rounded-xl font-medium shadow-sm hover:bg-[#0e9f6e] transition-colors active:scale-[0.98]"
        >
          Complete Setup
        </button>
      </div>
    </div>
  );
}
