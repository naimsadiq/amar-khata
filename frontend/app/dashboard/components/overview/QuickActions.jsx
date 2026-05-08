import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Download,
  Upload,
  ShoppingCart,
  UserPlus,
  BarChart2,
} from "lucide-react";

export default function QuickActions({ setIsModalOpen }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button>
        <ShoppingCart className="mr-2 h-4 w-4" /> নতুন বিক্রয়
      </Button>
      <Button variant="secondary">
        <Download className="mr-2 h-4 w-4" /> টাকা পেলাম
      </Button>
      <Button variant="secondary">
        <Upload className="mr-2 h-4 w-4" /> টাকা দিলাম
      </Button>
      <Button variant="secondary">
        <ShoppingCart className="mr-2 h-4 w-4" /> মাল কিনলাম
      </Button>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-amber-500 hover:bg-amber-600"
      >
        <UserPlus className="mr-2 h-4 w-4" /> নতুন গ্রাহক
      </Button>
      <Button className="bg-blue-600 hover:bg-blue-700">
        <BarChart2 className="mr-2 h-4 w-4" /> রিপোর্ট দেখুন
      </Button>
    </div>
  );
}
