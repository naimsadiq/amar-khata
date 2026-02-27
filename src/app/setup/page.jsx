"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { User, Building2 } from "lucide-react";

export default function SetupPage() {
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const { completeSetup } = useAuth();

  const handleSubmit = () => {
    if (name && businessName) {
      completeSetup(name, businessName);
    } else {
      alert("Please fill all fields");
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col justify-center max-w-[480px] mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Setup Profile</h1>
      <p className="text-gray-500 mb-8">Complete your profile to continue.</p>

      {/* Name Input */}
      <div className="mb-4 border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-[#10b981] focus-within:ring-1 focus-within:ring-[#10b981] transition-all">
        <User className="text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Your Name"
          className="w-full outline-none text-gray-700"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Business Name Input */}
      <div className="mb-8 border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-[#10b981] focus-within:ring-1 focus-within:ring-[#10b981] transition-all">
        <Building2 className="text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Business Name"
          className="w-full outline-none text-gray-700"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-[#10b981] text-white py-3.5 rounded-xl font-medium shadow-lg hover:bg-[#059669]"
      >
        Complete Setup
      </button>
    </div>
  );
}
