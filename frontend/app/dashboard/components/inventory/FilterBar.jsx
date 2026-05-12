import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export default function FilterBar({
  search,
  setSearch,
  category,
  setCategory,
  stockStatus,
  setStockStatus,
  categories,
}) {
  return (
    <div className="flex flex-col md:flex-row gap-3">
      <div className="relative w-full md:w-[300px]">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="পণ্যের নাম খোঁজুন..."
          className="pl-9 bg-background border-border text-foreground"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-full md:w-[180px] bg-background border-border text-foreground">
          <SelectValue placeholder="ক্যাটাগরি" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all-cat">সব ক্যাটাগরি</SelectItem>
          {categories.map((cat, idx) => (
            <SelectItem key={idx} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={stockStatus} onValueChange={setStockStatus}>
        <SelectTrigger className="w-full md:w-[180px] bg-background border-border text-foreground">
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
