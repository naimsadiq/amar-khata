// components/parties/ContactDetail.jsx

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// নামের প্রথম অক্ষর বের করার ফাংশন
const getInitials = (name) => {
  if (!name) return "U";
  const words = name.split(" ");
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

// তারিখ ফরম্যাট করার ফাংশন
const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function ContactDetail({ contact }) {
  if (!contact) return null;

  const isCustomer = contact.type === "customer";

  // API ডাটার সাথে সামঞ্জস্য রেখে Fallback ভ্যালু সেট করা
  const dueAmount = contact.due ?? contact.openingBalance ?? 0;
  const address = contact.address || contact.addr || "ঠিকানা নেই";
  const phone = contact.phone || "নম্বর নেই";
  const lastTxn = contact.lastTxn || formatDate(contact.updatedAt);
  const initials = contact.init || getInitials(contact.name);
  const avatarClass =
    contact.av ||
    (isCustomer
      ? "bg-[#e3f0ff] text-[#1565c0]"
      : "bg-[#faeeda] text-[#854f0b]");

  const amtColor =
    dueAmount > 0
      ? "text-[#1a7a4a]"
      : dueAmount < 0
        ? "text-[#c0392b]"
        : "text-gray-400";

  const amtLabel =
    dueAmount > 0 ? "মোট পাওনা" : dueAmount < 0 ? "মোট দেনা" : "ব্যালেন্স";

  // নাম্বার ইংরেজিতে ফরম্যাট করা
  const absDue = Math.abs(dueAmount).toLocaleString("en-IN");
  const txnsCount = contact.txns ? contact.txns.length : 0;

  return (
    <div className="bg-white border-[1.5px] border-[#1a7a4a] rounded-2xl overflow-hidden mt-4 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-[#e8f5ee] p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold shrink-0 ${avatarClass}`}
        >
          {initials}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-semibold text-[#0f5234]">
              {contact.name || "নাম নেই"}
            </span>
            <Badge
              className={`text-[10px] ${isCustomer ? "bg-[#e3f0ff] text-[#1565c0]" : "bg-[#faeeda] text-[#854f0b]"}`}
            >
              {isCustomer ? "গ্রাহক" : "সাপ্লায়ার"}
            </Badge>
          </div>
          <div className="text-xs text-[#1a7a4a]">
            {phone} · {address}{" "}
            {contact.businessId ? `· ${contact.businessId}` : ""}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-[#c3e6d0] text-[#1a7a4a] hover:bg-[#e8f5ee]"
          >
            নতুন লেনদেন
          </Button>
          <Button
            size="sm"
            className="bg-[#1a7a4a] hover:bg-[#0f5234] text-white"
          >
            {dueAmount >= 0 ? "টাকা নিন" : "টাকা দিন"}
          </Button>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
            <div className="text-[11px] text-gray-500 mb-1 uppercase">
              {amtLabel}
            </div>
            <div className={`text-base font-semibold ${amtColor}`}>
              ৳ {absDue}
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
            <div className="text-[11px] text-gray-500 mb-1 uppercase">
              মোট লেনদেন
            </div>
            <div className="text-base font-semibold">
              {txnsCount.toLocaleString("en-IN")} টি
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
            <div className="text-[11px] text-gray-500 mb-1 uppercase">
              শেষ লেনদেন
            </div>
            <div className="text-sm font-semibold mt-1">{lastTxn}</div>
          </div>
        </div>

        <div className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wider">
          সাম্প্রতিক লেনদেন
        </div>

        {/* লেনদেনের লিস্ট যদি থাকে তাহলে দেখাবে, নাহলে ডেমো/নো-ডাটা টেক্সট দেখাবে */}
        {contact.txns && contact.txns.length > 0 ? (
          <div className="flex flex-col">
            {contact.txns.map((t, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0"
              >
                <div
                  className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${t.green ? "bg-[#e8f5ee] text-[#1a7a4a]" : "bg-[#fde8e8] text-[#c0392b]"}`}
                >
                  {t.green ? "↓" : "↑"}
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-medium text-gray-900">
                    {t.desc}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {t.meta} · {t.date}
                  </div>
                </div>
                <div
                  className={`text-[13px] font-semibold ${t.green ? "text-[#1a7a4a]" : "text-[#c0392b]"}`}
                >
                  {t.amt}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-sm text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            কোনো লেনদেনের তথ্য পাওয়া যায়নি
          </div>
        )}
      </div>
    </div>
  );
}
