"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";
import ContactDetail from "../../components/parties/ContactDetail";
import api from "@/lib/axiosInstance";

export default function PartyDetailPage({ params }) {
  const router = useRouter();
  const { id } = React.use(params);

  const {
    data: contact,
    isLoading: isContactLoading,
    isError: isContactError,
  } = useQuery({
    queryKey: ["party", id],
    queryFn: async () => (await api.get(`/api/parties/${id}`)).data,
    enabled: !!id,
  });

  const {
    data: transactions,
    isLoading: isTxnLoading,
    isError: isTxnError,
  } = useQuery({
    queryKey: ["transactions", id],
    queryFn: async () => (await api.get(`/api/transactions/${id}`)).data,
    enabled: !!id,
  });

  if (isContactLoading)
    return (
      <div className="p-4 md:p-6">
        <Skeleton className="h-[500px] w-full rounded-2xl bg-card border-border" />
      </div>
    );
  if (isContactError || !contact)
    return (
      <div className="p-4">
        <ErrorState message="গ্রাহক বা সাপ্লায়ারকে খুঁজে পাওয়া যায়নি।" />
      </div>
    );

  return (
    <div className="w-full h-full p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">
              বিস্তারিত তথ্য
            </h1>
            <p className="text-sm text-muted-foreground">
              গ্রাহক/সাপ্লায়ারের প্রোফাইল ও লেনদেনের হিসাব
            </p>
          </div>
        </div>

        <ContactDetail
          contact={contact}
          transactions={transactions}
          isTxnLoading={isTxnLoading}
          isTxnError={isTxnError}
        />
      </div>
    </div>
  );
}
