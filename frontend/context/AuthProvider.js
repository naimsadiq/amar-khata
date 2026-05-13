"use client";

import { useEffect, useState } from "react";
import { getMe, logoutUser } from "./authService";
import AuthContext from "./AuthContext";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await getMe();

      setUser(data || null);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    await logoutUser();
    setUser(null);
    window.location.href = "/login";
  };

  // console.log("AuthProvider - Current user:", user, "Loading:", loading);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
