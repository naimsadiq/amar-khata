import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Download,
  Upload,
  ShoppingCart,
  UserPlus,
  BarChart2,
  PackagePlus,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function QuickActions({
  setIsModalOpen,
  setIsCashbookModalOpen,
  setTransactionType,
  onPurchaseClick,
  onAddClick,
}) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
      <Button
        onClick={() => router.push("/dashboard/pos")}
        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm h-12"
      >
        <ShoppingCart className="mr-2 h-4 w-4" /> নতুন বিক্রয়
      </Button>

      <Button
        onClick={() => {
          setTransactionType("IN");
          setIsCashbookModalOpen(true);
        }}
        variant="outline"
        className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 h-12"
      >
        <Download className="mr-2 h-4 w-4" /> টাকা পেলাম
      </Button>

      <Button
        onClick={() => {
          setTransactionType("OUT");
          setIsCashbookModalOpen(true);
        }}
        variant="outline"
        className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 h-12"
      >
        <Upload className="mr-2 h-4 w-4" /> টাকা দিলাম
      </Button>

      <Button
        onClick={onAddClick}
        variant="secondary"
        className="bg-secondary hover:bg-secondary/80 text-secondary-foreground h-12"
      >
        <PackagePlus className="mr-2 h-4 w-4" /> নতুন পণ্য
      </Button>

      <Button
        onClick={onPurchaseClick}
        variant="outline"
        className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 hover:bg-purple-500/20 h-12"
      >
        <PlusCircle className="mr-2 h-4 w-4" /> মাল কিনলাম
      </Button>

      <Button
        onClick={() => setIsModalOpen(true)}
        variant="outline"
        className="bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20 hover:bg-amber-500/20 h-12"
      >
        <UserPlus className="mr-2 h-4 w-4" /> নতুন গ্রাহক
      </Button>

      <Button
        onClick={() => router.push("/dashboard/reports")}
        variant="outline"
        className="border-border hover:bg-muted text-foreground h-12 md:col-span-3 lg:col-span-1"
      >
        <BarChart2 className="mr-2 h-4 w-4" /> রিপোর্ট
      </Button>
    </div>
  );
}
