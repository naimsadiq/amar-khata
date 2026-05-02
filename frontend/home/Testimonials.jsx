export default function Testimonials() {
  const reviews = [
    {
      s: "★★★★★",
      q: "আগে প্রতিদিন রাতে ঘণ্টার পর ঘণ্টা হিসাব মেলাতে হতো। এখন এক মিনিটেই সব দেখতে পাই।",
      a: "রক",
      n: "রকিব হাসান",
      l: "মুদি দোকান, রাজশাহী",
      bg: "#1D9E75",
    },
    {
      s: "★★★★★",
      q: "বারকোড স্ক্যান করে বিল করা এখন অনেক সহজ। কাস্টমাররাও খুশি, ভুল কমে গেছে।",
      a: "ফা",
      n: "ফারুক আহমেদ",
      l: "ইলেকট্রনিক্স শপ, ঢাকা",
      bg: "#378ADD",
    },
    {
      s: "★★★★☆",
      q: "SMS রিমাইন্ডার ফিচারটা দারুণ। বকেয়া আদায় আগের চেয়ে অনেক সহজ হয়ে গেছে।",
      a: "না",
      n: "নাসরিন আক্তার",
      l: "কাপড়ের দোকান, চট্টগ্রাম",
      bg: "#BA7517",
    },
  ];

  return (
    <div className="bg-ink py-20 md:py-24 px-5 md:px-[5vw]">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-[12px] text-[#5dcaa5] tracking-wider uppercase mb-3 font-medium">
          ব্যবহারকারীদের কথা
        </div>
        <h2 className="font-serif text-3xl md:text-[38px] text-white mb-12">
          ৫০,০০০ ব্যবসায়ী আমাদের বিশ্বাস করেন
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-2xl p-7"
            >
              <div className="text-[#fac775] text-[13px] tracking-[2px] mb-3">
                {r.s}
              </div>
              <div className="text-[14px] text-white/70 leading-[1.7] italic font-serif mb-5">
                "{r.q}"
              </div>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-medium text-white shrink-0"
                  style={{ backgroundColor: r.bg }}
                >
                  {r.a}
                </div>
                <div>
                  <div className="text-[13px] font-medium text-white">
                    {r.n}
                  </div>
                  <div className="text-[11px] text-white/40">{r.l}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
