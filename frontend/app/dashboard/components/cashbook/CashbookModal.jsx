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
  const showPartyDropdown =
    selectedCategory === "Customer_Collection" ||
    selectedCategory === "Supplier_Payment";

  useEffect(() => {
    setValue("partyId", null);
    setValue("referenceNo", "");
    setValue("amount", "");
  }, [selectedCategory, setValue]);

  const { data: parties = [] } = useQuery({
    queryKey: ["parties"],
    queryFn: async () => (await api.get("/api/parties")).data,
    enabled: isOpen,
  });

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

  const mutation = useMutation({
    mutationFn: async (formData) =>
      (await api.post("/api/cashbook", formData)).data,
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
    const selectedPartyData = data.partyId
      ? parties.find((p) => p._id === data.partyId.value)
      : null;
    mutation.mutate({
      ...data,
      transactionType: type,
      amount: Number(data.amount),
      partyId: data.partyId ? data.partyId.value : null,
      partyName: selectedPartyData ? selectedPartyData.name : null,
      partyPhone: selectedPartyData ? selectedPartyData.phone : null,
      partyModel:
        selectedCategory === "Customer_Collection"
          ? "Customer"
          : selectedCategory === "Supplier_Payment"
            ? "Supplier"
            : null,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] rounded-2xl p-6 overflow-y-auto max-h-[90vh] min-h-[420px] bg-card border-border">
        <DialogHeader>
          <DialogTitle
            className={`text-lg font-bold ${isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}
          >
            {isIncome ? "টাকা পেলাম (Cash In)" : "টাকা দিলাম (Cash Out)"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            লেনদেনের বিবরণ নিচে লিখুন।
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-foreground mb-1 block">
                খাত (Category) *
              </label>
              <select
                {...register("category", { required: true })}
                className="w-full h-10 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-foreground mb-1 block">
                তারিখ *
              </label>
              <Input
                type="date"
                {...register("date", { required: true })}
                className="h-10 text-sm bg-background border-border"
              />
            </div>
          </div>

          {showPartyDropdown && (
            <div>
              <label className="text-xs text-foreground mb-1 block">
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
                    placeholder="নাম বা মোবাইল নম্বর..."
                    isClearable
                    noOptionsMessage={() =>
                      filteredParties.length === 0
                        ? "কোনো বকেয়া নেই"
                        : "পাওয়া যায়নি"
                    }
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: "40px",
                        borderRadius: "0.5rem",
                        backgroundColor: "var(--color-background)",
                        borderColor: errors.partyId
                          ? "var(--color-destructive)"
                          : "var(--color-border)",
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: "var(--color-card)",
                        zIndex: 50,
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused
                          ? "var(--color-muted)"
                          : "transparent",
                        color: "var(--color-foreground)",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: "var(--color-foreground)",
                      }),
                    }}
                  />
                )}
              />
              {errors.partyId && (
                <p className="text-[11px] text-destructive mt-1">
                  {errors.partyId.message}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="text-xs text-foreground mb-1 block">
              পরিমাণ (টাকা) *
            </label>
            <Input
              type="number"
              step="any"
              {...register("amount", { required: "পরিমাণ আবশ্যক" })}
              placeholder="0.00"
              className="h-10 text-sm font-semibold bg-background border-border"
            />
            {errors.amount && (
              <p className="text-[11px] text-destructive mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs text-foreground mb-1 block">
              নোট বা বিবরণ{" "}
              <span className="text-muted-foreground">(ঐচ্ছিক)</span>
            </label>
            <textarea
              {...register("note")}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-border"
              onClick={onClose}
            >
              বাতিল
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending || !isValid}
              className={`flex-[2] text-white ${isIncome ? "bg-emerald-600 hover:bg-emerald-700" : "bg-destructive hover:bg-destructive/90"}`}
            >
              {mutation.isPending ? "সেভ হচ্ছে..." : "সেভ করুন"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
