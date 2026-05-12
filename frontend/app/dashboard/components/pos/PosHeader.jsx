export default function PosHeader({ billNo }) {
  return (
    <div className="bg-card border-b border-border px-4 lg:px-6 h-[56px] flex items-center justify-between shrink-0 shadow-sm z-10">
      <span className="text-lg font-bold text-foreground">POS / বিলিং</span>
      <div className="flex gap-3 items-center">
        <span className="text-xs text-muted-foreground font-medium bg-muted/50 px-2.5 py-1.5 rounded border border-border">
          {billNo}
        </span>
        <button className="px-4 py-1.5 bg-background border border-border rounded-md text-sm font-semibold text-foreground cursor-pointer hover:border-primary hover:text-primary transition-colors shadow-sm">
          পুরনো বিল
        </button>
      </div>
    </div>
  );
}
