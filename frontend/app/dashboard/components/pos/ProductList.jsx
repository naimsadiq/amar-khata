import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const getInitials = (name) =>
  name ? name.substring(0, 2).toUpperCase() : "PR";

export default function ProductList({ products, onAddToCart }) {
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-hidden min-h-[400px]">
      <div className="bg-card text-card-foreground rounded-xl p-4 border border-border flex flex-col h-full shadow-sm">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="পণ্যের নাম বা ক্যাটাগরি খুঁজুন..."
            className="pl-10 border-border rounded-lg text-sm h-10 bg-background focus-visible:ring-primary focus-visible:ring-2"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 overflow-y-auto pr-2 pb-2 h-full content-start custom-scrollbar">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => product.stockQuantity > 0 && onAddToCart(product)}
              className={`bg-background border border-border rounded-xl p-3 text-center transition-all duration-200 ${
                product.stockQuantity > 0
                  ? "cursor-pointer hover:border-primary hover:bg-primary/5 hover:-translate-y-1 hover:shadow-md"
                  : "opacity-50 grayscale-[50%] cursor-not-allowed"
              }`}
            >
              <div className="w-10 h-10 bg-muted text-muted-foreground rounded-lg flex items-center justify-center mx-auto mb-2 text-lg font-bold">
                {getInitials(product.name)}
              </div>

              <div
                className="text-sm font-bold text-foreground mb-1 line-clamp-1"
                title={product.name}
              >
                {product.name}
              </div>
              <div className="text-xs text-primary font-bold">
                ৳{product.sellPrice.toLocaleString("en-IN")}/{product.unit}
              </div>
              <div
                className={`text-[11px] mt-1 font-medium ${
                  product.stockQuantity === 0
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                {product.stockQuantity === 0
                  ? "স্টক শেষ"
                  : `স্টক: ${product.stockQuantity.toLocaleString("en-IN")}`}
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center text-muted-foreground py-16 text-sm">
              <Search className="h-10 w-10 mb-3 opacity-20" />
              কোনো পণ্য পাওয়া যায়নি
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
