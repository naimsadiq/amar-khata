import { Edit2, CheckCircle2 } from "lucide-react";

export default function ProfileCard({ profileData }) {
  if (!profileData) return null;

  return (
    <div className="bg-white rounded-xl border border-[#d0e4d8] shadow-sm overflow-hidden mb-4">
      <div className="flex flex-col items-center p-8 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-[#1a6b3a] to-[#2d9653] rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 border-4 border-[#e8f5ee] relative">
          {profileData.name ? profileData.name.charAt(0).toUpperCase() : "U"}

          <div className="absolute bottom-0 right-0 w-7 h-7 bg-[#1a6b3a] rounded-full flex items-center justify-center cursor-pointer border-2 border-white">
            <Edit2 size={12} className="text-white" />
          </div>
        </div>

        <div className="text-lg font-bold text-[#1a2e1f]">
          {profileData.name}
        </div>
        <div className="text-[13px] font-medium text-[#4a6350] mt-1">
          {profileData.businessName}{" "}
          <span className="text-[#7a9482]">({profileData.businessId})</span>
        </div>
        <div className="text-[12px] text-[#7a9482] mt-1">
          {profileData.email}
        </div>

        {profileData.isVerified && (
          <div className="inline-flex items-center gap-1 bg-[#e8f5ee] text-[#1a6b3a] text-[11px] font-semibold px-3 py-1 rounded-full mt-3">
            <CheckCircle2 size={12} /> যাচাইকৃত অ্যাকাউন্ট
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-[1px] bg-[#d0e4d8] border-t border-[#d0e4d8]">
        {[
          { label: "মোট বিক্রয়", val: profileData.stats?.totalSales },
          { label: "গ্রাহক সংখ্যা", val: profileData.stats?.customers },
          { label: "পণ্য মজুদ", val: profileData.stats?.inventory },
          { label: "কাশবুক পেন্ডিং", val: profileData.stats?.pendingCash },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-3 text-center">
            <div className="text-lg font-bold text-[#1a6b3a]">{stat.val}</div>
            <div className="text-[11px] text-[#7a9482] mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
