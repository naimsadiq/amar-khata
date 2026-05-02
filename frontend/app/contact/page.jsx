"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, MessageCircle, Send } from "lucide-react";
import Navbar from "@/home/navbar/Navbar";
import Footer from "@/home/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // এখানে আপনার API কল বা ফর্ম সাবমিট লজিক বসবে
    console.log("Form Submitted:", formData);
    alert("আপনার মেসেজটি সফলভাবে পাঠানো হয়েছে। আমরা শীঘ্রই যোগাযোগ করবো!");
    setFormData({ name: "", phone: "", subject: "", message: "" });
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-paper pb-20 md:pb-24">
        {/* Header Section */}
        <div className="bg-paper-2 border-b border-paper-3 py-16 md:py-20 px-5 text-center">
          <div className="max-w-[700px] mx-auto">
            <div className="text-[12px] font-medium text-brand-d tracking-wider uppercase mb-3">
              যোগাযোগ
            </div>
            <h1 className="font-serif text-3xl md:text-[46px] text-ink mb-4 leading-tight">
              আমাদের সাথে কথা বলুন
            </h1>
            <p className="text-[15px] text-ink-3 leading-[1.7]">
              আপনার ব্যবসার জন্য 'আমার খাতা' কীভাবে সাহায্য করতে পারে তা জানতে
              বা যেকোনো প্রযুক্তিগত সহায়তার জন্য আমাদের সাথে যোগাযোগ করুন।
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-[1200px] mx-auto px-5 md:px-[5vw] pt-12 md:pt-16 grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-16">
          {/* Left Side - Contact Info */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h3 className="font-serif text-2xl text-ink mb-6">
                যোগাযোগের মাধ্যম
              </h3>

              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-lg bg-brand-l border border-[#9fe1cb] flex items-center justify-center text-brand shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-ink-3 uppercase tracking-wider mb-1">
                      হটলাইন (সকাল ৯টা - রাত ১০টা)
                    </div>
                    <div className="text-[18px] font-medium text-ink font-mono">
                      ০১৭০০-০০০০০০
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-lg bg-brand-l border border-[#9fe1cb] flex items-center justify-center text-brand shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-ink-3 uppercase tracking-wider mb-1">
                      ইমেইল সাপোর্ট
                    </div>
                    <div className="text-[16px] font-medium text-ink">
                      support@amarkhata.com
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-lg bg-brand-l border border-[#9fe1cb] flex items-center justify-center text-brand shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-ink-3 uppercase tracking-wider mb-1">
                      অফিস ঠিকানা
                    </div>
                    <div className="text-[15px] text-ink leading-relaxed">
                      লেভেল ৪, টেক পার্ক ভবন,
                      <br />
                      কারওয়ান বাজার, ঢাকা ১২১৫,
                      <br />
                      বাংলাদেশ।
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-[#f0faf6] border border-[#9fe1cb] rounded-xl p-6 mt-8">
              <div className="flex items-center gap-3 mb-3">
                <MessageCircle className="text-brand" size={24} />
                <h4 className="font-medium text-ink text-lg">
                  WhatsApp সাপোর্ট
                </h4>
              </div>
              <p className="text-[14px] text-ink-3 mb-4 leading-relaxed">
                দ্রুত সমাধানের জন্য আমাদের WhatsApp নম্বরে সরাসরি মেসেজ দিন।
              </p>
              <a
                href="#"
                className="inline-flex w-full justify-center items-center gap-2 bg-[#25D366] hover:bg-[#1EBE59] text-white font-medium py-2.5 rounded-lg transition-colors"
              >
                WhatsApp এ মেসেজ দিন
              </a>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="md:col-span-3">
            <div className="bg-white border border-paper-3 rounded-2xl p-6 md:p-10 shadow-sm">
              <h3 className="font-serif text-2xl text-ink mb-2">মেসেজ পাঠান</h3>
              <p className="text-[14px] text-ink-3 mb-8">
                নিচের ফর্মটি পূরণ করুন, আমাদের প্রতিনিধি খুব দ্রুত আপনার সাথে
                যোগাযোগ করবে।
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-ink-2">
                      আপনার নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="উদাঃ রহিম মিয়া"
                      className="w-full px-4 py-2.5 bg-paper-2 border border-paper-3 rounded-lg text-[14px] text-ink focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-ink-2">
                      মোবাইল নম্বর <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="০১৭০০০০০০০০"
                      className="w-full px-4 py-2.5 bg-paper-2 border border-paper-3 rounded-lg text-[14px] text-ink focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-ink-2">
                    বিষয়
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-paper-2 border border-paper-3 rounded-lg text-[14px] text-ink focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all appearance-none"
                  >
                    <option value="">নির্বাচন করুন...</option>
                    <option value="app_issue">অ্যাপে সমস্যা হচ্ছে</option>
                    <option value="pricing">প্যাকেজ ও মূল্য সম্পর্কে</option>
                    <option value="suggestion">পরামর্শ বা মতামত</option>
                    <option value="other">অন্যান্য</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-ink-2">
                    বিস্তারিত মেসেজ <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="আপনার প্রশ্ন বা মতামত এখানে লিখুন..."
                    className="w-full px-4 py-2.5 bg-paper-2 border border-paper-3 rounded-lg text-[14px] text-ink focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-brand border border-brand-d rounded-lg text-[15px] font-medium text-white hover:bg-brand-d transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <Send size={18} />
                  মেসেজ পাঠিয়ে দিন
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
