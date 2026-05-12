export default function ChartsSection({ barData, donutData }) {
  const allValues = [...(barData?.income || []), ...(barData?.expense || [])];
  const maxVal = allValues.length > 0 ? Math.max(...allValues, 10) : 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
      {/* Bar Chart */}
      <div className="lg:col-span-2 bg-card rounded-xl p-5 shadow-sm border border-border">
        <div className="text-sm font-bold mb-4 flex justify-between items-center text-foreground">
          আয় ও ব্যয়ের তুলনা
          <div className="flex gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-2.5 h-2.5 rounded-full bg-primary"></div> আয়
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-2.5 h-2.5 rounded-full bg-destructive"></div>{" "}
              ব্যয়
            </div>
          </div>
        </div>

        <div className="flex items-end gap-2 md:gap-3 h-40 overflow-x-auto w-full hide-scrollbar">
          {barData?.months.map((m, i) => {
            const inH = Math.round(((barData.income[i] || 0) / maxVal) * 140);
            const exH = Math.round(((barData.expense[i] || 0) / maxVal) * 140);
            const isActive = i === barData.currentMonthIndex;
            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-1 h-full justify-end min-w-[32px]"
              >
                <div className="flex gap-1 items-end">
                  <div
                    className="w-3 md:w-4 rounded-t-sm transition-opacity hover:opacity-80 bg-primary"
                    style={{ height: `${inH}px`, opacity: isActive ? 1 : 0.55 }}
                    title={`আয়: ৳${barData.income[i]}হাজার`}
                  ></div>
                  <div
                    className="w-3 md:w-4 rounded-t-sm transition-opacity hover:opacity-80 bg-destructive"
                    style={{ height: `${exH}px`, opacity: isActive ? 1 : 0.55 }}
                    title={`ব্যয়: ৳${barData.expense[i]}হাজার`}
                  ></div>
                </div>
                <div
                  className={`text-[10px] md:text-xs text-center ${isActive ? "font-bold text-primary" : "text-muted-foreground"}`}
                >
                  {m}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Donut Chart */}
      <div className="bg-card rounded-xl p-5 shadow-sm border border-border flex flex-col">
        <div className="text-sm font-bold mb-4 text-foreground">
          ব্যয়ের বিভাগ
        </div>
        <div className="flex flex-col items-center justify-center flex-1">
          <svg className="w-32 h-32 mb-4" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="14"
            />
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="var(--color-primary)"
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
              stroke="var(--color-chart-2)"
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
              stroke="var(--color-chart-3)"
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
              stroke="var(--color-destructive)"
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
              fill="currentColor"
              className="text-foreground font-bold"
            >
              মোট
            </text>
            <text
              x="50"
              y="57"
              textAnchor="middle"
              fontSize="8"
              fill="currentColor"
              className="text-muted-foreground"
            >
              ব্যয়
            </text>
          </svg>
          <div className="w-full space-y-2">
            {donutData?.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between pb-2 border-b border-border last:border-none last:pb-0 text-xs"
              >
                <div className="flex items-center gap-2 text-foreground">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: d.color }}
                  ></div>
                  {d.label}
                </div>
                <div className="font-bold" style={{ color: d.color }}>
                  {d.pct}
                </div>
              </div>
            ))}
            {donutData?.length === 0 && (
              <div className="text-center text-muted-foreground text-xs mt-2">
                কোনো ব্যয়ের ডাটা নেই
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
