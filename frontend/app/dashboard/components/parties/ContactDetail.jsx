import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const getInitials = (name) => {
  if (!name) return "U";
  const words = name.split(" ");
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function ContactDetail({ contact, totalTxns }) {
  if (!contact) return null;

  const isCustomer = contact.type === "customer";

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
        : "text-gray-600";
  const amtLabel =
    dueAmount > 0 ? "মোট পাওনা" : dueAmount < 0 ? "মোট দেনা" : "ব্যালেন্স";

  const absDue = Math.abs(dueAmount).toLocaleString("en-IN");

  return (
    <div className="bg-white border-[1.5px] border-[#1a7a4a]/20 shadow-sm rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
      {/* Profile Header */}
      <div className="bg-[#e8f5ee]/50 p-5 flex flex-col sm:flex-row sm:items-center gap-4 border-b border-[#1a7a4a]/10">
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
              className={`text-[10px] shadow-none ${isCustomer ? "bg-[#e3f0ff] hover:bg-[#e3f0ff] text-[#1565c0]" : "bg-[#faeeda] hover:bg-[#faeeda] text-[#854f0b]"}`}
            >
              {isCustomer ? "গ্রাহক" : "সাপ্লায়ার"}
            </Badge>
          </div>
          <div className="text-sm text-gray-600">
            {phone} <span className="text-gray-300 mx-1">|</span> {address}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
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

      {/* Summary Stats */}
      <div className="p-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-1 font-medium">
              {amtLabel}
            </div>
            <div className={`text-xl font-bold ${amtColor}`}>৳ {absDue}</div>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-1 font-medium">
              মোট লেনদেন
            </div>
            <div className="text-lg font-bold text-gray-800">
              {totalTxns.toLocaleString("en-IN")} টি
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-gray-50 border border-gray-100 rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-1 font-medium">
              শেষ লেনদেন
            </div>
            <div className="text-lg font-bold text-gray-800">{lastTxn}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
