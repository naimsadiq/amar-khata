import { Card, CardContent } from "@/components/ui/card";

export default function SummaryCards({ summary }) {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      <Card className="border-border shadow-sm bg-card">
        <CardContent className="p-4 md:p-5">
          <p className="text-[11px] md:text-xs text-muted-foreground font-semibold mb-1 uppercase tracking-wide">
            মোট পণ্য
          </p>
          <h3 className="text-xl md:text-2xl font-bold text-foreground">
            {summary.totalProducts.toLocaleString("en-IN")} টি
          </h3>
        </CardContent>
      </Card>
      <Card className="border-border shadow-sm bg-card">
        <CardContent className="p-4 md:p-5">
          <p className="text-[11px] md:text-xs text-muted-foreground font-semibold mb-1 uppercase tracking-wide">
            স্টক শেষ হচ্ছে
          </p>
          <h3 className="text-xl md:text-2xl font-bold text-amber-600 dark:text-amber-500">
            {summary.lowStock.toLocaleString("en-IN")} টি
          </h3>
        </CardContent>
      </Card>
      <Card className="border-border shadow-sm bg-card">
        <CardContent className="p-4 md:p-5">
          <p className="text-[11px] md:text-xs text-muted-foreground font-semibold mb-1 uppercase tracking-wide">
            স্টক নেই
          </p>
          <h3 className="text-xl md:text-2xl font-bold text-destructive">
            {summary.outOfStock.toLocaleString("en-IN")} টি
          </h3>
        </CardContent>
      </Card>
      <Card className="border-border shadow-sm bg-card">
        <CardContent className="p-4 md:p-5">
          <p className="text-[11px] md:text-xs text-muted-foreground font-semibold mb-1 uppercase tracking-wide">
            মোট স্টক মূল্য
          </p>
          <h3 className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            ৳ {summary.totalValue.toLocaleString("en-IN")}
          </h3>
        </CardContent>
      </Card>
    </div>
  );
}
