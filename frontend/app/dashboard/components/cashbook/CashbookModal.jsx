"use client";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axiosInstance";
import Select from "react-select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";

export default function CashbookModal({ isOpen, onClose, type }) {
  const queryClient = useQueryClient();
  const isIncome = type === "IN";

  const categories = isIncome
    ? [
        { value: "Customer_Collection", label: "কাস্টমার থেকে বকেয়া আদায়" },
        { value: "Direct_Sale", label: "সরাসরি পণ্য বিক্রয়" },
        { value: "Other_Income", label: "অন্যান্য আয়" },
      ]
    : [
        { value: "Supplier_Payment", label: "সাপ্লায়ারকে পেমেন্ট" },
        { value: "Salary", label: "কর্মচারীর বেতন" },
        { value: "Rent", label: "দোকান ভাড়া" },
        { value: "Other_Expense", label: "অন্যান্য খরচ" },
      ];

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      category: isIncome ? "Customer_Collection" : "Supplier_Payment",
      partyId: null,
      amount: "",
      referenceNo: "",
      note: "",
    },
  });

  // Modal ওপেন হলে ফর্ম রিসেট করা এবং সঠিক ডিফল্ট ক্যাটাগরি সেট করা (এটি যোগ করা হয়েছে)
  useEffect(() => {
    if (isOpen) {
      reset({
        date: new Date().toISOString().split("T")[0],
        category: isIncome ? "Customer_Collection" : "Supplier_Payment",
        partyId: null,
        amount: "",
        referenceNo: "",
        note: "",
      });
    }
  }, [isOpen, isIncome, reset]);

  const selectedCategory = watch("category");
  // const selectedParty = watch("partyId");

  const showPartyDropdown =
    selectedCategory === "Customer_Collection" ||
    selectedCategory === "Supplier_Payment";

  // Category বদলালে party ও referenceNo রিসেট করা
  useEffect(() => {
    setValue("partyId", null);
    setValue("referenceNo", "");
    setValue("amount", "");
  }, [selectedCategory, setValue]);

  // Parties ফেচ করা
  const { data: parties = [] } = useQuery({
    queryKey: ["parties"],
    queryFn: async () => {
      const res = await api.get("/api/parties");
      return res.data;
    },
    enabled: isOpen,
  });

  // কাস্টমার/সাপ্লায়ার ফিল্টার — শুধু বকেয়া আছে এমন
  const filteredParties = parties.filter((p) => {
    if (selectedCategory === "Customer_Collection")
      return p.type === "customer" && p.currentDue > 0;
    if (selectedCategory === "Supplier_Payment")
      return p.type === "supplier" && p.currentDue > 0;
    return true;
  });

  const partyOptions = filteredParties.map((p) => ({
    value: p._id,
    label: `${p.name} (${p.phone}) — বকেয়া: ${p.currentDue || 0} ৳`,
  }));

  // সাবমিট মিউটেশন
  const mutation = useMutation({
    mutationFn: async (formData) => {
      // console.log(formData);
      const res = await api.post("/api/cashbook", formData);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({ icon: "success", title: "সফল!", text: "লেনদেন সেভ হয়েছে।" });
      queryClient.invalidateQueries({ queryKey: ["cashbook"] });
      queryClient.invalidateQueries({ queryKey: ["parties"] });
      reset();
      onClose();
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "ভুল হয়েছে!",
        text: error.response?.data?.message || "কিছু একটা সমস্যা হয়েছে।",
      });
    },
  });

  const onSubmit = (data) => {
    // এখানে আমরা সিলেক্ট করা পার্টি থেকে নাম ও ফোন বের করে নিচ্ছি
    // data.partyId হলো react-select এর ভ্যালু (যা আপনি Controller এ সেট করেছেন)
    const selectedPartyData = data.partyId
      ? parties.find((p) => p._id === data.partyId.value)
      : null;

    const payload = {
      ...data,
      transactionType: type,
      amount: Number(data.amount),
      partyId: data.partyId ? data.partyId.value : null,

      // নতুন: নাম ও ফোন যোগ করা
      partyName: selectedPartyData ? selectedPartyData.name : null,
      partyPhone: selectedPartyData ? selectedPartyData.phone : null,

      partyModel:
        selectedCategory === "Customer_Collection"
          ? "Customer"
          : selectedCategory === "Supplier_Payment"
            ? "Supplier"
            : null,
    };

    mutation.mutate(payload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] rounded-2xl p-6 overflow-y-auto max-h-[90vh] min-h-[420px]">
        <DialogHeader>
          <DialogTitle
            className={`text-lg font-bold ${isIncome ? "text-[#2ecc71]" : "text-[#e74c3c]"}`}
          >
            {isIncome ? "টাকা পেলাম (Cash In)" : "টাকা দিলাম (Cash Out)"}
          </DialogTitle>
          <DialogDescription>লেনদেনের বিবরণ নিচে লিখুন।</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* ক্যাটাগরি এবং তারিখ */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">
                খাত (Category) *
              </label>
              <select
                {...register("category", { required: true })}
                className="w-full h-10 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">
                তারিখ *
              </label>
              <Input
                type="date"
                {...register("date", { required: true })}
                className="h-10 text-sm"
              />
            </div>
          </div>

          {/* পার্টি সার্চেবল ড্রপডাউন — শুধু Customer_Collection বা Supplier_Payment এ */}
          {showPartyDropdown && (
            <div>
              <label className="text-xs text-gray-600 mb-1 block">
                {selectedCategory === "Customer_Collection"
                  ? "কাস্টমার"
                  : "সাপ্লায়ার"}{" "}
                সার্চ করুন *
              </label>
              <Controller
                name="partyId"
                control={control}
                rules={{ required: "এই ঘরটি পূরণ করা আবশ্যক" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={partyOptions}
                    placeholder="নাম বা মোবাইল নম্বর লিখুন..."
                    isClearable
                    noOptionsMessage={() =>
                      filteredParties.length === 0
                        ? "কোনো বকেয়া নেই"
                        : "পাওয়া যায়নি"
                    }
                    className="text-sm"
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        minHeight: "40px",
                        borderRadius: "0.5rem",
                        borderColor: errors.partyId
                          ? "#ef4444"
                          : state.isFocused
                            ? "#3b82f6"
                            : "#e2e8f0",
                        boxShadow: state.isFocused
                          ? "0 0 0 2px rgba(59,130,246,0.3)"
                          : "none",
                      }),
                    }}
                  />
                )}
              />
              {errors.partyId && (
                <p className="text-[11px] text-red-500 mt-1">
                  {errors.partyId.message}
                </p>
              )}
              {/* বকেয়া কেউ না থাকলে সহায়ক বার্তা */}
              {partyOptions.length === 0 && (
                <p className="text-[11px] text-amber-500 mt-1">
                  {selectedCategory === "Customer_Collection"
                    ? "বকেয়া আছে এমন কোনো কাস্টমার নেই।"
                    : "বকেয়া আছে এমন কোনো সাপ্লায়ার নেই।"}
                </p>
              )}
            </div>
          )}

          {/* মেমো / রেফারেন্স নম্বর — Manual Input (ঐচ্ছিক) */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">
              মেমো / রেফারেন্স নং{" "}
              <span className="text-gray-400">(ঐচ্ছিক)</span>
            </label>
            <Input
              type="text"
              {...register("referenceNo")}
              placeholder="যেমন: INV-001 বা MEM-045"
              className="h-10 text-sm"
            />
          </div>

          {/* টাকার পরিমাণ */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">
              পরিমাণ (টাকা) *
            </label>
            <Input
              type="number"
              step="any"
              {...register("amount", {
                required: "পরিমাণ অবশ্যই দিতে হবে",
                min: { value: 1, message: "পরিমাণ ১ এর কম হতে পারবে না" },
              })}
              placeholder="0.00"
              className="h-10 text-sm text-lg font-semibold"
            />
            {errors.amount && (
              <p className="text-[11px] text-red-500 mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* নোট */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">
              নোট বা বিবরণ <span className="text-gray-400">(ঐচ্ছিক)</span>
            </label>
            <textarea
              {...register("note")}
              placeholder="বিস্তারিত লিখুন..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* বাটনসমূহ */}
          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              বাতিল
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending || !isValid}
              className={`flex-[2] text-white transition-opacity ${
                isIncome
                  ? "bg-[#2ecc71] hover:bg-[#27ae60]"
                  : "bg-[#e74c3c] hover:bg-[#c0392b]"
              } ${!isValid || mutation.isPending ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {mutation.isPending ? "সেভ হচ্ছে..." : "সেভ করুন"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
