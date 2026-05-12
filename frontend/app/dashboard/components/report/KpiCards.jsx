export default function KpiCards({ kpis }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {kpis.map((kpi) => (
        <div
          key={kpi.id}
          className="bg-card rounded-xl p-5 shadow-sm border border-border flex flex-col gap-1.5 transition-shadow hover:shadow-md"
        >
          <div className="text-2xl mb-1">{kpi.icon}</div>
          <div className="text-xs text-muted-foreground font-medium">
            {kpi.label}
          </div>
          <div className={`text-2xl font-bold ${kpi.colorClass}`}>
            {kpi.value}
          </div>
          <div
            className={`text-xs font-semibold ${kpi.changeType === "up" ? "text-primary" : "text-destructive"}`}
          >
            {kpi.changeText}
          </div>
        </div>
      ))}
    </div>
  );
}
