import { Card, CardContent } from "@/components/ui/card";

export default function SummaryCards({ summary }) {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="border-none shadow-sm">
        <CardContent className="p-5">
          <p className="text-[13px] text-slate-500 font-semibold mb-1">
            মোট পণ্য
          </p>
          <h3 className="text-2xl font-bold text-slate-800">
            {summary.totalProducts.toLocaleString("en-IN")} টি
          </h3>
        </CardContent>
      </Card>
      <Card className="border-none shadow-sm">
        <CardContent className="p-5">
          <p className="text-[13px] text-slate-500 font-semibold mb-1">
            স্টক শেষ হচ্ছে
          </p>
          <h3 className="text-2xl font-bold text-[#f39c12]">
            {summary.lowStock.toLocaleString("en-IN")} টি
          </h3>
        </CardContent>
      </Card>
      <Card className="border-none shadow-sm">
        <CardContent className="p-5">
          <p className="text-[13px] text-slate-500 font-semibold mb-1">
            স্টক নেই
          </p>
          <h3 className="text-2xl font-bold text-[#e74c3c]">
            {summary.outOfStock.toLocaleString("en-IN")} টি
          </h3>
        </CardContent>
      </Card>
      <Card className="border-none shadow-sm">
        <CardContent className="p-5">
          <p className="text-[13px] text-slate-500 font-semibold mb-1">
            মোট স্টক মূল্য
          </p>
          <h3 className="text-2xl font-bold text-[#2ecc71]">
            ৳ {summary.totalValue.toLocaleString("en-IN")}
          </h3>
        </CardContent>
      </Card>
    </div>
  );
}
