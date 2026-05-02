import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-paper-2 border-t border-paper-3 pt-14 pb-8 px-5 md:px-[5vw]">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-5 mb-12">
          <div className="md:col-span-2">
            <div className="font-serif text-[22px] text-ink mb-2.5">
              আমার খাতা
            </div>
            <p className="text-[13px] text-ink-3 leading-[1.7] max-w-[280px] mb-5">
              বাংলাদেশের ছোট ও মাঝারি ব্যবসায়ীদের জন্য সহজ, সাশ্রয়ী ডিজিটাল
              হিসাব-নিকাশ সফটওয়্যার।
            </p>
            <div className="text-[12px] text-ink-4">
              📞 ০১৭০০-০০০০০০ · support@amarkhata.com
            </div>
          </div>

          {[
            {
              t: "প্রোডাক্ট",
              l: [
                "ফিচারসমূহ",
                "মূল্য তালিকা",
                "POS বিলিং",
                "ইনভেন্টরি",
                "রিপোর্ট",
              ],
            },
            {
              t: "সাহায্য",
              l: [
                "ডকুমেন্টেশন",
                "ভিডিও টিউটোরিয়াল",
                "সাধারণ প্রশ্ন",
                "সাপোর্ট",
                "ব্লগ",
              ],
            },
            {
              t: "কোম্পানি",
              l: [
                "আমাদের সম্পর্কে",
                "ক্যারিয়ার",
                "গোপনীয়তা নীতি",
                "ব্যবহারের শর্ত",
                "যোগাযোগ",
              ],
            },
          ].map((col, i) => (
            <div key={i}>
              <div className="text-[12px] font-medium uppercase tracking-wider text-ink-3 mb-3.5">
                {col.t}
              </div>
              <ul className="space-y-2">
                {col.l.map((link, j) => (
                  <li key={j}>
                    <Link
                      href="#"
                      className="text-[13px] text-ink-3 hover:text-brand transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-paper-3 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[12px] text-ink-4">
            © ২০২৬ আমার খাতা। সর্বস্বত্ব সংরক্ষিত। 🇧🇩 বাংলাদেশে তৈরি।
          </div>
          <div className="flex gap-3">
            {["f", "in", "yt"].map((icon, i) => (
              <Link
                key={i}
                href="#"
                className="w-[30px] h-[30px] rounded-md bg-paper-3 flex items-center justify-center text-[13px] text-ink hover:bg-[#9fe1cb] transition-colors"
              >
                {icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
