import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorState({ message = "কিছু একটা সমস্যা হয়েছে!", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-card border border-destructive/20 rounded-xl shadow-sm">
      <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <AlertTriangle className="h-6 w-6 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{message}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        দয়া করে আপনার ইন্টারনেট কানেকশন চেক করুন অথবা আবার চেষ্টা করুন।
      </p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          আবার চেষ্টা করুন
        </Button>
      )}
    </div>
  );
}
