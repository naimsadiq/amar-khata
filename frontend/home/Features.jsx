"use client";
import { motion } from "framer-motion";

const features = [
  {
    i: "📒",
    t: "ডিজিটাল লেজার",
    b: "গ্রাহক ও সাপ্লায়ারের সাথে প্রতিটি লেনদেন রেকর্ড করুন। বাকি-পাওনার হিসাব সবসময় আপডেট থাকবে।",
    tag: "Cashbook",
  },
  {
    i: "📦",
    t: "স্টক ম্যানেজমেন্ট",
    b: "প্রতিটি পণ্যের বর্তমান স্টক ট্র্যাক করুন। স্বয়ংক্রিয় কম-স্টক সতর্কতা পাবেন।",
    tag: "Inventory",
  },
  {
    i: "🧾",
    t: "POS ও বিলিং",
    b: "বারকোড স্ক্যান করে দ্রুত বিল তৈরি করুন। প্রিন্টার বা WhatsApp এ পাঠান।",
    tag: "POS",
  },
  {
    i: "👥",
    t: "গ্রাহক ব্যবস্থাপনা",
    b: "প্রতিটি গ্রাহকের পূর্ণ লেনদেন ইতিহাস। বকেয়া আদায়ের জন্য SMS রিমাইন্ডার পাঠান।",
    tag: "CRM",
  },
  {
    i: "📊",
    t: "রিপোর্ট ও বিশ্লেষণ",
    b: "দৈনিক, সাপ্তাহিক ও মাসিক প্রফিট-লস রিপোর্ট। PDF ও Excel এ এক্সপোর্ট করুন।",
    tag: "Reports",
  },
  {
    i: "🏦",
    t: "ব্যাংক ও মোবাইল ব্যাংকিং",
    b: "bKash, Nagad, ব্র্যাক ব্যাংকসহ সব অ্যাকাউন্ট এক জায়গায় দেখুন।",
    tag: "Banking",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="max-w-[1200px] mx-auto px-5 md:px-[5vw] py-20 md:py-24"
    >
      <div className="text-[12px] font-medium text-brand-d tracking-wider uppercase mb-3">
        ফিচারসমূহ
      </div>
      <h2 className="font-serif text-3xl md:text-[42px] leading-[1.25] text-ink mb-4">
        ব্যবসা পরিচালনার সব কিছু
        <br />
        এক অ্যাপে
      </h2>
      <p className="text-[15px] text-ink-3 max-w-[520px] leading-[1.7] mb-14">
        ছোট মুদি দোকান থেকে শুরু করে মাঝারি পাইকারি ব্যবসা — সবার জন্য আলাদা
        আলাদা ফিচার।
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="group bg-white border border-paper-3 rounded-[14px] p-7 relative overflow-hidden transition-all hover:-translate-y-1 hover:border-[#9fe1cb]"
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-11 h-11 rounded-lg bg-brand-l border border-[#9fe1cb] flex items-center justify-center text-xl mb-4">
              {f.i}
            </div>
            <h3 className="text-[16px] font-medium text-ink mb-2">{f.t}</h3>
            <p className="text-[13px] text-ink-3 leading-[1.65] mb-4">{f.b}</p>
            <span className="inline-block text-[11px] text-brand-d bg-brand-ll px-2.5 py-0.5 rounded-full font-mono">
              {f.tag}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
