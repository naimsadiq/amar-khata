// app/ReactQueryProvider.jsx
"use client"; // এটি ক্লায়েন্ট কম্পোনেন্ট হতে হবে

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function ReactQueryProvider({ children }) {
  // useState এর ভেতর QueryClient রাখা ভালো, যেন পেজ নেভিগেশনের সময় ডেটা হারিয়ে না যায়
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
