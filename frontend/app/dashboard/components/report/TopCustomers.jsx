export default function TopCustomers({ topCustomers }) {
  const currentMonthName = new Intl.DateTimeFormat("bn-BD", {
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden flex flex-col">
      <div className="p-4 md:p-5 border-b border-border text-sm font-bold text-foreground">
        🏆 শীর্ষ গ্রাহক ({currentMonthName})
      </div>

      <div className="flex-1 overflow-auto">
        {topCustomers?.length > 0 ? (
          <>
            {/* Desktop Table View (Hidden on Mobile) */}
            <div className="hidden md:block">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground text-left border-b border-border">
                      #
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground text-left border-b border-border">
                      নাম
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground text-center border-b border-border">
                      লেনদেন
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground text-right border-b border-border">
                      মোট (৳)
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground text-left border-b border-border">
                      অগ্রগতি
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topCustomers.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-border hover:bg-muted/30 transition-colors last:border-none"
                    >
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold ${c.rankBg} ${c.rankColor}`}
                        >
                          {c.rank}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-foreground text-xs">
                        {c.name}
                      </td>
                      <td className="px-4 py-3 text-center text-muted-foreground text-xs">
                        {c.txn} টি
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-primary text-xs whitespace-nowrap">
                        ৳ {c.total}
                      </td>
                      <td className="px-4 py-3 w-[100px]">
                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${c.progress}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View (Hidden on Desktop) */}
            <div className="block md:hidden p-4 space-y-3">
              {topCustomers.map((c) => (
                <div
                  key={c.id}
                  className="bg-background border border-border p-3 rounded-lg flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${c.rankBg} ${c.rankColor}`}
                      >
                        {c.rank}
                      </span>
                      <div className="font-bold text-foreground text-sm">
                        {c.name}
                      </div>
                    </div>
                    <div className="font-bold text-primary text-sm">
                      ৳ {c.total}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>মোট লেনদেন: {c.txn} টি</span>
                    <span className="font-medium text-foreground">
                      {Math.round(c.progress)}% পটেনশিয়াল
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-1">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${c.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
            এই মাসে এখনো কোনো বিক্রি হয়নি
          </div>
        )}
      </div>
    </div>
  );
}
