import { Card, CardContent } from "@/components/ui/card";

export default function SummaryCards({ summary }) {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-slate-500 font-medium mb-1">মোট পণ্য</p>
          <h3 className="text-2xl font-bold text-slate-800">
            {summary.totalProducts}
          </h3>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-slate-500 font-medium mb-1">
            স্টক শেষ হচ্ছে
          </p>
          <h3 className="text-2xl font-bold text-[#f39c12]">
            {summary.lowStock}
          </h3>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-slate-500 font-medium mb-1">স্টক নেই</p>
          <h3 className="text-2xl font-bold text-[#e74c3c]">
            {summary.outOfStock}
          </h3>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-slate-500 font-medium mb-1">
            মোট স্টক মূল্য
          </p>
          <h3 className="text-2xl font-bold text-[#2ecc71]">
            {summary.totalValue}
          </h3>
        </CardContent>
      </Card>
    </div>
  );
}
