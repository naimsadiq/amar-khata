import { Card, CardContent } from "@/components/ui/card";

export default function SummaryCards({ data }) {
  const income = data?.totalIncome || 0;
  const expense = data?.totalExpense || 0;
  const balance = data?.netBalance || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="rounded-xl border-gray-100 shadow-sm">
        <CardContent className="p-5">
          <p className="text-xs text-gray-500 mb-2">মোট আয়</p>
          <h2 className="text-2xl font-bold text-[#2ecc71]">
            ৳ {income.toLocaleString("en-IN")}
          </h2>
        </CardContent>
      </Card>
      <Card className="rounded-xl border-gray-100 shadow-sm">
        <CardContent className="p-5">
          <p className="text-xs text-gray-500 mb-2">মোট খরচ</p>
          <h2 className="text-2xl font-bold text-[#e74c3c]">
            ৳ {expense.toLocaleString("en-IN")}
          </h2>
        </CardContent>
      </Card>
      <Card className="rounded-xl border-gray-100 shadow-sm">
        <CardContent className="p-5">
          <p className="text-xs text-gray-500 mb-2">নেট ব্যালেন্স</p>
          <h2 className="text-2xl font-bold text-gray-800">
            ৳ {balance.toLocaleString("en-IN")}
          </h2>
        </CardContent>
      </Card>
    </div>
  );
}
