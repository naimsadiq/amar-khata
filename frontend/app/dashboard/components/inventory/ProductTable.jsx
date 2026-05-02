import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProductTable({ products }) {
  return (
    <div className="bg-white rounded-[12px] border border-[#e8ecf0] overflow-hidden">
      {/* Table Header Section */}
      <div className="py-[14px] px-[20px] border-b border-[#e8ecf0] flex justify-between items-center">
        <span className="text-[0.9rem] font-bold text-[#2c3e50]">
          পণ্যের তালিকা
        </span>
        <button className="bg-white border border-[#e8ecf0] text-[#2c3e50] px-[14px] py-[6px] rounded-[8px] text-[0.78rem] font-semibold hover:border-[#2ecc71] hover:text-[#2ecc71] transition-colors">
          এক্সপোর্ট
        </button>
      </div>

      {/* =========================================
          Desktop & Tablet View (Exact Match with Demo)
          ========================================= */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="py-[10px] px-[16px] text-[0.74rem] text-[#7f8c9a] font-semibold bg-[#f8fafb] border-b border-[#e8ecf0] whitespace-nowrap">
                পণ্যের নাম
              </th>
              <th className="py-[10px] px-[16px] text-[0.74rem] text-[#7f8c9a] font-semibold bg-[#f8fafb] border-b border-[#e8ecf0] whitespace-nowrap">
                ক্যাটাগরি
              </th>
              <th className="py-[10px] px-[16px] text-[0.74rem] text-[#7f8c9a] font-semibold bg-[#f8fafb] border-b border-[#e8ecf0] whitespace-nowrap">
                বর্তমান স্টক
              </th>
              <th className="py-[10px] px-[16px] text-[0.74rem] text-[#7f8c9a] font-semibold bg-[#f8fafb] border-b border-[#e8ecf0] whitespace-nowrap w-[150px]">
                স্টক মাত্রা
              </th>
              <th className="py-[10px] px-[16px] text-[0.74rem] text-[#7f8c9a] font-semibold bg-[#f8fafb] border-b border-[#e8ecf0] whitespace-nowrap">
                ক্রয় মূল্য
              </th>
              <th className="py-[10px] px-[16px] text-[0.74rem] text-[#7f8c9a] font-semibold bg-[#f8fafb] border-b border-[#e8ecf0] whitespace-nowrap">
                বিক্রয় মূল্য
              </th>
              <th className="py-[10px] px-[16px] text-[0.74rem] text-[#7f8c9a] font-semibold bg-[#f8fafb] border-b border-[#e8ecf0] whitespace-nowrap">
                অবস্থা
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-[#f8fafb] transition-colors group"
              >
                {/* Product Name */}
                <td className="py-[12px] px-[16px] text-[0.82rem] text-[#2c3e50] font-bold border-b border-[#e8ecf0] group-last:border-none">
                  {product.name}
                </td>

                {/* Category */}
                <td className="py-[12px] px-[16px] border-b border-[#e8ecf0] group-last:border-none">
                  <span className="inline-block py-[2px] px-[8px] bg-[#eef2ff] text-[#4f6ef7] rounded-[4px] text-[0.72rem]">
                    {product.category}
                  </span>
                </td>

                {/* Current Stock */}
                <td className="py-[12px] px-[16px] text-[0.82rem] text-[#2c3e50] border-b border-[#e8ecf0] group-last:border-none">
                  {product.stock}
                </td>

                {/* Progress Bar */}
                <td className="py-[12px] px-[16px] border-b border-[#e8ecf0] group-last:border-none">
                  <div className="w-full h-[6px] bg-[#e8ecf0] rounded-[3px] overflow-hidden">
                    <div
                      className={`h-full rounded-[3px] transition-all duration-300 ${
                        product.status === "ok"
                          ? "bg-[#2ecc71]"
                          : product.status === "low"
                            ? "bg-[#f39c12]"
                            : "bg-[#e74c3c]"
                      }`}
                      style={{ width: `${product.progress}%` }}
                    ></div>
                  </div>
                </td>

                {/* Buy Price */}
                <td className="py-[12px] px-[16px] text-[0.82rem] text-[#2c3e50] border-b border-[#e8ecf0] group-last:border-none">
                  {product.buyPrice}
                </td>

                {/* Sell Price */}
                <td className="py-[12px] px-[16px] text-[0.82rem] text-[#2c3e50] border-b border-[#e8ecf0] group-last:border-none">
                  {product.sellPrice}
                </td>

                {/* Status Badge */}
                <td className="py-[12px] px-[16px] border-b border-[#e8ecf0] group-last:border-none">
                  <span
                    className={`inline-flex items-center px-[10px] py-[3px] rounded-[20px] text-[0.72rem] font-semibold whitespace-nowrap ${
                      product.status === "ok"
                        ? "bg-[#eafaf1] text-[#2ecc71]"
                        : product.status === "low"
                          ? "bg-[#fef9e7] text-[#f39c12]"
                          : "bg-[#fdf2f2] text-[#e74c3c]"
                    }`}
                  >
                    {product.status === "ok" && "✓ "}
                    {product.status === "low" && "⚠ "}
                    {product.status === "out" && "✕ "}
                    {product.statusText}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =========================================
          Mobile View (Responsive Card Layout)
          ========================================= */}
      <div className="block md:hidden bg-[#f5f7fa] p-4 space-y-4 border-t border-[#e8ecf0]">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-[12px] border border-[#e8ecf0] flex flex-col gap-3"
          >
            <div className="flex justify-between items-start gap-2">
              <div>
                <h3 className="font-bold text-[#2c3e50] text-[0.9rem]">
                  {product.name}
                </h3>
                <span className="inline-block mt-1 py-[2px] px-[8px] bg-[#eef2ff] text-[#4f6ef7] rounded-[4px] text-[0.72rem]">
                  {product.category}
                </span>
              </div>
              <span
                className={`inline-flex items-center px-[10px] py-[3px] rounded-[20px] text-[0.72rem] font-semibold whitespace-nowrap ${
                  product.status === "ok"
                    ? "bg-[#eafaf1] text-[#2ecc71]"
                    : product.status === "low"
                      ? "bg-[#fef9e7] text-[#f39c12]"
                      : "bg-[#fdf2f2] text-[#e74c3c]"
                }`}
              >
                {product.status === "ok" && "✓ "}
                {product.status === "low" && "⚠ "}
                {product.status === "out" && "✕ "}
                {product.statusText}
              </span>
            </div>

            <div>
              <div className="flex justify-between items-center text-sm mb-1.5">
                <span className="text-[#7f8c9a] text-[0.74rem] font-semibold">
                  বর্তমান স্টক:
                </span>
                <span className="font-bold text-[0.82rem] text-[#2c3e50]">
                  {product.stock}
                </span>
              </div>
              <div className="w-full h-[6px] bg-[#e8ecf0] rounded-[3px] overflow-hidden">
                <div
                  className={`h-full rounded-[3px] ${
                    product.status === "ok"
                      ? "bg-[#2ecc71]"
                      : product.status === "low"
                        ? "bg-[#f39c12]"
                        : "bg-[#e74c3c]"
                  }`}
                  style={{ width: `${product.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#e8ecf0] mt-1">
              <div>
                <span className="text-[0.72rem] text-[#7f8c9a] block mb-0.5 font-semibold">
                  ক্রয় মূল্য
                </span>
                <span className="font-bold text-[0.82rem] text-[#2c3e50]">
                  {product.buyPrice}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[0.72rem] text-[#7f8c9a] block mb-0.5 font-semibold">
                  বিক্রয় মূল্য
                </span>
                <span className="font-bold text-[0.82rem] text-[#2c3e50]">
                  {product.sellPrice}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
