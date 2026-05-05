// app/parties/[id]/page.jsx

"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query"; // TanStack Query ইম্পোর্ট
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContactDetail from "../../components/parties/ContactDetail";
import api from "@/lib/axiosInstance";

export default function PartyDetailPage({ params }) {
  const router = useRouter();
  const { id } = React.use(params);

  // TanStack Query দিয়ে সিগেল ডাটা ফেচিং
  const {
    data: contact,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["party", id],
    queryFn: async () => {
      // আপনার API এন্ডপয়েন্ট অনুযায়ী URL ঠিক করে নিন
      const res = await api.get(`http://localhost:5000/api/parties/${id}`);
      return res.data;
    },
    enabled: !!id, // ID না থাকলে Query রান করবে না
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f5f4f0] font-['Hind_Siliguri']">
        <Loader2 className="animate-spin text-[#1a7a4a] h-8 w-8" />
      </div>
    );
  }

  if (isError || !contact) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f5f4f0] text-red-500 font-['Hind_Siliguri']">
        দুঃখিত, এই গ্রাহক বা সাপ্লায়ারকে খুঁজে পাওয়া যায়নি।
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-[#f5f4f0] min-h-screen font-['Hind_Siliguri']">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-5">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 bg-white rounded-full"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">বিস্তারিত তথ্য</h1>
            <p className="text-sm text-gray-500">
              গ্রাহক/সাপ্লায়ারের লেনদেনের হিসাব
            </p>
          </div>
        </div>

        {/* Contact Detail Component */}
        <ContactDetail contact={contact} />
      </div>
    </div>
  );
}
