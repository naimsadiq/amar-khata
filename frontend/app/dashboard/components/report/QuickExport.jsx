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
    <div className="flex flex-col gap-4">
      {/* Export Card */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-5">
        <div className="text-sm font-bold mb-4 text-foreground">
          📥 রিপোর্ট ডাউনলোড করুন
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {exports.map((ex, i) => (
            <button
              key={i}
              onClick={() => onToast(ex.msg)}
              className="p-3 rounded-lg border border-border bg-background flex items-center gap-3 text-left hover:border-primary hover:text-primary hover:bg-primary/5 transition-all group"
            >
              <span className="text-xl">{ex.icon}</span>
              <div>
                <div className="text-xs font-semibold text-foreground group-hover:text-primary">
                  {ex.title}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5 font-normal">
                  {ex.sub}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Monthly Summary Mini Card */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-5">
        <div className="text-sm font-bold mb-4 text-foreground">
          📅 মাসিক তুলনা
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">{summary.prevMonth}</span>
            <span className="font-bold text-foreground">
              {summary.prevTotal}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">{summary.currMonth}</span>
            <span className="font-bold text-primary">
              {summary.currTotal} ↑
            </span>
          </div>
          <div className="bg-primary/10 rounded-lg p-3 text-center mt-1 border border-primary/20">
            <div className="text-[11px] text-muted-foreground">প্রবৃদ্ধি</div>
            <div className="text-lg font-bold text-primary">
              {summary.growth}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
