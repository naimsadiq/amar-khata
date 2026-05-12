import { Header } from "./components/layout/header";
import { Sidebar } from "./components/layout/sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr] bg-background">
      <Sidebar />
      <div className="flex flex-col min-w-0">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:gap-6 bg-muted/30 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
