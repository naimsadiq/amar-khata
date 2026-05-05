export default function ProductTable({ products }) {
  
  // প্রোডাক্টের স্ট্যাটাস, কালার ও প্রোগ্রেস ক্যালকুলেট করার ফাংশন
  const getProductDetails = (p) => {
    let status = "ok";
    let statusText = "স্বাভাবিক";
    let progress = 100;

    if (p.stockQuantity === 0) {
      status = "out";
      statusText = "শেষ";
      progress = 0;
    } else if (p.stockQuantity <= p.lowStockAlert) {
      status = "low";
      statusText = "শেষ হচ্ছে";
      // প্রোগ্রেস বার ২০% থেকে ৪০% এর মধ্যে দেখাবে
      progress = (p.stockQuantity / p.lowStockAlert) * 50; 
    }

    return { status, statusText, progress };
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-[12px] border border-[#e8ecf0] p-10 text-center text-slate-500">
        কোনো পণ্য পাওয়া যায়নি!
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[12px] border border-[#e8ecf0] overflow-hidden">
      <div className="py-[14px] px-[20px] border-b border-[#e8ecf0] flex justify-between items-center">
        <span className="text-[0.9rem] font-bold text-[#2c3e50]">পণ্যের তালিকা</span>
        <button className="bg-white border border-[#e8ecf0] text-[#2c3e50] px-[14px] py-[6px] rounded-[8px] text-[0.78rem] font-semibold hover:border-[#2ecc71] hover:text-[#2ecc71] transition-colors">
          এক্সপোর্ট
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="py-[10px] px-[16px] text-[0.74rem] text-[#7f8c9a] font-semibold bg-[#f8fafb] border-b border-[#e8ecf0]">পণ্যের নাম</th>
              <th className="py-[10px] px-[16px] text-[0.74rem] text-[#7f8c9a] font-semibold bg-[#f8fafb] border-b border-[#e8ecf0]">ক্যাটাগরি</th>
              <th className="py-[10px] px-[16px] text-[0.74rem] text-[#7f8c9a] font-semibold bg-[#f8fafb] border-b border-[#e8ecf0]">বর্তমান স্টক</th>
              <th className="py-[10px] px-[16px] text-[0.74rem] text-[#7f8c9a] font-semibold bg-[#f8fafb] border-b border-[#e8ecf0] w-[150px]">স্টক মাত্রা</th>
              <th className="py-[10px] px-[16px] text-[0.74rem] text-[#7f8c9a] font-semibold bg-[#f8fafb] border-b border-[#e8ecf0]">ক্রয় মূল্য</th>
              <th className="py-[10px] px-[16px] text-[0.74rem] text-[#7f8c9a] font-semibold bg-[#f8fafb] border-b border-[#e8ecf0]">বিক্রয় মূল্য</th>
              <th className="py-[10px] px-[16px] text-[0.74rem] text-[#7f8c9a] font-semibold bg-[#f8fafb] border-b border-[#e8ecf0]">অবস্থা</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const { status, statusText, progress } = getProductDetails(product);

              return (
                <tr key={product._id} className="hover:bg-[#f8fafb] transition-colors group">
                  <td className="py-[12px] px-[16px] text-[0.82rem] text-[#2c3e50] font-bold border-b border-[#e8ecf0]">
                    {product.name}
                  </td>
                  <td className="py-[12px] px-[16px] border-b border-[#e8ecf0]">
                    <span className="inline-block py-[2px] px-[8px] bg-[#eef2ff] text-[#4f6ef7] rounded-[4px] text-[0.72rem]">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-[12px] px-[16px] text-[0.82rem] text-[#2c3e50] font-medium border-b border-[#e8ecf0]">
                    {product.stockQuantity.toLocaleString("en-IN")} {product.unit}
                  </td>
                  <td className="py-[12px] px-[16px] border-b border-[#e8ecf0]">
                    <div className="w-full h-[6px] bg-[#e8ecf0] rounded-[3px] overflow-hidden">
                      <div
                        className={`h-full rounded-[3px] transition-all duration-300 ${
                          status === "ok" ? "bg-[#2ecc71]" : status === "low" ? "bg-[#f39c12]" : "bg-[#e74c3c]"
                        }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="py-[12px] px-[16px] text-[0.82rem] text-[#2c3e50] border-b border-[#e8ecf0]">
                    ৳ {product.buyPrice.toLocaleString("en-IN")}
                  </td>
                  <td className="py-[12px] px-[16px] text-[0.82rem] text-[#2c3e50] border-b border-[#e8ecf0]">
                    ৳ {product.sellPrice.toLocaleString("en-IN")}
                  </td>
                  <td className="py-[12px] px-[16px] border-b border-[#e8ecf0]">
                    <span
                      className={`inline-flex items-center px-[10px] py-[3px] rounded-[20px] text-[0.72rem] font-semibold whitespace-nowrap ${
                        status === "ok" ? "bg-[#eafaf1] text-[#2ecc71]" : status === "low" ? "bg-[#fef9e7] text-[#f39c12]" : "bg-[#fdf2f2] text-[#e74c3c]"
                      }`}
                    >
                      {status === "ok" && "✓ "}
                      {status === "low" && "⚠ "}
                      {status === "out" && "✕ "}
                      {statusText}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile View (Responsive) */}
      <div className="block md:hidden bg-[#f5f7fa] p-4 space-y-4 border-t border-[#e8ecf0]">
        {products.map((product) => {
          const { status, statusText, progress } = getProductDetails(product);

          return (
            <div key={product._id} className="bg-white p-4 rounded-[12px] border border-[#e8ecf0] flex flex-col gap-3">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h3 className="font-bold text-[#2c3e50] text-[0.9rem]">{product.name}</h3>
                  <span className="inline-block mt-1 py-[2px] px-[8px] bg-[#eef2ff] text-[#4f6ef7] rounded-[4px] text-[0.72rem]">
                    {product.category}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center px-[10px] py-[3px] rounded-[20px] text-[0.72rem] font-semibold whitespace-nowrap ${
                    status === "ok" ? "bg-[#eafaf1] text-[#2ecc71]" : status === "low" ? "bg-[#fef9e7] text-[#f39c12]" : "bg-[#fdf2f2] text-[#e74c3c]"
                  }`}
                >
                  {statusText}
                </span>
              </div>
              <div>
                <div className="flex justify-between items-center text-sm mb-1.5">
                  <span className="text-[#7f8c9a] text-[0.74rem] font-semibold">বর্তমান স্টক:</span>
                  <span className="font-bold text-[0.82rem] text-[#2c3e50]">
                    {product.stockQuantity.toLocaleString("en-IN")} {product.unit}
                  </span>
                </div>
                <div className="w-full h-[6px] bg-[#e8ecf0] rounded-[3px] overflow-hidden">
                  <div
                    className={`h-full rounded-[3px] ${
                      status === "ok" ? "bg-[#2ecc71]" : status === "low" ? "bg-[#f39c12]" : "bg-[#e74c3c]"
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#e8ecf0] mt-1">
                <div>
                  <span className="text-[0.72rem] text-[#7f8c9a] block mb-0.5 font-semibold">ক্রয় মূল্য</span>
                  <span className="font-bold text-[0.82rem] text-[#2c3e50]">
                    ৳ {product.buyPrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[0.72rem] text-[#7f8c9a] block mb-0.5 font-semibold">বিক্রয় মূল্য</span>
                  <span className="font-bold text-[0.82rem] text-[#2c3e50]">
                    ৳ {product.sellPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}