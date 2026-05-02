import { Button } from "@/components/ui/button";
import { Plus, ShoppingBag } from "lucide-react";

export default function InventoryHeader({ totalProducts }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">
          ইনভেন্টরি
        </h1>
        <span className="text-sm text-slate-500 mt-1">
          মোট {totalProducts} পণ্য
        </span>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Button className="w-full sm:w-auto bg-[#2ecc71] hover:bg-[#27ae60] text-white gap-2">
          <Plus size={16} /> নতুন পণ্য যোগ
        </Button>
        <Button variant="outline" className="w-full sm:w-auto gap-2">
          মাল কিনলাম
        </Button>
      </div>
    </div>
  );
}
