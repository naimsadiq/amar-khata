"use client";

import * as React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import useAuth from "@/hook/useAuth";

export function BusinessProfile() {
  const { user, loading } = useAuth();

  // ১. লোডিং অবস্থায় স্কেলেটন দেখাবে
  if (loading) {
    return (
      <div className="flex items-center gap-3 w-full px-3 py-2 bg-paper-2 border border-border/50 rounded-md shadow-sm">
        {/* Avatar Skeleton */}
        <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700/50 animate-pulse shrink-0"></div>

        {/* Text Skeleton */}
        <div className="flex flex-col gap-2 w-full overflow-hidden">
          {/* Business Name Line */}
          <div className="h-3.5 bg-gray-200 dark:bg-gray-700/50 rounded w-3/4 animate-pulse"></div>
          {/* Business ID Line */}
          <div className="h-2.5 bg-gray-200 dark:bg-gray-700/50 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>
    );
  }

  // ২. লোডিং শেষ কিন্তু ইউজার নেই, তখন কিছুই দেখাবে না
  if (!user) return null;

  // ৩. ইউজার ডাটা আসলে মূল কম্পোনেন্ট দেখাবে
  const initial = user.businessName
    ? user.businessName.charAt(0).toUpperCase()
    : "B";

  const displayId = user.businessId || "0000";

  return (
    <div className="flex items-center gap-3 w-full px-3 py-2 bg-paper-2 border border-border/50 rounded-md shadow-sm transition-opacity duration-300">
      <Avatar className="h-10 w-10 rounded-md bg-brand-l border border-brand/20">
        <AvatarFallback className="bg-transparent text-brand-d font-bold text-lg">
          {initial}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col text-left overflow-hidden">
        <p
          className="text-sm font-semibold text-ink-1 truncate"
          title={user.businessName}
        >
          {user.businessName || "My Business"}
        </p>
        <p className="text-xs font-medium text-ink-3 mt-0.5">
          ID: <span className="text-brand-d tracking-wide">{displayId}</span>
        </p>
      </div>
    </div>
  );
}
