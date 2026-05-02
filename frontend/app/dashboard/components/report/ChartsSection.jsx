export default function ChartsSection({ barData, donutData }) {
  const maxVal = 65;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-[16px] mb-[22px]">
      {/* Bar Chart (Takes 2 columns on desktop) */}
      <div className="lg:col-span-2 bg-white rounded-[14px] p-[20px] shadow-[0_2px_12px_rgba(26,34,54,0.07)] border border-[#e4e8f0]">
        <div className="text-[14px] font-bold mb-[16px] flex justify-between items-center text-[#1a2236]">
          আয় ও ব্যয়ের তুলনা
          <div className="flex gap-[14px]">
            <div className="flex items-center gap-[5px] text-[11px] text-[#7a8aaa]">
              <div className="w-[10px] h-[10px] rounded-full bg-[#2ea86b]"></div>{" "}
              আয়
            </div>
            <div className="flex items-center gap-[5px] text-[11px] text-[#7a8aaa]">
              <div className="w-[10px] h-[10px] rounded-full bg-[#f87171]"></div>{" "}
              ব্যয়
            </div>
          </div>
        </div>

        <div className="flex items-end gap-[10px] h-[160px] px-[4px] overflow-x-auto w-full">
          {barData.months.map((m, i) => {
            const inH = Math.round((barData.income[i] / maxVal) * 140);
            const exH = Math.round((barData.expense[i] / maxVal) * 140);
            const isActive = i === barData.currentMonthIndex;
            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-[4px] h-full justify-end min-w-[30px]"
              >
                <div className="flex gap-[3px] items-end">
                  <div
                    className={`w-[14px] rounded-t-[4px] transition-opacity hover:opacity-80 bg-[#2ea86b]`}
                    style={{ height: `${inH}px`, opacity: isActive ? 1 : 0.55 }}
                    title={`আয়: ৳${barData.income[i]}হাজার`}
                  ></div>
                  <div
                    className={`w-[14px] rounded-t-[4px] transition-opacity hover:opacity-80 bg-[#f87171]`}
                    style={{ height: `${exH}px`, opacity: isActive ? 1 : 0.55 }}
                    title={`ব্যয়: ৳${barData.expense[i]}হাজার`}
                  ></div>
                </div>
                <div
                  className="text-[10px] text-center"
                  style={{
                    fontWeight: isActive ? 700 : 400,
                    color: isActive ? "#2ea86b" : "#7a8aaa",
                  }}
                >
                  {m}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Donut Chart (Takes 1 column on desktop) */}
      <div className="bg-white rounded-[14px] p-[20px] shadow-[0_2px_12px_rgba(26,34,54,0.07)] border border-[#e4e8f0]">
        <div className="text-[14px] font-bold mb-[16px] text-[#1a2236]">
          ব্যয়ের বিভাগ
        </div>
        <div className="flex flex-col items-center">
          <svg className="w-[130px] h-[130px] mb-[14px]" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="#e4e8f0"
              strokeWidth="14"
            />
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="#2ea86b"
              strokeWidth="14"
              strokeDasharray="92 128"
              strokeDashoffset="35"
              transform="rotate(-90 50 50)"
            />
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="14"
              strokeDasharray="62 158"
              strokeDashoffset="-57"
              transform="rotate(-90 50 50)"
            />
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="14"
              strokeDasharray="40 180"
              strokeDashoffset="-119"
              transform="rotate(-90 50 50)"
            />
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="#f87171"
              strokeWidth="14"
              strokeDasharray="26 194"
              strokeDashoffset="-159"
              transform="rotate(-90 50 50)"
            />
            <text
              x="50"
              y="47"
              textAnchor="middle"
              fontSize="10"
              fill="#1a2236"
              fontWeight="700"
            >
              মোট
            </text>
            <text x="50" y="57" textAnchor="middle" fontSize="8" fill="#7a8aaa">
              ব্যয়
            </text>
          </svg>
          <div className="w-full">
            {donutData.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between py-[5px] border-b border-[#e4e8f0] last:border-none text-[12px]"
              >
                <div className="flex items-center gap-[7px] text-[#1a2236]">
                  <div
                    className="w-[9px] h-[9px] rounded-full"
                    style={{ backgroundColor: d.color }}
                  ></div>
                  {d.label}
                </div>
                <div className="font-bold" style={{ color: d.color }}>
                  {d.pct}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
