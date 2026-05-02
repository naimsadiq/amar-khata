import { Card, CardContent } from "@/components/ui/card";

export default function SummaryCards({ data }) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Income Card */}
      <Card className="rounded-xl border-gray-100 shadow-sm">
        <CardContent className="p-5">
          <p className="text-xs text-gray-500 mb-2">মোট আয় (এই মাস)</p>
          <h2 className="text-2xl font-bold text-[#2ecc71]">
            ৳{data.totalIncome}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {data.incomeTrend} গত মাসের তুলনায়
          </p>
        </CardContent>
      </Card>

      {/* Expense Card */}
      <Card className="rounded-xl border-gray-100 shadow-sm">
        <CardContent className="p-5">
          <p className="text-xs text-gray-500 mb-2">মোট খরচ (এই মাস)</p>
          <h2 className="text-2xl font-bold text-[#e74c3c]">
            ৳{data.totalExpense}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {data.expenseTrend} গত মাসের তুলনায়
          </p>
        </CardContent>
      </Card>

      {/* Net Balance Card */}
      <Card className="rounded-xl border-gray-100 shadow-sm">
        <CardContent className="p-5">
          <p className="text-xs text-gray-500 mb-2">নেট ব্যালেন্স</p>
          <h2 className="text-2xl font-bold text-gray-800">
            ৳{data.netBalance}
          </h2>
          <p className="text-xs text-gray-400 mt-1">হাতে নগদ</p>
        </CardContent>
      </Card>
    </div>
  );
}
