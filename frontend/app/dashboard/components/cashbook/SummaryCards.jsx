import { Card, CardContent } from "@/components/ui/card";

export default function SummaryCards({ data }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      <Card className="rounded-xl border-border shadow-sm bg-card">
        <CardContent className="p-4 md:p-5">
          <p className="text-xs text-muted-foreground mb-1 md:mb-2 uppercase tracking-wide font-medium">
            মোট আয়
          </p>
          <h2 className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            ৳ {(data?.totalIncome || 0).toLocaleString("en-IN")}
          </h2>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-border shadow-sm bg-card">
        <CardContent className="p-4 md:p-5">
          <p className="text-xs text-muted-foreground mb-1 md:mb-2 uppercase tracking-wide font-medium">
            মোট খরচ
          </p>
          <h2 className="text-xl md:text-2xl font-bold text-destructive">
            ৳ {(data?.totalExpense || 0).toLocaleString("en-IN")}
          </h2>
        </CardContent>
      </Card>

      <Card className="col-span-2 md:col-span-1 rounded-xl border-primary/20 shadow-sm bg-primary/5">
        <CardContent className="p-4 md:p-5">
          <p className="text-xs text-muted-foreground mb-1 md:mb-2 uppercase tracking-wide font-medium">
            নেট ব্যালেন্স
          </p>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            ৳ {(data?.netBalance || 0).toLocaleString("en-IN")}
          </h2>
        </CardContent>
      </Card>
    </div>
  );
}
