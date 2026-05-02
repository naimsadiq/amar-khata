const typeClasses = {
  red: "bg-red-100 text-red-800",
  amber: "bg-amber-100 text-amber-800",
  blue: "bg-blue-100 text-blue-800",
  green: "bg-green-100 text-green-800",
};
const dotClasses = {
  red: "bg-red-500",
  amber: "bg-amber-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
};

export default function AlertRow({ alerts }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {alerts.map((alert, index) => (
        <div
          key={index}
          className={`p-3 rounded-lg flex items-center justify-between ${typeClasses[alert.type]}`}
        >
          <div className="flex items-center">
            <span
              className={`h-2.5 w-2.5 rounded-full mr-2 ${dotClasses[alert.type]}`}
            ></span>
            <span className="text-sm font-medium">{alert.text}</span>
          </div>
          <span className="text-sm font-bold">{alert.count}</span>
        </div>
      ))}
    </div>
  );
}
