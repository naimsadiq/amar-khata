import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// ইংরেজি নাম্বারকে বাংলায় রূপান্তরের ফাংশন
const enToBn = (num) => num.toLocaleString("bn-BD");

export default function ProductList({ products, onAddToCart }) {
  return (
    <div className="flex-1 flex flex-col gap-[14px] overflow-hidden">
      <div className="bg-white rounded-[12px] p-[16px] border border-[#e8ecf0] flex flex-col h-full">
        {/* Search Bar */}
        <div className="relative mb-[14px]">
          <Search className="absolute left-[12px] top-[10px] h-4 w-4 text-[#7f8c9a]" />
          <Input
            placeholder="পণ্য খুঁজুন বা বারকোড স্ক্যান করুন..."
            className="pl-[36px] border-[#e8ecf0] rounded-[8px] text-[0.82rem] h-[38px] bg-white focus-visible:ring-[#2ecc71]"
          />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-[10px] overflow-y-auto pr-1 pb-2 h-full content-start">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => product.stock > 0 && onAddToCart(product)}
              className={`bg-[#f8fafb] border border-[#e8ecf0] rounded-[10px] p-[12px] text-center transition-all duration-150 ${
                product.stock > 0
                  ? "cursor-pointer hover:border-[#2ecc71] hover:bg-[#eafaf1] hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(46,204,113,0.15)]"
                  : "opacity-60 cursor-not-allowed"
              }`}
            >
              <div className="w-[40px] h-[40px] bg-[#e8ecf0] rounded-[8px] flex items-center justify-center mx-auto mb-[8px] text-[1.2rem]">
                {product.icon}
              </div>
              <div className="text-[0.78rem] font-bold text-[#2c3e50] mb-[4px] line-clamp-1">
                {product.name}
              </div>
              <div className="text-[0.72rem] text-[#2ecc71] font-bold">
                ৳{enToBn(product.price)}/{product.unit}
              </div>
              <div
                className={`text-[0.68rem] mt-0.5 font-medium ${product.stock === 0 ? "text-[#e74c3c]" : "text-[#7f8c9a]"}`}
              >
                {product.stock === 0
                  ? "স্টক শেষ"
                  : `স্টক: ${enToBn(product.stock)}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
