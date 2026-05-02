export default function SummaryGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition">
        <div className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">
          মোট গ্রাহক
        </div>
        <div className="text-2xl font-semibold text-gray-900 leading-none">
          ৪৮
        </div>
        <div className="text-xs mt-2 text-[#1a7a4a]">↑ ৩ নতুন এই মাসে</div>
      </div>
      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition">
        <div className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">
          মোট সাপ্লায়ার
        </div>
        <div className="text-2xl font-semibold text-gray-900 leading-none">
          ১২
        </div>
        <div className="text-xs mt-2 text-gray-400">মোট ৬০ জন সক্রিয়</div>
      </div>
      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition border-l-4 border-l-[#1a7a4a]">
        <div className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">
          মোট পাওনা
        </div>
        <div className="text-2xl font-semibold text-[#1a7a4a] leading-none">
          ৳৬৬,৮০০
        </div>
        <div className="text-xs mt-2 text-[#c0392b]">↓ ৫ জনের বকেয়া বাকি</div>
      </div>
      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition border-l-4 border-l-[#c0392b]">
        <div className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">
          মোট দেনা
        </div>
        <div className="text-2xl font-semibold text-[#c0392b] leading-none">
          ৳২৩,৭৮০
        </div>
        <div className="text-xs mt-2 text-gray-400">৩ জন সাপ্লায়ার</div>
      </div>
    </div>
  );
}
