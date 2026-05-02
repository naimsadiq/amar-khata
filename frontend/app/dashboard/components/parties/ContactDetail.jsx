import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ContactDetail({ contact }) {
  if (!contact) return null;
  const isCustomer = contact.type === "customer";
  const amtColor =
    contact.due > 0
      ? "text-[#1a7a4a]"
      : contact.due < 0
        ? "text-[#c0392b]"
        : "text-gray-400";
  const amtLabel =
    contact.due > 0 ? "মোট পাওনা" : contact.due < 0 ? "মোট দেনা" : "ব্যালেন্স";

  return (
    <div className="bg-white border-[1.5px] border-[#1a7a4a] rounded-2xl overflow-hidden mt-4 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-[#e8f5ee] p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold shrink-0 ${contact.av}`}
        >
          {contact.init}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-semibold text-[#0f5234]">
              {contact.name}
            </span>
            <Badge
              className={`text-[10px] ${isCustomer ? "bg-[#e3f0ff] text-[#1565c0]" : "bg-[#faeeda] text-[#854f0b]"}`}
            >
              {isCustomer ? "গ্রাহক" : "সাপ্লায়ার"}
            </Badge>
          </div>
          <div className="text-xs text-[#1a7a4a]">
            {contact.phone} · {contact.addr} · {contact.id}
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
            {contact.due > 0 ? "টাকা নিন" : "টাকা দিন"}
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
              ৳{Math.abs(contact.due).toLocaleString("bn")}
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
            <div className="text-[11px] text-gray-500 mb-1 uppercase">
              মোট লেনদেন
            </div>
            <div className="text-base font-semibold">
              {contact.txns.length} টি
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
            <div className="text-[11px] text-gray-500 mb-1 uppercase">
              শেষ লেনদেন
            </div>
            <div className="text-sm font-semibold mt-1">{contact.lastTxn}</div>
          </div>
        </div>

        <div className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wider">
          সাম্প্রতিক লেনদেন
        </div>
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
      </div>
    </div>
  );
}
