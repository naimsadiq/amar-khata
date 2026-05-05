import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// নামের প্রথম অক্ষর দিয়ে আইকন বানানোর ফাংশন
const getInitials = (name) =>
  name ? name.substring(0, 2).toUpperCase() : "PR";

export default function ProductList({ products, onAddToCart }) {
  const [search, setSearch] = useState("");

  // সার্চ অনুযায়ী ফিল্টার
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex-1 flex flex-col gap-[14px] overflow-hidden">
      <div className="bg-white rounded-[12px] p-[16px] border border-[#e8ecf0] flex flex-col h-full">
        <div className="relative mb-[14px]">
          <Search className="absolute left-[12px] top-[10px] h-4 w-4 text-[#7f8c9a]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="পণ্যের নাম বা ক্যাটাগরি খুঁজুন..."
            className="pl-[36px] border-[#e8ecf0] rounded-[8px] text-[0.82rem] h-[38px] bg-white focus-visible:ring-[#2ecc71]"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-[10px] overflow-y-auto pr-1 pb-2 h-full content-start">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => product.stockQuantity > 0 && onAddToCart(product)}
              className={`bg-[#f8fafb] border border-[#e8ecf0] rounded-[10px] p-[12px] text-center transition-all duration-150 ${
                product.stockQuantity > 0
                  ? "cursor-pointer hover:border-[#2ecc71] hover:bg-[#eafaf1] hover:-translate-y-[2px] hover:shadow-sm"
                  : "opacity-60 cursor-not-allowed"
              }`}
            >
              {/* Text Avatar Icon */}
              <div className="w-[40px] h-[40px] bg-[#e8ecf0] text-[#7f8c9a] rounded-[8px] flex items-center justify-center mx-auto mb-[8px] text-[1.1rem] font-bold">
                {getInitials(product.name)}
              </div>

              <div
                className="text-[0.78rem] font-bold text-[#2c3e50] mb-[4px] line-clamp-1"
                title={product.name}
              >
                {product.name}
              </div>
              <div className="text-[0.72rem] text-[#2ecc71] font-bold">
                ৳{product.sellPrice.toLocaleString("en-IN")}/{product.unit}
              </div>
              <div
                className={`text-[0.68rem] mt-0.5 font-medium ${product.stockQuantity === 0 ? "text-[#e74c3c]" : "text-[#7f8c9a]"}`}
              >
                {product.stockQuantity === 0
                  ? "স্টক শেষ"
                  : `স্টক: ${product.stockQuantity.toLocaleString("en-IN")}`}
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center text-gray-400 py-10 text-sm">
              কোনো পণ্য পাওয়া যায়নি
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
