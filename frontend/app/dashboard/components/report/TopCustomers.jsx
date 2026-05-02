export default function TopCustomers({ topCustomers }) {
  return (
    <div className="bg-white rounded-[14px] shadow-[0_2px_12px_rgba(26,34,54,0.07)] border border-[#e4e8f0] overflow-hidden">
      <div className="p-[16px_20px] border-b border-[#e4e8f0] text-[14px] font-bold text-[#1a2236]">
        🏆 শীর্ষ গ্রাহক (এপ্রিল ২০২৬)
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-[9px_16px] text-[11px] font-semibold text-[#7a8aaa] text-left bg-[#f4f6fb] border-b border-[#e4e8f0] whitespace-nowrap">
                #
              </th>
              <th className="p-[9px_16px] text-[11px] font-semibold text-[#7a8aaa] text-left bg-[#f4f6fb] border-b border-[#e4e8f0] whitespace-nowrap">
                নাম
              </th>
              <th className="p-[9px_16px] text-[11px] font-semibold text-[#7a8aaa] text-left bg-[#f4f6fb] border-b border-[#e4e8f0] whitespace-nowrap">
                লেনদেন
              </th>
              <th className="p-[9px_16px] text-[11px] font-semibold text-[#7a8aaa] text-right bg-[#f4f6fb] border-b border-[#e4e8f0] whitespace-nowrap">
                মোট (৳)
              </th>
              <th className="p-[9px_16px] text-[11px] font-semibold text-[#7a8aaa] text-left bg-[#f4f6fb] border-b border-[#e4e8f0] whitespace-nowrap">
                অগ্রগতি
              </th>
            </tr>
          </thead>
          <tbody>
            {topCustomers.map((c) => (
              <tr
                key={c.id}
                className="border-b border-[#e4e8f0] hover:bg-[#e8f5ee] transition-colors last:border-none"
              >
                <td className="p-[10px_16px]">
                  <span
                    className={`inline-flex items-center justify-center w-[22px] h-[22px] rounded-full text-[11px] font-bold ${c.rankBg} ${c.rankColor}`}
                  >
                    {c.rank}
                  </span>
                </td>
                <td className="p-[10px_16px] font-semibold text-[#1a2236] text-[12px] whitespace-nowrap">
                  {c.name}
                </td>
                <td className="p-[10px_16px] text-[#7a8aaa] text-[12px]">
                  {c.txn}
                </td>
                <td className="p-[10px_16px] text-right font-bold text-[#2ea86b] text-[12px] whitespace-nowrap">
                  {c.total}
                </td>
                <td className="p-[10px_16px]">
                  <div className="w-[80px] bg-[#f4f6fb] rounded-[10px] h-[6px]">
                    <div
                      className="h-[6px] rounded-[10px] bg-[#2ea86b]"
                      style={{ width: `${c.progress}%` }}
                    ></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
