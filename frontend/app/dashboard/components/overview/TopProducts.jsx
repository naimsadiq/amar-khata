import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TopProducts({ products, stockAlerts }) {
  const getBadgeVariant = (type) =>
    type === "critical" ? "destructive" : "secondary";

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>শীর্ষ পণ্য</CardTitle>
          <a href="#" className="text-sm text-blue-600">
            সব দেখুন →
          </a>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.rank} className="flex items-center gap-4 text-sm">
              <span className="font-bold text-gray-500">{product.rank}</span>
              <div className="flex-1">
                <p>{product.name}</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div
                    className="bg-green-500 h-1.5 rounded-full"
                    style={{ width: `${product.progress}%` }}
                  ></div>
                </div>
              </div>
              <span className="font-semibold">{product.amount}</span>
            </div>
          ))}
        </div>

        <hr className="my-6" />

        <div>
          <h4 className="text-sm font-semibold text-gray-600 mb-3">
            স্টক সতর্কতা
          </h4>
          <div className="space-y-3">
            {stockAlerts.map((alert, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-sm"
              >
                <div className="flex items-center gap-2">
                  <Badge variant={getBadgeVariant(alert.type)}>
                    {alert.status}
                  </Badge>
                  <span>{alert.name}</span>
                </div>
                <span className="font-medium text-gray-700">
                  {alert.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
