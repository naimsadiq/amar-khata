import { useState } from "react";

export default function PeriodSelector({ onToast }) {
  const [activeTab, setActiveTab] = useState("এই মাস");
  const tabs = ["আজ", "এই সপ্তাহ", "এই মাস", "এই বছর", "কাস্টম"];

  const periods = [
    "জানুয়ারি ২০২৬",
    "ফেব্রুয়ারি ২০২৬",
    "মার্চ ২০২৬",
    "এপ্রিল ২০২৬",
    "মে ২০২৬",
    "জুন ২০২৬",
  ];
  const [periodIdx, setPeriodIdx] = useState(3);

  const handleTab = (tab) => {
    setActiveTab(tab);
    onToast(`🗓️ সময়কাল: ${tab}`);
  };

  const handleNav = (dir) => {
    const newIdx = Math.max(0, Math.min(periods.length - 1, periodIdx + dir));
    setPeriodIdx(newIdx);
    onToast(`📅 ${periods[newIdx]}`);
  };

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-[22px] gap-4">
      <div className="flex flex-wrap gap-[4px] bg-white border border-[#e4e8f0] rounded-[8px] p-[4px]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTab(tab)}
            className={`px-[16px] py-[6px] rounded-[6px] text-[12px] font-semibold transition-all ${
              activeTab === tab
                ? "bg-[#1a7f4b] text-white"
                : "text-[#7a8aaa] bg-transparent hover:bg-[#f4f6fb]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-[10px]">
        <button
          onClick={() => handleNav(-1)}
          className="bg-white border border-[#e4e8f0] rounded-[7px] w-[30px] h-[30px] flex items-center justify-center text-[#1a2236] hover:bg-[#e8f5ee] hover:border-[#2ea86b] hover:text-[#2ea86b] transition-all"
        >
          ‹
        </button>
        <div className="text-[14px] font-bold min-w-[130px] text-center text-[#1a2236]">
          {periods[periodIdx]}
        </div>
        <button
          onClick={() => handleNav(1)}
          className="bg-white border border-[#e4e8f0] rounded-[7px] w-[30px] h-[30px] flex items-center justify-center text-[#1a2236] hover:bg-[#e8f5ee] hover:border-[#2ea86b] hover:text-[#2ea86b] transition-all"
        >
          ›
        </button>
      </div>
    </div>
  );
}
