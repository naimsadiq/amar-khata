export default function Pricing() {
  return (
    <section
      id="pricing"
      className="max-w-[1200px] mx-auto px-5 md:px-[5vw] py-20 md:py-24"
    >
      <div className="text-center mb-14">
        <div className="text-[12px] font-medium text-brand-d tracking-wider uppercase mb-3">
          মূল্য তালিকা
        </div>
        <h2 className="font-serif text-3xl md:text-[42px] text-ink mb-3">
          আপনার বাজেট অনুযায়ী বেছে নিন
        </h2>
        <p className="text-[14px] text-ink-3">
          সব প্ল্যানে ৩০ দিনের ফ্রি ট্রায়াল। কোনো ক্রেডিট কার্ড লাগবে না।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-[900px] mx-auto">
        {/* Basic */}
        <div className="bg-white border border-paper-3 rounded-2xl p-8 transition-all hover:shadow-md">
          <div className="text-[13px] text-ink-3 mb-2 font-medium uppercase tracking-wider">
            বেসিক
          </div>
          <div className="font-mono text-4xl text-ink leading-none mb-1">
            বিনামূল্যে
          </div>
          <div className="text-[12px] text-ink-4 mb-6">সবসময়ের জন্য ফ্রি</div>
          <ul className="space-y-3 mb-7">
            {["১টি দোকান", "মাসে ১০০ লেনদেন", "৫০টি পণ্য", "বেসিক রিপোর্ট"].map(
              (f, i) => (
                <li
                  key={i}
                  className="text-[13px] text-ink-2 flex gap-2 border-b border-paper-2 pb-2"
                >
                  <span className="text-brand font-bold">✓</span>
                  {f}
                </li>
              ),
            )}
            {["POS বিলিং", "SMS রিমাইন্ডার"].map((f, i) => (
              <li
                key={i}
                className="text-[13px] text-ink-4 flex gap-2 border-b border-paper-2 pb-2"
              >
                <span className="text-paper-3">—</span>
                {f}
              </li>
            ))}
          </ul>
          <button className="w-full py-2.5 rounded-lg text-[14px] font-medium border border-paper-3 bg-paper-2 text-ink-2 hover:bg-paper-3 transition-colors">
            বিনামূল্যে শুরু করুন
          </button>
        </div>

        {/* Pro */}
        <div className="bg-white border-2 border-brand rounded-2xl p-8 relative shadow-lg">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand text-white text-[11px] font-medium px-3.5 py-1 rounded-full">
            সবচেয়ে জনপ্রিয়
          </div>
          <div className="text-[13px] text-ink-3 mb-2 font-medium uppercase tracking-wider">
            প্রো
          </div>
          <div className="font-mono text-4xl text-brand leading-none mb-1">
            ৳<span className="text-ink">৪৯৯</span>
          </div>
          <div className="text-[12px] text-ink-4 mb-6">প্রতি মাসে</div>
          <ul className="space-y-3 mb-7">
            {[
              "৩টি দোকান",
              "সীমাহীন লেনদেন",
              "সীমাহীন পণ্য",
              "সম্পূর্ণ রিপোর্ট",
              "POS বিলিং",
              "মাসে ৫০ SMS",
            ].map((f, i) => (
              <li
                key={i}
                className="text-[13px] text-ink-2 flex gap-2 border-b border-paper-2 pb-2"
              >
                <span className="text-brand font-bold">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <button className="w-full py-2.5 rounded-lg text-[14px] font-medium bg-brand text-white border border-brand-d hover:bg-brand-d transition-colors">
            প্রো প্ল্যান বেছে নিন
          </button>
        </div>

        {/* Enterprise */}
        <div className="bg-white border border-paper-3 rounded-2xl p-8 transition-all hover:shadow-md">
          <div className="text-[13px] text-ink-3 mb-2 font-medium uppercase tracking-wider">
            এন্টারপ্রাইজ
          </div>
          <div className="font-mono text-4xl text-brand leading-none mb-1">
            ৳<span className="text-ink">৯৯৯</span>
          </div>
          <div className="text-[12px] text-ink-4 mb-6">প্রতি মাসে</div>
          <ul className="space-y-3 mb-7">
            {[
              "সীমাহীন দোকান",
              "সীমাহীন সব কিছু",
              "স্টাফ ম্যানেজমেন্ট",
              "কাস্টম রিপোর্ট",
              "সীমাহীন SMS",
              "ডেডিকেটেড সাপোর্ট",
            ].map((f, i) => (
              <li
                key={i}
                className="text-[13px] text-ink-2 flex gap-2 border-b border-paper-2 pb-2"
              >
                <span className="text-brand font-bold">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <button className="w-full py-2.5 rounded-lg text-[14px] font-medium border border-paper-3 bg-paper-2 text-ink-2 hover:bg-paper-3 transition-colors">
            এন্টারপ্রাইজ বেছে নিন
          </button>
        </div>
      </div>
    </section>
  );
}
