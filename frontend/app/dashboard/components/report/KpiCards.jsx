export default function KpiCards({ kpis }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px] mb-[22px]">
      {kpis.map((kpi) => (
        <div
          key={kpi.id}
          className="bg-white rounded-[14px] p-[18px_20px] shadow-[0_2px_12px_rgba(26,34,54,0.07)] border border-[#e4e8f0] flex flex-col gap-[4px]"
        >
          <div className="text-[22px] mb-[4px]">{kpi.icon}</div>
          <div className="text-[11px] text-[#7a8aaa] font-medium">
            {kpi.label}
          </div>
          <div className={`text-[22px] font-bold ${kpi.colorClass}`}>
            {kpi.value}
          </div>
          <div
            className={`text-[11px] font-semibold ${kpi.changeType === "up" ? "text-[#2ea86b]" : "text-[#e53935]"}`}
          >
            {kpi.changeText}
          </div>
        </div>
      ))}
    </div>
  );
}
