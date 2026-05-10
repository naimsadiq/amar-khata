import { useState } from "react";

export default function TransactionTable({ transactions }) {
  const [search, setSearch] = useState("");
  const formatDate = (d) => new Date(d).toLocaleDateString("en-GB");

  // সার্চ লজিক: ক্যাটাগরি, নোট, নাম বা ফোন নম্বর দিয়ে সার্চ করা যাবে
  const filteredData = transactions
    ?.filter(
      (item) =>
        item.category?.toLowerCase().includes(search.toLowerCase()) ||
        item.note?.toLowerCase().includes(search.toLowerCase()) ||
        item.partyName?.toLowerCase().includes(search.toLowerCase()) ||
        item.partyPhone?.includes(search),
    )
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="bg-white rounded-[12px] border border-[#e8ecf0] overflow-hidden">
      <div className="py-4 px-5 border-b border-[#e8ecf0] flex justify-between items-center">
        <span className="font-bold text-[#2c3e50]">লেনদেনের তালিকা</span>
        <input
          placeholder="নাম, নম্বর বা বিবরণ দিয়ে খোঁজুন..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-[250px] py-1 px-3 border rounded-lg text-sm outline-none"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#f8fafb]">
            <tr>
              <th className="py-3 px-5 text-left text-xs text-[#7f8c9a]">
                তারিখ
              </th>
              <th className="py-3 px-5 text-left text-xs text-[#7f8c9a]">
                বিবরণ
              </th>
              <th className="py-3 px-5 text-left text-xs text-[#7f8c9a]">
                পার্টি ইনফো
              </th>
              <th className="py-3 px-5 text-left text-xs text-[#7f8c9a]">
                ধরন
              </th>
              <th className="py-3 px-5 text-left text-xs text-[#7f8c9a]">
                পরিমাণ
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData?.length > 0 ? (
              filteredData.map((row) => (
                <tr
                  key={row._id}
                  className="border-b hover:bg-slate-50 transition-colors"
                >
                  <td className="py-4 px-5 text-sm text-[#2c3e50]">
                    {formatDate(row.date)}
                  </td>
                  <td className="py-4 px-5 text-sm">
                    <div className="font-semibold text-[#2c3e50]">
                      {row.category.replace(/_/g, " ")}
                    </div>
                    <div className="text-[11px] text-gray-500 italic mt-0.5">
                      {row.note || "কোনো নোট নেই"}
                    </div>
                  </td>
                  <td className="py-4 px-5 text-sm">
                    {row.partyName ? (
                      <div>
                        <div className="font-medium text-[#2c3e50]">
                          {row.partyName}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {row.partyPhone}
                        </div>
                      </div>
                    ) : (
                      <span className="text-[11px] text-gray-400 italic">
                        সাধারণ
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                        row.transactionType === "IN"
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {row.transactionType === "IN" ? "↑ আয়" : "↓ ব্যয়"}
                    </span>
                  </td>
                  <td
                    className={`py-4 px-5 font-bold ${
                      row.transactionType === "IN"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    ৳ {row.amount.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center text-gray-400 text-sm"
                >
                  কোনো লেনদেন পাওয়া যায়নি
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
