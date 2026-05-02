// app/parties/[id]/page.jsx

"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContactDetail from "../../components/parties/ContactDetail";

export default function PartyDetailPage({ params }) {
  const router = useRouter();
  const { id } = React.use(params);
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // API রেডি হলে fetch(`/api/parties/${id}`) ব্যবহার করবেন
      fetch("/data/contacts.json")
        .then((res) => res.json())
        .then((data) => {
          const foundContact = data.find((c) => c.id === id);
          setContact(foundContact);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 font-['Hind_Siliguri']">
        লোড হচ্ছে...
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 font-['Hind_Siliguri']">
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
