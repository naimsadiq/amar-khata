import { Badge } from "@/components/ui/badge";

// নামের প্রথম অক্ষর বের করার ফাংশন (Initials)
const getInitials = (name) => {
  if (!name) return "U";
  const words = name.split(" ");
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
};


export default function ContactCard({ contact, isSelected, onClick }) {
  const isCustomer = contact.type === "customer";

  // API ডাটার সাথে সামঞ্জস্য রেখে Fallback ভ্যালু সেট করা
  const dueAmount = contact.due ?? contact.openingBalance ?? 0;
  const address = contact.address || contact.addr || "ঠিকানা নেই";
  const phone = contact.phone || "নম্বর নেই";
  const lastTxn = contact.lastTxn || contact.updatedAt;
  const initials = contact.init || getInitials(contact.name);
  const avatarClass =
    contact.av ||
    (isCustomer
      ? "bg-[#e3f0ff] text-[#1565c0]"
      : "bg-[#faeeda] text-[#854f0b]");
  const isOverdue = contact.overdue ?? false;
  const dueDays = contact.dueDays ?? 0;

  const amtColor =
    dueAmount > 0
      ? "text-[#1a7a4a]"
      : dueAmount < 0
        ? "text-[#c0392b]"
        : "text-gray-400";

  const amtLabel = dueAmount > 0 ? "পাওনা" : dueAmount < 0 ? "দেনা" : "";

  // এখানে "en-IN" ব্যবহার করা হয়েছে যাতে টাকার সংখ্যা ইংরেজিতে হয় এবং কমা ঠিকমতো বসে
  const absDue = Math.abs(dueAmount).toLocaleString("en-IN");

  return (
    <div
      onClick={onClick}
      className={`bg-white border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer transition-all ${
        isSelected
          ? "border-[#1a7a4a] border-[1.5px] bg-[#fafffe]"
          : "border-gray-100 hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg font-semibold shrink-0 ${avatarClass}`}
      >
        {initials}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-[15px] font-semibold text-gray-900">
            {contact.name || "নাম নেই"}
          </span>
          <Badge
            variant="secondary"
            className={`text-[10px] px-2 py-0 h-5 ${isCustomer ? "bg-[#e3f0ff] text-[#1565c0]" : "bg-[#faeeda] text-[#854f0b]"}`}
          >
            {isCustomer ? "গ্রাহক" : "সাপ্লায়ার"}
          </Badge>
        </div>
        <div className="flex gap-4 flex-wrap text-xs text-gray-500">
          <span className="flex items-center gap-1">📞 {phone}</span>
          <span className="flex items-center gap-1">📍 {address}</span>
          <span>শেষ লেনদেন: {lastTxn}</span>
        </div>
      </div>

      <div className="sm:text-right shrink-0 mt-2 sm:mt-0 flex flex-row justify-between sm:flex-col items-center sm:items-end">
        <div>
          <div className="text-[10px] text-gray-400">{amtLabel}</div>
          <div
            className={`text-[15px] font-semibold leading-none mb-1 ${amtColor}`}
          >
            {dueAmount !== 0 ? `৳ ${absDue}` : "—"}
          </div>
        </div>
        {isOverdue ? (
          <Badge className="bg-[#fde8e8] text-[#c0392b] hover:bg-[#fde8e8] text-[10px] px-2 py-0 h-5">
            {dueDays} দিন অতিবাহিত
          </Badge>
        ) : dueAmount !== 0 ? (
          <Badge className="bg-[#faeeda] text-[#854f0b] hover:bg-[#faeeda] text-[10px] px-2 py-0 h-5">
            {dueDays > 0 ? `${dueDays} দিন` : "চলমান"}
          </Badge>
        ) : (
          <Badge className="bg-[#e8f5ee] text-[#1a7a4a] hover:bg-[#e8f5ee] text-[10px] px-2 py-0 h-5">
            পরিষ্কার
          </Badge>
        )}
      </div>
    </div>
  );
}
