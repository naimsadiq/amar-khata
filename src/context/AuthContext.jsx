"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // বর্তমান ইউজার
  const [tempPhone, setTempPhone] = useState(""); // OTP-র জন্য ফোন নম্বর
  const [isLoading, setIsLoading] = useState(true); // লোডিং স্টেট (নতুন যোগ করা হয়েছে)
  const router = useRouter();

  // অ্যাপ লোড হওয়ার পর লোকাল স্টোরেজ চেক করবে
  useEffect(() => {
    // শুধুমাত্র ক্লায়েন্ট সাইডে রান হবে
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("currentUser");
        const usersDb = localStorage.getItem("users_db");

        // যদি ইউজার আগে থেকেই লগিন করা থাকে
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        // ডাটাবেস না থাকলে খালি অবজেক্ট সেট করা (প্রথম বারের জন্য)
        if (!usersDb) {
          localStorage.setItem("users_db", JSON.stringify({}));
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem("currentUser");
      } finally {
        setIsLoading(false); // চেক করা শেষ, লোডিং বন্ধ
      }
    }
  }, []);

  // ১. ফোন নম্বর সাবমিট
  const sendOtp = (phone) => {
    setTempPhone(phone);
    router.push("/otp");
  };

  // ২. OTP ভেরিফাই (লজিক)
  const verifyOtp = (otp) => {
    // লোকাল স্টোরেজ থেকে ডাটাবেস আনা
    const usersDb = JSON.parse(localStorage.getItem("users_db")) || {};

    // চেক করা নম্বরটি ডাটাবেসে আছে কিনা
    if (usersDb[tempPhone]) {
      // --- পুরাতন ইউজার ---
      const existingUser = usersDb[tempPhone];

      // লগিন করানো
      localStorage.setItem("currentUser", JSON.stringify(existingUser));
      setUser(existingUser);
      router.push("/"); // হোম পেজে রিডাইরেক্ট
    } else {
      // --- নতুন ইউজার ---
      router.push("/setup"); // সেটআপ পেজে রিডাইরেক্ট
    }
  };

  // ৩. প্রোফাইল সেটআপ সম্পন্ন করা
  const completeSetup = (name, businessName) => {
    const newUser = {
      phone: tempPhone,
      name: name,
      businessName: businessName,
      joinedAt: new Date().toISOString(),
    };

    // ডাটাবেস আপডেট করা
    const usersDb = JSON.parse(localStorage.getItem("users_db")) || {};
    usersDb[tempPhone] = newUser;
    localStorage.setItem("users_db", JSON.stringify(usersDb));

    // কারেন্ট ইউজার সেট করা
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    setUser(newUser);

    router.push("/");
  };

  // ৪. লগ আউট
  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    router.push("/login");
  };

  // যতক্ষণ লোডিং হচ্ছে, ততক্ষণ কিছু দেখাবে না (বা লোডার দেখাতে পারেন)
  // এটি হাইড্রেশন এরর ফিক্স করতে সাহায্য করে
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ user, sendOtp, verifyOtp, completeSetup, logout, tempPhone }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
