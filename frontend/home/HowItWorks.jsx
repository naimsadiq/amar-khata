export default function HowItWorks() {
  const steps = [
    {
      n: "১",
      t: "অ্যাকাউন্ট খুলুন",
      d: "ফোন নম্বর দিয়ে ৩০ সেকেন্ডে রেজিস্ট্রেশন। কোনো কাগজপত্র লাগবে না।",
    },
    {
      n: "২",
      t: "দোকান তৈরি করুন",
      d: "আপনার দোকানের নাম ও ধরন দিন। একাধিক দোকান যোগ করতে পারবেন।",
    },
    {
      n: "৩",
      t: "পণ্য ও গ্রাহক যোগ করুন",
      d: "ইনভেন্টরিতে পণ্য এবং গ্রাহকের তথ্য যোগ করুন। এক্সেল থেকে আমদানিও করতে পারবেন।",
    },
    {
      n: "৪",
      t: "হিসাব শুরু করুন",
      d: "বিক্রয় করুন, লেনদেন রেকর্ড করুন এবং রিয়েল-টাইম রিপোর্ট দেখুন।",
    },
  ];

  return (
    <div id="how" className="bg-paper-2 border-y border-paper-3 py-20 md:py-24">
      <div className="max-w-[1200px] mx-auto px-5 md:px-[5vw]">
        <div className="text-center mb-14">
          <div className="text-[12px] font-medium text-brand-d tracking-wider uppercase mb-3">
            কীভাবে কাজ করে
          </div>
          <h2 className="font-serif text-3xl md:text-[42px] text-ink">
            মাত্র ৪টি ধাপে শুরু করুন
          </h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {/* Dashed Line Background (Desktop only) */}
          <div className="hidden lg:block absolute top-7 left-[12%] right-[12%] h-[1px] border-t-2 border-dashed border-paper-3 z-0"></div>

          {steps.map((s, i) => (
            <div key={i} className="text-center px-5 relative z-10">
              <div className="w-14 h-14 mx-auto bg-white border-2 border-brand rounded-full flex items-center justify-center font-mono text-[18px] font-medium text-brand mb-5">
                {s.n}
              </div>
              <h3 className="text-[15px] font-medium text-ink mb-2">{s.t}</h3>
              <p className="text-[13px] text-ink-3 leading-[1.6]">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
