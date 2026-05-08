"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContactDetail from "../../components/parties/ContactDetail";
import TransactionTable from "../../components/parties/TransactionTable"; // নতুন টেবিল কম্পোনেন্ট
import api from "@/lib/axiosInstance";

export default function PartyDetailPage({ params }) {
  const router = useRouter();
  const { id } = React.use(params);

  // ১. পার্টির বিস্তারিত ডাটা ফেচিং
  const {
    data: contact,
    isLoading: isContactLoading,
    isError: isContactError,
  } = useQuery({
    queryKey: ["party", id],
    queryFn: async () => {
      const res = await api.get(`/api/parties/${id}`); // লোকালহোস্ট URL base URL-এ কনফিগার করা থাকলে শুধু পাথ দিন
      return res.data;
    },
    enabled: !!id,
  });

  // ২. পার্টির লেনদেনের (transactions) ডাটা ফেচিং
  const {
    data: transactions,
    isLoading: isTxnLoading,
    isError: isTxnError,
  } = useQuery({
    queryKey: ["transactions", id],
    queryFn: async () => {
      // নতুন ব্যাকএন্ড API এর পাথ
      const res = await api.get(`/api/transactions/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isContactLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f5f4f0] font-['Hind_Siliguri']">
        <Loader2 className="animate-spin text-[#1a7a4a] h-8 w-8" />
      </div>
    );
  }

  if (isContactError || !contact) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f5f4f0] text-red-500 font-['Hind_Siliguri']">
        দুঃখিত, এই গ্রাহক বা সাপ্লায়ারকে খুঁজে পাওয়া যায়নি।
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-[#f5f4f0] min-h-screen font-['Hind_Siliguri']">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 bg-white rounded-full border-gray-200 shadow-sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 text-gray-700" />
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              বিস্তারিত তথ্য
            </h1>
            <p className="text-sm text-gray-500">
              গ্রাহক/সাপ্লায়ারের প্রোফাইল ও লেনদেনের হিসাব
            </p>
          </div>
        </div>

        {/* Contact Detail Profile Component */}
        <ContactDetail
          contact={contact}
          totalTxns={transactions?.length || 0}
        />

        {/* Transaction Table Component */}
        <TransactionTable
          transactions={transactions}
          isLoading={isTxnLoading}
          isError={isTxnError}
        />
      </div>
    </div>
  );
}
