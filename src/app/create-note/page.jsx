"use client"; 
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { ArrowLeft } from 'lucide-react';

export default function CreateNote() {
  const router = useRouter();

  const [remindDate, setRemindDate] = useState("");
  const [remindTime, setRemindTime] = useState("");

  useEffect(() => {
    // setTimeout ব্যবহার করে আপডেটটি পরবর্তী ইভেন্ট লুপে পাঠানো হলো
    // এতে "Synchronous Update" এররটি চলে যাবে
    const timer = setTimeout(() => {
      const now = new Date();
      
      // তারিখ ফরম্যাট (YYYY-MM-DD)
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      // সময় ফরম্যাট (HH:mm)
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const formattedTime = `${hours}:${minutes}`;

      setRemindDate(formattedDate);
      setRemindTime(formattedTime);
    }, 0);

    // ক্লিনআপ ফাংশন
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    console.log("Saving Note:", { date: remindDate, time: remindTime });
    // এখানে আপনার সেভ করার লজিক থাকবে
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
      
      {/* Mobile Frame */}
      <div className="w-full max-w-[480px] bg-white h-[100dvh] sm:h-[90vh] shadow-2xl relative flex flex-col overflow-hidden sm:rounded-2xl">
        
        {/* Header Section */}
        <div className="bg-[#10b981] text-white px-4 py-4 flex items-center gap-4 shadow-sm shrink-0">
          <button 
            onClick={() => router.back()} 
            className="p-1 -ml-1 rounded-full hover:bg-white/20 transition-colors active:scale-95"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium">Create Note</h1>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto flex flex-col px-4 py-6 gap-6 bg-white">
          <input
            type="text"
            placeholder="Title"
            className="w-full border border-gray-300 rounded-xl px-5 py-3.5 outline-none focus:border-[#10b981] transition-colors text-gray-800 placeholder-gray-400"
          />

          <input
            type="text"
            placeholder="Description (Optional)"
            className="w-full border border-gray-300 rounded-xl px-5 py-3.5 outline-none focus:border-[#10b981] transition-colors text-gray-800 placeholder-gray-400"
          />

          <input
            type="number"
            placeholder="Amount (৳)"
            className="w-full border border-gray-300 rounded-xl px-5 py-3.5 outline-none focus:border-[#10b981] transition-colors text-gray-800 placeholder-gray-400"
          />

          {/* Date and Time Row */}
          <div className="flex gap-4 pt-1">
            
            {/* Date Picker */}
            <div className="relative flex-1">
              <label className="absolute -top-2.5 left-4 bg-white px-1 text-[12px] text-gray-400 z-10">
                Remind Date
              </label>
              <input
                type="date"
                value={remindDate}
                onChange={(e) => setRemindDate(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3.5 outline-none focus:border-[#10b981] transition-colors text-gray-800 bg-transparent uppercase"
              />
            </div>

            {/* Time Picker */}
            <div className="relative flex-1">
              <label className="absolute -top-2.5 left-4 bg-white px-1 text-[12px] text-gray-400 z-10">
                Remind Time
              </label>
              <input
                type="time"
                value={remindTime}
                onChange={(e) => setRemindTime(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3.5 outline-none focus:border-[#10b981] transition-colors text-gray-800 bg-transparent uppercase"
              />
            </div>

          </div>
        </div>

        {/* Bottom Save Button */}
        <div className="px-4 pb-6 pt-4 bg-white shrink-0 border-t border-gray-50">
          <button 
            onClick={handleSave}
            className="w-full bg-[#10b981] text-white py-[14px] rounded-xl font-medium text-[16px] shadow-sm hover:bg-[#0e9f6e] active:scale-[0.98] transition-all"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}