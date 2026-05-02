import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function MonthlyProfit({ profit }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>এই মাসের লাভ/ক্ষতি</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>মোট আয়</span>
          <span className="font-medium text-green-600">
            {profit.totalIncome}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span>মোট খরচ</span>
          <span className="font-medium text-red-600">
            {profit.totalExpense}
          </span>
        </div>
        <div className="flex justify-between font-semibold text-base pt-2 border-t mt-2">
          <span>নেট লাভ</span>
          <span>{profit.netProfit}</span>
        </div>
      </CardContent>
    </Card>
  );
}
