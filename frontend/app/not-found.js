import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6 font-sans relative overflow-hidden">
      {/* ব্যাকগ্রাউন্ড ডেকোরেশন শেপস */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
      </div>

      <div className="max-w-3xl w-full text-center relative z-10">
        {/* মডার্ন ভিজ্যুয়াল সেকশন */}
        <div className="relative flex flex-col items-center justify-center mb-10">
          {/* বড় ৪-০-৪ ব্যাকগ্রাউন্ড টেক্সট */}
          <span className="text-[120px] md:text-[220px] font-black text-emerald-500/10 leading-none select-none">
            404
          </span>

          {/* সেন্ট্রাল আইকন/ইলস্ট্রেশন কার্ড */}
          <div className="absolute bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-emerald-200/40 border border-emerald-50 transform hover:scale-105 transition-transform duration-500 cursor-default">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-emerald-50 rounded-3xl flex items-center justify-center mb-4 mx-auto">
              <svg
                className="w-12 h-12 text-emerald-500 animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-emerald-600 font-bold text-lg">
              হিসাব পাওয়া যায়নি!
            </p>
          </div>
        </div>

        {/* টেক্সট কন্টেন্ট */}
        <div className="space-y-4 md:mt-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 tracking-tight">
            দুঃখিত, পাতাটি খুঁজে পাওয়া যায়নি
          </h2>
          <p className="text-lg text-slate-500 max-w-lg mx-auto leading-relaxed">
            হয়তো লিংকটি ভুল ছিল অথবা পাতাটি সরিয়ে ফেলা হয়েছে। আপনার ডিজিটাল
            হিসাব নিকাশ পুনরায় শুরু করতে নিচে ক্লিক করুন।
          </p>
        </div>

        {/* বাটন সেকশন */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link
            href="/"
            className="w-full sm:w-auto px-10 py-4 bg-[#10b981] text-white rounded-2xl font-bold text-lg shadow-[0_15px_30px_-10px_rgba(16,185,129,0.4)] hover:bg-[#0da371] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            হোম পেজে ফিরে যান
          </Link>

          <Link
            href="/contact"
            className="w-full sm:w-auto px-10 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex items-center justify-center gap-3"
          >
            সহযোগিতা প্রয়োজন?
          </Link>
        </div>

        {/* কুইক নেভিগেশন ফুটার */}
        <div className="mt-20 pt-8 border-t border-slate-200/50 flex flex-wrap justify-center gap-8 text-sm font-semibold text-slate-400">
          <Link
            href="/features"
            className="hover:text-emerald-500 transition-colors uppercase tracking-wider"
          >
            ফিচারসমূহ
          </Link>
          <Link
            href="/pricing"
            className="hover:text-emerald-500 transition-colors uppercase tracking-wider"
          >
            মূল্য তালিকা
          </Link>
          <Link
            href="/help"
            className="hover:text-emerald-500 transition-colors uppercase tracking-wider"
          >
            সাহায্য
          </Link>
          <Link
            href="/blog"
            className="hover:text-emerald-500 transition-colors uppercase tracking-wider"
          >
            ব্লগ
          </Link>
        </div>
      </div>
    </div>
  );
}
