import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function RecentTransactions({ transactions }) {
  const getAmountColor = (type) =>
    type === "in" || type === "pos" ? "text-green-600" : "text-red-600";
  const getAvatarColor = (type) => {
    if (type === "in") return "bg-green-100 text-green-800";
    if (type === "out") return "bg-red-100 text-red-800";
    return "bg-blue-100 text-blue-800";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>সাম্প্রতিক লেনদেন</CardTitle>
          <a href="#" className="text-sm text-blue-600">
            সব →
          </a>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((txn, index) => (
            <div key={index} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarFallback className={getAvatarColor(txn.transactionType)}>
                  {txn.initials}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{txn.name}</p>
                <p className="text-sm text-muted-foreground">{txn.type}</p>
              </div>
              <div
                className={`ml-auto font-medium ${getAmountColor(txn.transactionType)}`}
              >
                {txn.amount}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
