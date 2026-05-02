import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

export default function StatCards({ stats }) {
  const getChangeColor = (type) => {
    if (type === "up") return "text-green-600";
    if (type === "down") return "text-red-600";
    return "text-gray-500";
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p
              className={`text-xs ${getChangeColor(stat.changeType)} flex items-center`}
            >
              {stat.changeType === "up" && <ArrowUp className="h-4 w-4 mr-1" />}
              {stat.changeType === "down" && (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              {stat.change}{" "}
              <span className="text-gray-500 ml-1">{stat.subtext}</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
