"use client";
import { useState } from "react";

export default function Faq() {
  const faqs = [
    {
      q: "আমার ইন্টারনেট না থাকলে কি কাজ করবে?",
      a: "হ্যাঁ, আমার খাতার অফলাইন মোড আছে। ইন্টারনেট ছাড়াও ডেটা সেভ হবে এবং পরে সংযুক্ত হলে স্বয়ংক্রিয়ভাবে সিঙ্ক হবে।",
    },
    {
      q: "একই সাথে কতজন স্টাফ ব্যবহার করতে পারবে?",
      a: "প্রো প্ল্যানে ৩ জন এবং এন্টারপ্রাইজ প্ল্যানে সীমাহীন স্টাফ একই সময়ে ব্যবহার করতে পারবেন। প্রতিটির জন্য আলাদা পারমিশন সেট করা যাবে।",
    },
    {
      q: "আমার ডেটা কি নিরাপদ?",
      a: "সম্পূর্ণ নিরাপদ। আপনার সব ডেটা এনক্রিপ্টেড এবং বাংলাদেশ সরকারের অনুমোদিত ক্লাউড সার্ভারে সংরক্ষিত। প্রতিদিন স্বয়ংক্রিয় ব্যাকআপ হয়।",
    },
    {
      q: "পুরানো Excel/কাগজের হিসাব কি আনতে পারব?",
      a: "হ্যাঁ। Excel বা CSV ফাইল দিয়ে পণ্যের তালিকা এবং গ্রাহকের তথ্য সরাসরি আমদানি করতে পারবেন। আমাদের সাপোর্ট টিম প্রয়োজনে সাহায্য করবে।",
    },
    {
      q: "সাবস্ক্রিপশন বাতিল করলে কি হবে?",
      a: "যেকোনো সময় বাতিল করতে পারবেন। বাতিল করলে বেসিক প্ল্যানে চলে যাবেন এবং আপনার সব ডেটা ৯০ দিন পর্যন্ত সুরক্ষিত থাকবে।",
    },
  ];

  
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="max-w-[700px] mx-auto px-5 py-20 md:py-24">
      <div className="text-center mb-12">
        <div className="text-[12px] font-medium text-brand-d tracking-wider uppercase mb-3">
          সাধারণ প্রশ্ন
        </div>
        <h2 className="font-serif text-3xl md:text-[42px] text-ink">
          যা জানতে চান
        </h2>
      </div>

      <div className="w-full">
        {faqs.map((f, i) => {
          const isOpen = openIndex === i;

          return (
            <div
              key={i}
              className="border-b border-paper-3 cursor-pointer"
              onClick={() => toggleFaq(i)}
            >
              {/* Question Header */}
              <div className="flex justify-between items-center py-5 gap-4 select-none">
                <span className="text-[15px] font-medium text-ink">{f.q}</span>
                <div
                  className={`w-[22px] h-[22px] rounded-full bg-paper-2 flex items-center justify-center text-[14px] text-ink-3 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-45" : ""}`}
                >
                  +
                </div>
              </div>

              {/* Answer Content (Animated with Tailwind max-height) */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen
                    ? "max-h-[200px] pb-[18px] opacity-100"
                    : "max-h-0 pb-0 opacity-0"
                }`}
              >
                <p className="text-[14px] text-ink-3 leading-[1.7]">{f.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
