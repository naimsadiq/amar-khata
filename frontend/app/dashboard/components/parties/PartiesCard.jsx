import { Badge } from "@/components/ui/badge";

const getInitials = (name) => {
  if (!name) return "U";
  const words = name.split(" ");
  return words.length > 1 ? (words[0][0] + words[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
};

export default function PartiesCard({ contact, isSelected, onClick }) {
  const isCustomer = contact.type === "customer";
  const dueAmount = contact.currentDue ?? Number(contact.openingBalance) ?? 0;
  const address = contact.address || "ঠিকানা নেই";
  const phone = contact.phone || "নম্বর নেই";
  const lastTxn = contact.updatedAt ? new Date(contact.updatedAt).toLocaleDateString("bn-BD") : "নেই";
  const initials = getInitials(contact.name);

  // Modern Avatar Colors (Blue for Customer, Orange for Supplier)
  const avatarClass = isCustomer ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-500";
  const badgeClass = isCustomer ? "bg-blue-500/10 text-blue-600" : "bg-amber-500/10 text-amber-600";

  let amtColor, amtLabel;
  if (dueAmount > 0) {
    amtColor = isCustomer ? "text-primary" : "text-destructive";
    amtLabel = isCustomer ? "পাওনা" : "দেনা";
  } else if (dueAmount < 0) {
    amtColor = isCustomer ? "text-destructive" : "text-primary";
    amtLabel = "জমা";
  } else {
    amtColor = "text-muted-foreground";
    amtLabel = "";
  }

  return (
    <div
      onClick={onClick}
      className={`bg-card border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer transition-all ${
        isSelected ? "border-primary ring-1 ring-primary/20 bg-primary/5" : "border-border hover:border-primary/40 hover:shadow-sm"
      }`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${avatarClass}`}>
        {initials}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-[15px] font-semibold text-foreground">{contact.name || "নাম নেই"}</span>
          <Badge variant="secondary" className={`text-[10px] px-2 py-0 h-5 border-none ${badgeClass}`}>
            {isCustomer ? "গ্রাহক" : "সাপ্লায়ার"}
          </Badge>
        </div>
        <div className="flex gap-4 flex-wrap text-xs text-muted-foreground">
          <span className="flex items-center gap-1">📞 {phone}</span>
          <span className="flex items-center gap-1">📍 {address}</span>
          <span>শেষ লেনদেন: {lastTxn}</span>
        </div>
      </div>

      <div className="sm:text-right shrink-0 mt-2 sm:mt-0 flex flex-row justify-between sm:flex-col items-center sm:items-end">
        <div>
          <div className="text-[10px] text-muted-foreground">{amtLabel}</div>
          <div className={`text-[15px] font-bold leading-none mb-1 ${amtColor}`}>
            {dueAmount !== 0 ? `৳ ${Math.abs(dueAmount)}` : "—"}
          </div>
        </div>

        {dueAmount === 0 ? (
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 text-[10px] px-2 py-0 h-5">পরিষ্কার</Badge>
        ) : contact.dueDays > 0 ? (
          <Badge variant="outline" className="text-destructive border-destructive/20 bg-destructive/5 text-[10px] px-2 py-0 h-5">
            {contact.dueDays} দিন অতিবাহিত
          </Badge>
        ) : (
          <Badge variant="outline" className="text-amber-600 border-amber-500/20 bg-amber-500/10 text-[10px] px-2 py-0 h-5">চলমান</Badge>
        )}
      </div>
    </div>
  );
}