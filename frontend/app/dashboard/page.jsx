import data from "@/public/api/dashboard-data.json";
import AlertRow from "./components/overview/AlertRow";
import MonthlyProfit from "./components/overview/MonthlyProfit";
import QuickActions from "./components/overview/QuickActions";
import RecentTransactions from "./components/overview/RecentTransactions";
import StatCards from "./components/overview/StatCards";
import TopProducts from "./components/overview/TopProducts";
import WeeklySalesChart from "./components/overview/WeeklySalesChart";

export default function OverviewPage() {
  return (
    <div className="flex-1 min-w-0 space-y-4 p-4 md:p-8 pt-6">
      <QuickActions />

      <div className="mt-6 space-y-4">
        <StatCards stats={data.stats} />
      </div>

      <div className="mt-6 grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Left */}
        <div className="lg:col-span-2 grid gap-6 grid-cols-1 md:grid-cols-2 min-w-0">
          <WeeklySalesChart
            salesData={data.weeklySales}
            dueData={data.dueReceivables}
          />
          <TopProducts
            products={data.topProducts}
            stockAlerts={data.stockAlerts}
          />
        </div>

        {/* Right */}
        <div className="lg:col-span-1 flex flex-col gap-6 min-w-0">
          <RecentTransactions transactions={data.recentTransactions} />
          <MonthlyProfit profit={data.monthlyProfit} />
        </div>
      </div>
    </div>
  );
}
