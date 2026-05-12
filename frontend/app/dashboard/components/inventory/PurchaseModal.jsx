"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axiosInstance";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

export default function PurchaseModal({ isOpen, onClose }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: "",
      productId: "",
      supplierId: "",
      quantity: "",
      unit: "",
      buyPrice: "",
      sellPrice: "",
      discount: 0,
      paidAmount: 0, 
    },
  });

  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      const res = await api.get("/api/inventory");
      return res.data;
    },
    enabled: isOpen,
  });

  const { data: parties = [], isLoading: isLoadingParties } = useQuery({
    queryKey: ["parties"],
    queryFn: async () => {
      const res = await api.get("/api/parties");
      return res.data;
    },
    enabled: isOpen,
  });

  const categories = [...new Set(products.map((p) => p.category))];
  const suppliers = parties.filter((p) => p.type === "supplier");
  const selectedCategory = watch("category");
  const filteredProducts = products.filter(
    (p) => p.category === selectedCategory,
  );

  const handleProductChange = (e) => {
    const pId = e.target.value;
    setValue("productId", pId);

    const selectedProd = products.find((p) => p._id === pId);
    if (selectedProd) {
      setValue("buyPrice", selectedProd.currentBuyPrice || selectedProd.buyPrice || "");
      setValue("sellPrice", selectedProd.currentSellPrice || selectedProd.sellPrice || "");
      setValue("unit", selectedProd.unit || "কেজি");
    } else {
      setValue("buyPrice", "");
      setValue("sellPrice", "");
      setValue("unit", "");
    }
  };

  const qty = Number(watch("quantity")) || 0;
  const price = Number(watch("buyPrice")) || 0;
  const discount = Number(watch("discount")) || 0;
  const paidAmount = Number(watch("paidAmount")) || 0;

  const subTotal = qty * price;
  const grandTotal = subTotal > 0 ? subTotal - discount : 0;
  const dueAmount = grandTotal > 0 ? grandTotal - paidAmount : 0;

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const response = await api.post("/api/purchases", formData);
      return response.data;
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "সফল!",
        text: "মাল কেনা সফল হয়েছে এবং লেজার আপডেট হয়েছে!",
        confirmButtonText: "ঠিক আছে",
      });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["parties"] });
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      reset();
      onClose();
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "ভুল হয়েছে!",
        text: error.response?.data?.message || "কোথাও কোনো সমস্যা হয়েছে!",
        confirmButtonText: "আবার চেষ্টা করুন",
      });
    },
  });

  const onSubmit = (data) => {
    const formattedData = {
      supplierId: data.supplierId,
      purchaseDate: new Date().toISOString(),
      items: [
        {
          productId: data.productId,
          quantity: Number(data.quantity),
          buyPriceAtPurchase: Number(data.buyPrice),
          totalLineAmount: subTotal,
        },
      ],
      subTotal: subTotal,
      discount: discount,
      grandTotal: grandTotal,
      paidAmount: paidAmount,
      dueAmount: dueAmount,
      updateMasterData: {
        newSellPrice: Number(data.sellPrice),
        unit: data.unit,
      },
    };
    mutation.mutate(formattedData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto rounded-2xl p-6 bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            নতুন ক্রয় (Purchase Invoice)
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            পণ্য কিনুন এবং সাপ্লায়ারের বিল আপডেট করুন।
          </DialogDescription>
        </DialogHeader>

        {isLoadingProducts || isLoadingParties ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            ডাটা লোড হচ্ছে...
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-5">
            {/* সেকশন ১: বেসিক ইনফো */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl border border-border">
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-foreground block mb-1">
                  সাপ্লায়ার / মহাজন *
                </label>
                <select
                  {...register("supplierId", { required: "সাপ্লায়ার নির্বাচন করুন!" })}
                  className="w-full h-10 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary"
                >
                  <option value="">সাপ্লায়ার নির্বাচন করুন</option>
                  {suppliers.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} (বকেয়া: {s.currentDue || s.dueBalance || 0} ৳)
                    </option>
                  ))}
                </select>
                {errors.supplierId && (
                  <p className="text-xs text-destructive mt-1">{errors.supplierId.message}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  ক্যাটাগরি *
                </label>
                <select
                  {...register("category", { required: "ক্যাটাগরি আবশ্যক!" })}
                  className="w-full h-10 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary"
                  onChange={(e) => {
                    setValue("category", e.target.value);
                    setValue("productId", "");
                  }}
                >
                  <option value="">নির্বাচন করুন</option>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  পণ্যের নাম *
                </label>
                <select
                  {...register("productId", { required: "পণ্য নির্বাচন করুন!" })}
                  onChange={handleProductChange}
                  disabled={!selectedCategory}
                  className="w-full h-10 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary disabled:opacity-50"
                >
                  <option value="">পণ্য নির্বাচন করুন</option>
                  {filteredProducts.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} (স্টক: {p.stockQuantity})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* সেকশন ২: পরিমাণ ও মূল্য */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="text-xs font-semibold text-foreground block mb-1">পরিমাণ *</label>
                <Input
                  type="number" step="any"
                  {...register("quantity", { required: "পরিমাণ দিন" })}
                  placeholder="0"
                  className="h-10 text-sm bg-background border-border"
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="text-xs font-semibold text-foreground block mb-1">একক *</label>
                <select
                  {...register("unit", { required: true })}
                  className="w-full h-10 px-3 py-2 rounded-lg border border-border bg-background text-sm"
                >
                  <option value="কেজি">কেজি</option>
                  <option value="পিস">পিস</option>
                  <option value="লিটার">লিটার</option>
                  <option value="প্যাকেট">প্যাকেট</option>
                  <option value="বস্তা">বস্তা</option>
                </select>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="text-xs font-semibold text-foreground block mb-1">ক্রয় মূল্য *</label>
                <Input
                  type="number" step="any"
                  {...register("buyPrice", { required: "দাম দিন" })}
                  placeholder="0"
                  className="h-10 text-sm bg-background border-border"
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="text-xs font-semibold text-foreground block mb-1">বিক্রয় মূল্য</label>
                <Input
                  type="number" step="any"
                  {...register("sellPrice")}
                  placeholder="0"
                  className="h-10 text-sm text-primary font-bold bg-background border-border"
                />
              </div>
            </div>

            {/* সেকশন ৩: বিলিং ও পেমেন্ট */}
            <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 mt-6">
              <h3 className="text-sm font-bold text-primary mb-4 border-b border-primary/20 pb-2">
                বিলের হিসাব (Billing Details)
              </h3>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">মোট বিল (Subtotal):</span>
                  <span className="text-sm font-bold text-foreground">{subTotal.toFixed(2)} ৳</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">ডিসকাউন্ট (ছাড়):</span>
                  <Input
                    type="number"
                    {...register("discount")}
                    className="h-8 w-32 text-right text-sm bg-background border-border"
                    placeholder="0"
                  />
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-primary/20">
                  <span className="text-base font-bold text-foreground">সর্বমোট (Grand Total):</span>
                  <span className="text-base font-bold text-primary">{grandTotal.toFixed(2)} ৳</span>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">নগদ পরিশোধ (Paid):</span>
                  <Input
                    type="number"
                    {...register("paidAmount")}
                    className="h-9 w-32 text-right text-sm border-emerald-500/50 focus:ring-emerald-500 bg-background"
                    placeholder="0"
                  />
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-primary/20 bg-destructive/10 p-2 rounded-lg">
                  <span className="text-sm font-bold text-destructive">বকেয়া থাকবে (Due):</span>
                  <span className="text-lg font-black text-destructive">{dueAmount.toFixed(2)} ৳</span>
                </div>
              </div>
            </div>

            {/* বাটন গ্রুপ */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1 border-border" onClick={onClose}>
                বাতিল
              </Button>
              <Button type="submit" disabled={mutation.isPending} className="flex-[2] bg-primary hover:bg-primary/90 text-primary-foreground">
                {mutation.isPending ? "সেভ হচ্ছে..." : "ইনভয়েস সেভ করুন"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}