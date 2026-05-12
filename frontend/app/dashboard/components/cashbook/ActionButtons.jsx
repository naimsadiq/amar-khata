import { Button } from "@/components/ui/button";
import { ArrowDownToLine, ArrowRightLeft, Download } from "lucide-react";

export default function ActionButtons({ onCashIn, onCashOut }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        onClick={onCashIn}
        className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white flex gap-2 rounded-lg h-11"
      >
        <ArrowDownToLine className="w-4 h-4" />
        টাকা পেলাম
      </Button>
      <Button
        onClick={onCashOut}
        className="flex-1 sm:flex-none bg-destructive hover:bg-destructive/90 text-white flex gap-2 rounded-lg h-11"
      >
        <ArrowRightLeft className="w-4 h-4" />
        টাকা দিলাম
      </Button>
      <Button
        variant="outline"
        className="w-full sm:w-auto sm:ml-auto flex gap-2 rounded-lg border-border bg-card h-11"
      >
        <Download className="w-4 h-4 text-muted-foreground" />
        এক্সপোর্ট
      </Button>
    </div>
  );
}