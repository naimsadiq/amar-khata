"use client";

import * as React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import useAuth from "@/hook/useAuth";

export function BusinessProfile() {
  const { user, loading } = useAuth();

  // ১. ডার্ক মোড সাপোর্টেড স্কেলেটন (Shimmer Effect)
  if (loading) {
    return (
      <div className="flex items-center gap-3 w-full px-3 py-2 bg-muted/50 border border-border rounded-lg shadow-sm">
        <div className="h-10 w-10 rounded-md bg-muted-foreground/20 animate-pulse shrink-0"></div>
        <div className="flex flex-col gap-2 w-full overflow-hidden">
          <div className="h-3.5 bg-muted-foreground/20 rounded-md w-3/4 animate-pulse"></div>
          <div className="h-2.5 bg-muted-foreground/20 rounded-md w-1/2 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const initial = user.businessName
    ? user.businessName.charAt(0).toUpperCase()
    : "B";

  const displayId = user.businessId || "0000";

  return (
    <div className="flex items-center gap-3 w-full px-3 py-2 bg-card border border-border rounded-lg shadow-sm transition-opacity duration-300 hover:bg-muted/50 cursor-pointer">
      <Avatar className="h-10 w-10 rounded-md bg-primary/10 border border-primary/20">
        <AvatarFallback className="bg-transparent text-primary font-bold text-lg">
          {initial}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col text-left overflow-hidden">
        <p
          className="text-sm font-semibold text-foreground truncate"
          title={user.businessName}
        >
          {user.businessName || "My Business"}
        </p>
        <p className="text-xs font-medium text-muted-foreground mt-0.5">
          ID: <span className="text-primary tracking-wide">{displayId}</span>
        </p>
      </div>
    </div>
  );
}
