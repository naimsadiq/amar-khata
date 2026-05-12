export default function ReportHeader({ date, onToast }) {
  return (
    <div className="bg-card border-b border-border px-4 md:px-8 py-3 flex flex-col md:flex-row items-start md:items-center justify-between sticky top-0 z-50 gap-3 md:gap-0">
      <div>
        <h1 className="text-lg font-bold text-foreground">
          রিপোর্ট ও বিশ্লেষণ
        </h1>
        <div className="text-xs text-muted-foreground mt-0.5">{date}</div>
      </div>
      <div className="flex gap-2 w-full md:w-auto">
        <button
          onClick={() => onToast("🖨️ প্রিন্ট প্রিভিউ খুলছে...")}
          className="flex-1 md:flex-none px-4 py-2 rounded-md bg-background border border-border text-foreground text-xs font-semibold hover:bg-accent hover:text-accent-foreground transition-all"
        >
          🖨️ প্রিন্ট
        </button>
        <button
          onClick={() => onToast("⬇️ রিপোর্ট ডাউনলোড হচ্ছে...")}
          className="flex-1 md:flex-none px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-sm"
        >
          ⬇ ডাউনলোড PDF
        </button>
      </div>
    </div>
  );
}
