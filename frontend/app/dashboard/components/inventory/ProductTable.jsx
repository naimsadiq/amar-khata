import { Badge } from "@/components/ui/badge";

export default function ProductTable({ products }) {
  const getProductDetails = (p) => {
    let status = "ok", statusText = "স্বাভাবিক", progress = 100, colorClass = "bg-emerald-500", textClass = "text-emerald-600 dark:text-emerald-400", bgTint = "bg-emerald-500/10";

    if (p.stockQuantity === 0) {
      status = "out"; statusText = "শেষ"; progress = 0; colorClass = "bg-destructive"; textClass = "text-destructive"; bgTint = "bg-destructive/10";
    } else if (p.stockQuantity <= p.lowStockAlert) {
      status = "low"; statusText = "শেষ হচ্ছে"; progress = (p.stockQuantity / p.lowStockAlert) * 50; colorClass = "bg-amber-500"; textClass = "text-amber-600 dark:text-amber-500"; bgTint = "bg-amber-500/10";
    }
    return { status, statusText, progress, colorClass, textClass, bgTint };
  };

  if (products.length === 0) {
    return <div className="bg-card rounded-xl border border-border p-10 text-center text-muted-foreground">কোনো পণ্য পাওয়া যায়নি!</div>;
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="py-4 px-5 border-b border-border flex justify-between items-center bg-muted/30">
        <span className="font-semibold text-foreground">পণ্যের তালিকা</span>
      </div>

      {/* --- DESKTOP TABLE --- */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="py-3 px-5 text-xs text-muted-foreground font-semibold whitespace-nowrap">পণ্যের নাম</th>
              <th className="py-3 px-5 text-xs text-muted-foreground font-semibold whitespace-nowrap">ক্যাটাগরি</th>
              <th className="py-3 px-5 text-xs text-muted-foreground font-semibold whitespace-nowrap">বর্তমান স্টক</th>
              <th className="py-3 px-5 text-xs text-muted-foreground font-semibold whitespace-nowrap w-[150px]">স্টক মাত্রা</th>
              <th className="py-3 px-5 text-xs text-muted-foreground font-semibold whitespace-nowrap">ক্রয় মূল্য</th>
              <th className="py-3 px-5 text-xs text-muted-foreground font-semibold whitespace-nowrap">বিক্রয় মূল্য</th>
              <th className="py-3 px-5 text-xs text-muted-foreground font-semibold whitespace-nowrap">অবস্থা</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {products.map((product) => {
              const { statusText, progress, colorClass, textClass, bgTint } = getProductDetails(product);
              return (
                <tr key={product._id} className="hover:bg-muted/30 transition-colors border-b border-border">
                  <td className="py-3 px-5 font-bold text-foreground">{product.name}</td>
                  <td className="py-3 px-5"><Badge variant="secondary" className="text-[10px]">{product.category}</Badge></td>
                  <td className="py-3 px-5 font-medium text-foreground">{product.stockQuantity.toLocaleString("en-IN")} {product.unit}</td>
                  <td className="py-3 px-5">
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${colorClass}`} style={{ width: `${progress}%` }}></div>
                    </div>
                  </td>
                  <td className="py-3 px-5 text-foreground">৳ {product.buyPrice.toLocaleString("en-IN")}</td>
                  <td className="py-3 px-5 text-primary font-medium">৳ {product.sellPrice.toLocaleString("en-IN")}</td>
                  <td className="py-3 px-5"><Badge variant="outline" className={`border-none px-2 py-0.5 ${bgTint} ${textClass}`}>{statusText}</Badge></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* --- MOBILE CARDS --- */}
      <div className="block md:hidden flex flex-col divide-y divide-border">
        {products.map((product) => {
          const { statusText, progress, colorClass, textClass, bgTint } = getProductDetails(product);
          return (
            <div key={product._id} className="p-4 flex flex-col gap-3 hover:bg-muted/30 transition-colors bg-card">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-foreground text-sm">{product.name}</h3>
                  <Badge variant="secondary" className="mt-1 text-[10px]">{product.category}</Badge>
                </div>
                <Badge variant="outline" className={`border-none px-2 py-0.5 ${bgTint} ${textClass}`}>{statusText}</Badge>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1.5 text-muted-foreground">
                  <span>বর্তমান স্টক:</span>
                  <span className="font-bold text-foreground">{product.stockQuantity.toLocaleString("en-IN")} {product.unit}</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${progress}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border mt-1 text-sm">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-0.5">ক্রয় মূল্য</span>
                  <span className="font-bold text-foreground">৳ {product.buyPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-0.5">বিক্রয় মূল্য</span>
                  <span className="font-bold text-primary">৳ {product.sellPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}