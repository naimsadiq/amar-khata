import { useState } from "react";

// ডেট ফরম্যাট করার ফাংশন
const formatDate = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function TransactionTable({ transactions }) {
  const [search, setSearch] = useState("");

  const filteredData = transactions?.filter((item) =>
    item.description?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bg-white rounded-[12px] border border-[#e8ecf0] overflow-hidden">
      <div className="py-[16px] px-[20px] border-b border-[#e8ecf0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <span className="text-[0.9rem] font-bold text-[#2c3e50]">
          লেনদেনের তালিকা
        </span>
        <input
          type="text"
          placeholder="বিবরণ দিয়ে খোঁজুন..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-[250px] py-[7px] px-[12px] border border-[#e8ecf0] rounded-[8px] text-[0.8rem] outline-none"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="py-[11px] px-[20px] text-left text-[0.75rem] text-[#7f8c9a] font-semibold bg-[#f8fafb] border-b border-[#e8ecf0]">
                তারিখ
              </th>
              <th className="py-[11px] px-[20px] text-left text-[0.75rem] text-[#7f8c9a] font-semibold bg-[#f8fafb] border-b border-[#e8ecf0]">
                বিবরণ
              </th>
              <th className="py-[11px] px-[20px] text-left text-[0.75rem] text-[#7f8c9a] font-semibold bg-[#f8fafb] border-b border-[#e8ecf0]">
                ধরন
              </th>
              <th className="py-[11px] px-[20px] text-left text-[0.75rem] text-[#7f8c9a] font-semibold bg-[#f8fafb] border-b border-[#e8ecf0]">
                পরিমাণ
              </th>
              <th className="py-[11px] px-[20px] text-left text-[0.75rem] text-[#7f8c9a] font-semibold bg-[#f8fafb] border-b border-[#e8ecf0]">
                নোট
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData?.length > 0 ? (
              filteredData.map((row) => {
                const isIncome = row.type === "IN"; // ডাটাবেসের "IN" বা "OUT" চেক
                return (
                  <tr
                    key={row._id}
                    className="hover:bg-[#f8fafb] transition-colors border-b border-[#e8ecf0] last:border-0"
                  >
                    <td className="py-[13px] px-[20px] text-[0.82rem] text-[#2c3e50]">
                      {formatDate(row.date)}
                    </td>
                    <td className="py-[13px] px-[20px] text-[0.82rem] text-[#2c3e50]">
                      <div className="font-semibold">{row.description}</div>
                      <div className="text-[10px] text-gray-400">
                        {row.category}
                      </div>
                    </td>
                    <td className="py-[13px] px-[20px] text-[0.82rem]">
                      <span
                        className={`inline-flex items-center gap-[5px] py-[3px] px-[10px] rounded-[20px] text-[0.72rem] font-semibold ${isIncome ? "bg-[#eafaf1] text-[#2ecc71]" : "bg-[#fdf2f2] text-[#e74c3c]"}`}
                      >
                        {isIncome ? "↑ আয়" : "↓ ব্যয়"}
                      </span>
                    </td>
                    <td
                      className={`py-[13px] px-[20px] text-[0.82rem] font-bold ${isIncome ? "text-[#2ecc71]" : "text-[#e74c3c]"}`}
                    >
                      ৳ {row.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-[13px] px-[20px] text-[0.75rem] text-[#7f8c9a]">
                      {row.note || "-"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  কোনো লেনদেন পাওয়া যায়নি
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="block md:hidden bg-[#f5f7fa] p-4 space-y-3 border-t border-[#e8ecf0]">
        {filteredData?.length > 0 ? (
          filteredData.map((row) => {
            const isIncome = row.type === "IN";
            return (
              <div
                key={row._id}
                className="bg-white p-4 rounded-xl border border-[#e8ecf0] shadow-sm flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[0.75rem] text-[#7f8c9a] font-medium">
                    {formatDate(row.date)}
                  </span>
                  <span
                    className={`text-[0.9rem] font-bold ${isIncome ? "text-[#2ecc71]" : "text-[#e74c3c]"}`}
                  >
                    ৳ {row.amount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div>
                  <div className="text-[0.85rem] font-semibold text-[#2c3e50]">
                    {row.description}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {row.category}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 mt-1 border-t border-gray-50">
                  <span
                    className={`inline-flex items-center gap-[4px] py-1 px-2.5 rounded-full text-[0.7rem] font-semibold ${isIncome ? "bg-[#eafaf1] text-[#2ecc71]" : "bg-[#fdf2f2] text-[#e74c3c]"}`}
                  >
                    {isIncome ? "↑ আয়" : "↓ ব্যয়"}
                  </span>
                  <span className="text-[0.75rem] text-[#7f8c9a]">
                    {row.note || "-"}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-6 text-gray-500 bg-white rounded-xl border border-gray-100">
            কোনো লেনদেন পাওয়া যায়নি
          </div>
        )}
      </div>
    </div>
  );
}
