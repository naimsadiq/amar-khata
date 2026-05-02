import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export default function FilterBar() {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-6">
      <div className="relative w-full md:w-[300px]">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input placeholder="পণ্যের নাম খোঁজুন..." className="pl-9 bg-white" />
      </div>

      <Select defaultValue="all-cat">
        <SelectTrigger className="w-full md:w-[180px] bg-white">
          <SelectValue placeholder="ক্যাটাগরি" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all-cat">সব ক্যাটাগরি</SelectItem>
          <SelectItem value="rice">চাল/ডাল</SelectItem>
          <SelectItem value="oil">তেল</SelectItem>
          <SelectItem value="spice">মশলা</SelectItem>
        </SelectContent>
      </Select>

      <Select defaultValue="all-stock">
        <SelectTrigger className="w-full md:w-[180px] bg-white">
          <SelectValue placeholder="স্টক অবস্থা" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all-stock">সব স্টক</SelectItem>
          <SelectItem value="normal">স্বাভাবিক</SelectItem>
          <SelectItem value="low">কম</SelectItem>
          <SelectItem value="out">শেষ</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
