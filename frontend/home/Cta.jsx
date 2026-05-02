import Link from "next/link";

export default function Cta() {
  return (
    <div className="bg-brand-ll border-y border-[#9fe1cb]">
      <div className="max-w-[700px] mx-auto text-center px-5 py-20 md:py-24">
        <h2 className="font-serif text-3xl md:text-5xl text-ink leading-[1.25] mb-4">
          আজই শুরু করুন,
          <br />
          <em className="italic text-brand not-italic">বিনামূল্যে</em>
        </h2>
        <p className="text-[15px] text-ink-3 leading-[1.7] mb-9">
          ৩০ দিনের ফ্রি ট্রায়াল। কোনো ক্রেডিট কার্ড লাগবে না。
          <br />
          সেটআপ মাত্র ৩ মিনিটে।
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link
            href="#"
            className="px-7 py-3 bg-brand border border-brand-d rounded-lg text-[15px] font-medium text-white hover:bg-brand-d transition-all"
          >
            বিনামূল্যে শুরু করুন
          </Link>
          <Link
            href="#"
            className="px-6 py-3 text-[15px] text-ink-2 rounded-lg border border-paper-3 bg-transparent hover:bg-paper-2 transition-all"
          >
            বিক্রয় টিমের সাথে কথা বলুন
          </Link>
        </div>
      </div>
    </div>
  );
}
