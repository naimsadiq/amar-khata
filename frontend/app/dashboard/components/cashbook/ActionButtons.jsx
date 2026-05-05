import { Button } from "@/components/ui/button";
import { ArrowDownToLine, ArrowRightLeft, Download } from "lucide-react";

export default function ActionButtons({ onCashIn, onCashOut }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <Button
        onClick={onCashIn}
        className="bg-[#2ecc71] hover:bg-[#27ae60] text-white flex gap-2 rounded-lg"
      >
        <ArrowDownToLine className="w-4 h-4" />
        টাকা পেলাম
      </Button>
      <Button
        onClick={onCashOut}
        className="bg-[#e74c3c] hover:bg-[#c0392b] text-white flex gap-2 rounded-lg"
      >
        <ArrowRightLeft className="w-4 h-4" />
        টাকা দিলাম
      </Button>
      <Button
        variant="outline"
        className="ml-auto flex gap-2 rounded-lg border-gray-200 bg-white"
      >
        <Download className="w-4 h-4" />
        এক্সপোর্ট
      </Button>
    </div>
  );
}
