import { useState } from "react";

export default function TransactionTable({ transactions }) {
  const [search, setSearch] = useState("");

  const filteredData = transactions?.filter((item) =>
    item.description.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bg-white rounded-[12px] border border-[#e8ecf0] overflow-hidden">
      {/* Table Header & Search */}
      <div className="py-[16px] px-[20px] border-b border-[#e8ecf0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <span className="text-[0.9rem] font-bold text-[#2c3e50]">
          লেনদেনের তালিকা
        </span>

        <input
          type="text"
          placeholder="খোঁজুন..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-auto py-[7px] pr-[12px] pl-[32px] border border-[#e8ecf0] rounded-[8px] text-[0.8rem] outline-none text-[#2c3e50]"
          style={{
            background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='%237f8c9a' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0'/%3E%3C/svg%3E") no-repeat 10px center`,
            backgroundColor: "#fff",
          }}
        />
      </div>

      {/* ==============================
          DESKTOP VIEW (Table Format)
          ============================== */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="py-[11px] px-[20px] text-left text-[0.75rem] text-[#7f8c9a] font-semibold bg-[#f8fafb] border-b border-[#e8ecf0] whitespace-nowrap">
                তারিখ
              </th>
              <th className="py-[11px] px-[20px] text-left text-[0.75rem] text-[#7f8c9a] font-semibold bg-[#f8fafb] border-b border-[#e8ecf0] whitespace-nowrap">
                বিবরণ
              </th>
              <th className="py-[11px] px-[20px] text-left text-[0.75rem] text-[#7f8c9a] font-semibold bg-[#f8fafb] border-b border-[#e8ecf0] whitespace-nowrap">
                ধরন
              </th>
              <th className="py-[11px] px-[20px] text-left text-[0.75rem] text-[#7f8c9a] font-semibold bg-[#f8fafb] border-b border-[#e8ecf0] whitespace-nowrap">
                পরিমাণ
              </th>
              <th className="py-[11px] px-[20px] text-left text-[0.75rem] text-[#7f8c9a] font-semibold bg-[#f8fafb] border-b border-[#e8ecf0] whitespace-nowrap">
                নোট
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData?.length > 0 ? (
              filteredData.map((row, index) => {
                const isIncome = row.type === "income";
                const borderClass =
                  index !== filteredData.length - 1
                    ? "border-b border-[#e8ecf0]"
                    : "";

                return (
                  <tr
                    key={row.id}
                    className="hover:bg-[#f8fafb] transition-colors"
                  >
                    <td
                      className={`py-[13px] px-[20px] text-[0.82rem] text-[#2c3e50] whitespace-nowrap ${borderClass}`}
                    >
                      {row.date}
                    </td>
                    <td
                      className={`py-[13px] px-[20px] text-[0.82rem] text-[#2c3e50] ${borderClass}`}
                    >
                      {row.description}
                    </td>
                    <td
                      className={`py-[13px] px-[20px] text-[0.82rem] whitespace-nowrap ${borderClass}`}
                    >
                      <span
                        className={`inline-flex items-center gap-[5px] py-[3px] px-[10px] rounded-[20px] text-[0.72rem] font-semibold ${
                          isIncome
                            ? "bg-[#eafaf1] text-[#2ecc71]"
                            : "bg-[#fdf2f2] text-[#e74c3c]"
                        }`}
                      >
                        {isIncome ? "↑ আয়" : "↓ ব্যয়"}
                      </span>
                    </td>
                    <td
                      className={`py-[13px] px-[20px] text-[0.82rem] font-bold whitespace-nowrap ${borderClass} ${
                        isIncome ? "text-[#2ecc71]" : "text-[#e74c3c]"
                      }`}
                    >
                      {row.amount}
                    </td>
                    <td
                      className={`py-[13px] px-[20px] text-[0.75rem] text-[#7f8c9a] ${borderClass}`}
                    >
                      {row.note}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-[20px] text-center text-[#7f8c9a] text-[0.82rem]"
                >
                  কোনো লেনদেন পাওয়া যায়নি
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ==============================
          MOBILE VIEW (Card Format)
          ============================== */}
      <div className="block md:hidden bg-[#f5f7fa] p-[16px] space-y-[12px]">
        {filteredData?.length > 0 ? (
          filteredData.map((row) => {
            const isIncome = row.type === "income";
            return (
              <div
                key={row.id}
                className="bg-white p-[16px] rounded-[10px] border border-[#e8ecf0] shadow-sm flex flex-col gap-[8px]"
              >
                {/* Date & Amount */}
                <div className="flex justify-between items-center">
                  <span className="text-[0.75rem] text-[#7f8c9a] font-medium">
                    {row.date}
                  </span>
                  <span
                    className={`text-[0.9rem] font-bold ${isIncome ? "text-[#2ecc71]" : "text-[#e74c3c]"}`}
                  >
                    {row.amount}
                  </span>
                </div>

                {/* Description */}
                <div className="text-[0.85rem] font-semibold text-[#2c3e50]">
                  {row.description}
                </div>

                {/* Type & Note */}
                <div className="flex justify-between items-center pt-[4px]">
                  <span
                    className={`inline-flex items-center gap-[4px] py-[3px] px-[10px] rounded-[20px] text-[0.7rem] font-semibold ${
                      isIncome
                        ? "bg-[#eafaf1] text-[#2ecc71]"
                        : "bg-[#fdf2f2] text-[#e74c3c]"
                    }`}
                  >
                    {isIncome ? "↑ আয়" : "↓ ব্যয়"}
                  </span>
                  <span className="text-[0.75rem] text-[#7f8c9a]">
                    {row.note}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-[20px] text-[#7f8c9a] text-[0.82rem] bg-white rounded-[10px] border border-[#e8ecf0]">
            কোনো লেনদেন পাওয়া যায়নি
          </div>
        )}
      </div>
    </div>
  );
}
