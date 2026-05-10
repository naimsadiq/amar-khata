import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Download,
  Upload,
  ShoppingCart,
  UserPlus,
  BarChart2,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function QuickActions({
  setIsModalOpen,
  setIsCashbookModalOpen,
  setTransactionType,
  onPurchaseClick,
  onAddClick
}) {
  const router = useRouter();
  const onCashIn = () => {
    setTransactionType("IN");
    setIsCashbookModalOpen(true);
  };

  const onCashOut = () => {
    setTransactionType("OUT");
    setIsCashbookModalOpen(true);
  };
  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => router.push("/dashboard/pos")}>
        <ShoppingCart className="mr-2 h-4 w-4" /> নতুন বিক্রয়
      </Button>
      <Button
        onClick={onCashIn}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        <Download className="mr-2 h-4 w-4" /> টাকা পেলাম
      </Button>

      <Button
        onClick={onCashOut}
        className="bg-red-600 hover:bg-red-700 text-white"
      >
        <Upload className="mr-2 h-4 w-4" /> টাকা দিলাম
      </Button>
      <Button
        onClick={onAddClick}
        className="bg-emerald-600 hover:bg-emerald-700 text-white"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        নতুন পণ্য
      </Button>

      <Button
        onClick={onPurchaseClick}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        <ShoppingCart className="mr-2 h-4 w-4" /> মাল কিনলাম
      </Button>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-amber-500 hover:bg-amber-600"
      >
        <UserPlus className="mr-2 h-4 w-4" /> নতুন গ্রাহক
      </Button>
      <Button
        onClick={() => router.push("/dashboard/reports")}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <BarChart2 className="mr-2 h-4 w-4" /> রিপোর্ট দেখুন
      </Button>
    </div>
  );
}
