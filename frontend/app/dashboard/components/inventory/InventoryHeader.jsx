import { Button } from "@/components/ui/button";
import { Plus, ShoppingBag } from "lucide-react";

export default function InventoryHeader({
  totalProducts,
  onAddClick,
  onPurchaseClick,
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">
          ইনভেন্টরি
        </h1>
        <span className="text-sm text-muted-foreground mt-1">
          মোট {totalProducts} পণ্য
        </span>
      </div>

      {/* মোবাইল এবং ডেস্কটপ উভয় ভার্সনে বাটনগুলো এখন একই স্টাইলের */}
      <div className="flex flex-row w-full sm:w-auto gap-2">
        <Button
          onClick={onAddClick}
          className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-11"
        >
          <Plus size={16} /> নতুন পণ্য
        </Button>

        <Button
          variant="outline"
          onClick={onPurchaseClick}
          className="flex-1 sm:flex-none gap-2 border-primary/20 text-primary hover:bg-primary/10 bg-card h-11"
        >
          <ShoppingBag size={16} /> মাল কিনলাম
        </Button>
      </div>
    </div>
  );
}
