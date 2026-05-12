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
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
      {/* Tab Group — mobile: 2-column grid, lg: single-row flex */}
      <div className="bg-card border border-border rounded-lg p-1 shadow-sm w-full lg:w-auto">
        <div className="grid grid-cols-2 gap-1 lg:flex lg:gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTab(tab)}
              className={`
                px-4 py-2 rounded-md text-[12px] font-semibold whitespace-nowrap text-center
                transition-all duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                ${
                  activeTab === tab
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground bg-transparent hover:bg-muted hover:text-foreground"
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Period Navigator */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => handleNav(-1)}
          disabled={periodIdx === 0}
          className="
            bg-card border border-border rounded-lg w-8 h-8
            flex items-center justify-center text-foreground
            hover:bg-primary/10 hover:border-primary hover:text-primary
            disabled:opacity-40 disabled:pointer-events-none
            transition-all duration-150 text-lg leading-none
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
          "
          aria-label="আগের মাস"
        >
          ‹
        </button>

        <div className="text-sm font-bold min-w-[130px] text-center text-foreground select-none">
          {periods[periodIdx]}
        </div>

        <button
          onClick={() => handleNav(1)}
          disabled={periodIdx === periods.length - 1}
          className="
            bg-card border border-border rounded-lg w-8 h-8
            flex items-center justify-center text-foreground
            hover:bg-primary/10 hover:border-primary hover:text-primary
            disabled:opacity-40 disabled:pointer-events-none
            transition-all duration-150 text-lg leading-none
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
          "
          aria-label="পরের মাস"
        >
          ›
        </button>
      </div>
    </div>
  );
}
