"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tempPhone, setTempPhone] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("currentUser");
        const usersDb = localStorage.getItem("users_db");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        if (!usersDb) {
          localStorage.setItem("users_db", JSON.stringify({}));
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem("currentUser");
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  const sendOtp = (phone) => {
    setTempPhone(phone);
    router.push("/otp");
  };

  const verifyOtp = (otp) => {
    const usersDb = JSON.parse(localStorage.getItem("users_db")) || {};

    if (usersDb[tempPhone]) {
      const existingUser = usersDb[tempPhone];

      localStorage.setItem("currentUser", JSON.stringify(existingUser));
      setUser(existingUser);
      router.push("/");
    } else {
      router.push("/setup");
    }
  };

  const completeSetup = (name, businessName) => {
    const newUser = {
      phone: tempPhone,
      name: name,
      businessName: businessName,
      joinedAt: new Date().toISOString(),
    };

    const usersDb = JSON.parse(localStorage.getItem("users_db")) || {};
    usersDb[tempPhone] = newUser;
    localStorage.setItem("users_db", JSON.stringify(usersDb));

    localStorage.setItem("currentUser", JSON.stringify(newUser));
    setUser(newUser);

    router.push("/");
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    router.push("/login");
  };

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
