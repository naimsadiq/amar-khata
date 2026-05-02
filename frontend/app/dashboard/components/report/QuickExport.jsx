export default function QuickExport({ summary, onToast }) {
  const exports = [
    {
      icon: "📊",
      title: "বিক্রয় রিপোর্ট",
      sub: "Excel / PDF",
      msg: "📊 বিক্রয় রিপোর্ট ডাউনলোড হচ্ছে...",
    },
    {
      icon: "💰",
      title: "লাভ-ক্ষতি",
      sub: "মাসিক সারসংক্ষেপ",
      msg: "💰 লাভ-ক্ষতি রিপোর্ট ডাউনলোড হচ্ছে...",
    },
    {
      icon: "👥",
      title: "গ্রাহক রিপোর্ট",
      sub: "বকেয়া সহ",
      msg: "👥 গ্রাহক রিপোর্ট ডাউনলোড হচ্ছে...",
    },
    {
      icon: "📦",
      title: "স্টক রিপোর্ট",
      sub: "ইনভেন্টরি",
      msg: "📦 স্টক রিপোর্ট ডাউনলোড হচ্ছে...",
    },
    {
      icon: "💸",
      title: "বেতন রিপোর্ট",
      sub: "স্টাফ বিবরণী",
      msg: "💸 বেতন রিপোর্ট ডাউনলোড হচ্ছে...",
    },
    {
      icon: "🏦",
      title: "ব্যাংক বিবরণী",
      sub: "সকল অ্যাকাউন্ট",
      msg: "🏦 ব্যাংক রিপোর্ট ডাউনলোড হচ্ছে...",
    },
  ];

  return (
    <div className="flex flex-col gap-[16px]">
      {/* Export Card */}
      <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(26,34,54,0.07)] border border-[#e4e8f0] p-[20px]">
        <div className="text-[14px] font-bold mb-[14px] text-[#1a2236]">
          📥 রিপোর্ট ডাউনলোড করুন
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
          {exports.map((ex, i) => (
            <button
              key={i}
              onClick={() => onToast(ex.msg)}
              className="p-[12px_10px] rounded-[10px] border border-[#e4e8f0] bg-[#f4f6fb] flex items-center gap-[8px] text-left hover:bg-[#e8f5ee] hover:border-[#2ea86b] hover:text-[#2ea86b] transition-all text-[#1a2236]"
            >
              <span className="text-[18px]">{ex.icon}</span>
              <div>
                <div className="text-[12px] font-semibold">{ex.title}</div>
                <div className="text-[10px] text-[#7a8aaa] mt-[2px] font-normal">
                  {ex.sub}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Monthly Summary Mini Card */}
      <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(26,34,54,0.07)] border border-[#e4e8f0] p-[20px]">
        <div className="text-[14px] font-bold mb-[12px] text-[#1a2236]">
          📅 মাসিক তুলনা
        </div>
        <div className="flex flex-col gap-[10px]">
          <div className="flex justify-between items-center text-[12px]">
            <span className="text-[#7a8aaa]">{summary.prevMonth}</span>
            <span className="font-bold text-[#1a2236]">
              {summary.prevTotal}
            </span>
          </div>
          <div className="flex justify-between items-center text-[12px]">
            <span className="text-[#7a8aaa]">{summary.currMonth}</span>
            <span className="font-bold text-[#2ea86b]">
              {summary.currTotal} ↑
            </span>
          </div>
          <div className="bg-[#e8f5ee] rounded-[8px] p-[10px] text-center mt-1">
            <div className="text-[11px] text-[#7a8aaa]">প্রবৃদ্ধি</div>
            <div className="text-[20px] font-bold text-[#2ea86b]">
              {summary.growth}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
