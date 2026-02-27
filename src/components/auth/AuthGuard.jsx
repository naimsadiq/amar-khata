"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthGuard({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // যে পেজগুলোতে লগিন ছাড়াই ঢোকা যাবে (Public Routes)
  const publicRoutes = ["/login", "/otp", "/setup"];

  useEffect(() => {
    // যদি লোডিং শেষ হয়, তখনই চেক করবে
    if (!isLoading) {
      const isPublicRoute = publicRoutes.includes(pathname);

      if (!user && !isPublicRoute) {
        // ১. যদি ইউজার লগিন না থাকে এবং প্রাইভেট পেজে যেতে চায় -> লগিন পেজে পাঠাও
        router.push("/login");
      } else if (user && isPublicRoute) {
        // ২. যদি ইউজার অলরেডি লগিন থাকে এবং লগিন/ওটিপি পেজে যেতে চায় -> হোম পেজে পাঠাও
        router.push("/");
      }
    }
  }, [user, isLoading, pathname, router,]);

  // লোডিং অবস্থায় কিছুই দেখাবে না বা লোডার দেখাবে
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f2fcf6]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#10b981]"></div>
      </div>
    );
  }

  // ইউজার লগিন না থাকলে এবং প্রাইভেট রাউটে থাকলে কন্টেন্ট রেন্ডার করবে না (ফ্লিকারিং বন্ধ করতে)
  if (!user && !publicRoutes.includes(pathname)) {
    return null;
  }

  return <>{children}</>;
}
