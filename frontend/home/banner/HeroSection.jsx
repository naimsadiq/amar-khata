"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="px-5 md:px-[5vw] py-16 md:py-24 max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-[60px] items-center">
      <div>
        <div className="inline-flex items-center gap-2 text-[12px] font-medium text-brand-d bg-brand-ll border border-[#9fe1cb] px-3 py-1 rounded-full mb-6 tracking-wide">
          <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></div>
          বাংলাদেশের ব্যবসায়ীদের জন্য
        </div>
        <h1 className="font-serif text-4xl md:text-[58px] leading-[1.2] text-ink mb-5">
          আপনার দোকানের <em className="italic text-brand not-italic">সব হিসাব</em><br />এক জায়গায়
        </h1>
        <p className="text-[16px] text-ink-3 leading-[1.75] mb-9 max-w-[440px]">
          গ্রাহকের বাকি, মালের স্টক, দৈনিক বিক্রয় — সব কিছু এখন আপনার হাতের মুঠোয়। কাগজের খাতা ছাড়ুন, ডিজিটাল হিসাব রাখুন।
        </p>
        <div className="flex flex-wrap gap-3 items-center">
          <Link href="#" className="px-7 py-3 bg-brand border border-brand-d rounded-lg text-[15px] font-medium text-white hover:bg-brand-d transition-all">বিনামূল্যে ৩০ দিন চেষ্টা করুন</Link>
          <Link href="#" className="px-6 py-3 text-[15px] text-ink-2 rounded-lg border border-paper-3 hover:bg-paper-2 transition-all">ডেমো দেখুন ▶</Link>
        </div>
        <p className="mt-4 text-[12px] text-ink-4 flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 bg-brand-l border-2 border-[#9fe1cb] rounded-full inline-block"></span>
          ক্রেডিট কার্ড লাগবে না · যেকোনো সময় বাতিল করুন
        </p>
      </div>

      <div className="relative mt-10 md:mt-0">
        {/* Float Badge 1 */}
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute -top-5 -right-5 bg-white border border-paper-3 rounded-xl p-2 md:p-3 flex items-center gap-2 shadow-sm z-20">
          <div className="w-6 h-6 rounded-md bg-brand-l flex items-center justify-center text-xs text-brand-d">✓</div>
          <div className="text-[11px] text-ink-2 font-medium">আজকের বিক্রয়</div>
          <div className="text-[12px] font-mono text-brand font-medium">৳৩৮,৪৫০</div>
        </motion.div>

        {/* Float Badge 2 */}
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1.5 }} className="absolute bottom-8 -left-6 bg-white border border-paper-3 rounded-xl p-2 md:p-3 flex items-center gap-2 shadow-sm z-20 hidden md:flex">
          <div className="w-6 h-6 rounded-md bg-amber-l flex items-center justify-center text-xs text-amber">⚠</div>
          <div className="text-[11px] text-ink-2 font-medium">কম স্টক সতর্কতা</div>
          <div className="text-[12px] font-mono text-brand font-medium text-amber">৩টি পণ্য</div>
        </motion.div>

        {/* Dashboard Mock */}
        <div className="bg-white border border-paper-3 rounded-[14px] shadow-2xl overflow-hidden relative z-10">
          <div className="bg-paper-2 border-b border-paper-3 px-4 py-2.5 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#e24b4a]"></div>
            <div className="w-2 h-2 rounded-full bg-[#ba7517]"></div>
            <div className="w-2 h-2 rounded-full bg-[#1D9E75]"></div>
            <div className="ml-2 text-[11px] text-ink-3 font-mono">আমার খাতা — রহিম স্টোর</div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              {[{l:"মোট ব্যালেন্স", v:"৳১,৪৫,২৩০", c:"text-brand"}, {l:"মোট পাওনা", v:"৳৬৮,৪০০", c:"text-red"}, {l:"হাতে নগদ", v:"৳৩২,৫৫০", c:"text-ink"}, {l:"মোট দেনা", v:"৳২৩,৭৮০", c:"text-ink"}].map((c, i) => (
                <div key={i} className="bg-paper-2 rounded-lg p-3 border border-paper-3">
                  <div className="text-[10px] text-ink-3 mb-1">{c.l}</div>
                  <div className={`text-[18px] font-semibold font-mono ${c.c}`}>{c.v}</div>
                </div>
              ))}
            </div>
            <div className="text-[10px] text-ink-3 mb-2 font-medium uppercase tracking-wider">সাম্প্রতিক লেনদেন</div>
            {[
              { n:"করিম মিয়া", s:"বকেয়া পরিশোধ", a:"+৳৫,০০০", in:true },
              { n:"আলম ট্রেডার্স", s:"মাল ক্রয়", a:"-৳১২,৫০০", in:false },
              { n:"POS বিল #১০৪৫", s:"নগদ বিক্রয়", a:"+৳৩,২৮০", in:true },
            ].map((tx, i) => (
              <div key={i} className="flex items-center gap-2 py-2 border-b border-paper-2 last:border-0">
                <div className={`w-7 h-7 rounded-md flex items-center justify-center text-[11px] ${tx.in ? 'bg-brand-l text-brand-d' : 'bg-red-l text-red'}`}>{tx.in ? '↑' : '↓'}</div>
                <div>
                  <div className="text-[11px] text-ink font-medium">{tx.n}</div>
                  <div className="text-[9px] text-ink-4">{tx.s}</div>
                </div>
                <div className={`ml-auto text-[11px] font-semibold font-mono ${tx.in ? 'text-brand' : 'text-red'}`}>{tx.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}