import { mockActivities } from "@/lib/mock-data";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export default function RecentActivity() {
  const getIcon = (type) => {
    if (type === "sale")
      return (
        <div className="w-9 h-9 rounded-full bg-[#e8f5ee] flex justify-center items-center">
          <TrendingUp size={16} className="text-[#1a6b3a]" />
        </div>
      );
    if (type === "purchase")
      return (
        <div className="w-9 h-9 rounded-full bg-[#fff3e0] flex justify-center items-center">
          <TrendingDown size={16} className="text-[#e85d04]" />
        </div>
      );
    return (
      <div className="w-9 h-9 rounded-full bg-[#e3f2fd] flex justify-center items-center">
        <DollarSign size={16} className="text-[#1565c0]" />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-[#d0e4d8] shadow-sm">
      <div className="p-5 border-b border-[#d0e4d8] flex justify-between items-center">
        <span className="text-[15px] font-bold text-[#1a2e1f]">
          সাম্প্রতিক কার্যক্রম
        </span>
        <span className="text-[12px] text-[#1a6b3a] font-semibold cursor-pointer">
          সব দেখুন →
        </span>
      </div>
      <div className="p-6 flex flex-col gap-4">
        {mockActivities.map((act) => (
          <div
            key={act.id}
            className="flex items-center gap-3 border-b border-[#f4f6f4] pb-4 last:border-0 last:pb-0"
          >
            {getIcon(act.type)}
            <div className="flex-1">
              <div className="text-[13.5px] font-semibold text-[#1a2e1f]">
                {act.title}
              </div>
              <div className="text-[12px] text-[#7a9482]">{act.time}</div>
            </div>
            <div
              className={`text-sm font-bold ${act.amount.includes("+") ? "text-[#1a6b3a]" : "text-[#c1121f]"}`}
            >
              {act.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
