import { Badge } from "@/components/ui/badge";

// নামের প্রথম অক্ষর বের করার ফাংশন (Initials)
const getInitials = (name) => {
  if (!name) return "U";
  const words = name.split(" ");
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

export default function PartiesCard({ contact, isSelected, onClick }) {
  const isCustomer = contact.type === "customer";

  // API ডাটার সাথে সামঞ্জস্য রেখে Fallback ভ্যালু সেট করা
  // `dueBalance` এবং `openingBalance` উভয়ই চেক করা হচ্ছে এবং নাম্বার-এ কনভার্ট করা হচ্ছে।
  const dueAmount = contact.dueBalance ?? Number(contact.openingBalance) ?? 0;
  const address = contact.address || "ঠিকানা নেই";
  const phone = contact.phone || "নম্বর নেই";
  // তারিখ ফরম্যাট করা যেতে পারে, তবে আপাতত স্ট্রিং হিসেবেই রাখা হলো
  const lastTxn = contact.updatedAt
    ? new Date(contact.updatedAt).toLocaleDateString("bn-BD")
    : "নেই";
  const initials = getInitials(contact.name);
  const avatarClass = isCustomer
    ? "bg-[#e3f0ff] text-[#1565c0]"
    : "bg-[#faeeda] text-[#854f0b]";

  // ডাটাতে dueDays নেই, তাই ডিফল্ট 0 ধরা হলো
  const dueDays = contact.dueDays ?? 0;

  // কাস্টমার ও সাপ্লায়ারের জন্য টাকার রঙ ও লেবেল ভিন্ন হবে
  let amtColor, amtLabel;

  if (dueAmount > 0) {
    if (isCustomer) {
      amtColor = "text-[#1a7a4a]"; // গ্রাহকের কাছে পাবো (পাওনা)
      amtLabel = "পাওনা";
    } else {
      amtColor = "text-[#c0392b]"; // সাপ্লায়ারকে দিতে হবে (দেনা)
      amtLabel = "দেনা";
    }
  } else if (dueAmount < 0) {
    if (isCustomer) {
      amtColor = "text-[#c0392b]"; // গ্রাহক অগ্রিম দিয়েছে (জমা)
      amtLabel = "জমা";
    } else {
      amtColor = "text-[#1a7a4a]"; // সাপ্লায়ারকে অগ্রিম দিয়েছি (জমা)
      amtLabel = "জমা";
    }
  } else {
    amtColor = "text-gray-400";
    amtLabel = "";
  }

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
            className={`text-[10px] px-2 py-0 h-5 ${
              isCustomer
                ? "bg-[#e3f0ff] text-[#1565c0]"
                : "bg-[#faeeda] text-[#854f0b]"
            }`}
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
            {dueAmount !== 0 ? `৳ ${Math.abs(dueAmount)}` : "—"}
          </div>
        </div>

        {/* সংশোধিত ব্যাজ লজিক */}
        {dueAmount === 0 ? (
          <Badge className="bg-[#e8f5ee] text-[#1a7a4a] hover:bg-[#e8f5ee] text-[10px] px-2 py-0 h-5">
            পরিষ্কার
          </Badge>
        ) : dueDays > 0 ? (
          <Badge className="bg-[#fde8e8] text-[#c0392b] hover:bg-[#fde8e8] text-[10px] px-2 py-0 h-5">
            {dueDays} দিন অতিবাহিত
          </Badge>
        ) : (
          <Badge className="bg-[#faeeda] text-[#854f0b] hover:bg-[#faeeda] text-[10px] px-2 py-0 h-5">
            চলমান
          </Badge>
        )}
      </div>
    </div>
  );
}
