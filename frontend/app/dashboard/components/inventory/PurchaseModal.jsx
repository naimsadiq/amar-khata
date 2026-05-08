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
      discount: 0, // নতুন: ডিসকাউন্ট
      paidAmount: 0, // নতুন: নগদ পরিশোধ
    },
  });

  // ডাটা ফেচিং (আগের মতোই)
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

  // ফিল্টারিং
  const categories = [...new Set(products.map((p) => p.category))];
  const suppliers = parties.filter((p) => p.type === "supplier");
  const selectedCategory = watch("category");
  const filteredProducts = products.filter(
    (p) => p.category === selectedCategory,
  );

  // অটো-ফিল লজিক
  const handleProductChange = (e) => {
    const pId = e.target.value;
    setValue("productId", pId);

    const selectedProd = products.find((p) => p._id === pId);
    if (selectedProd) {
      setValue(
        "buyPrice",
        selectedProd.currentBuyPrice || selectedProd.buyPrice || "",
      );
      setValue(
        "sellPrice",
        selectedProd.currentSellPrice || selectedProd.sellPrice || "",
      );
      setValue("unit", selectedProd.unit || "কেজি");
    } else {
      setValue("buyPrice", "");
      setValue("sellPrice", "");
      setValue("unit", "");
    }
  };

  // --- রিয়েল টাইম বিল ক্যালকুলেশন লজিক ---
  const qty = Number(watch("quantity")) || 0;
  const price = Number(watch("buyPrice")) || 0;
  const discount = Number(watch("discount")) || 0;
  const paidAmount = Number(watch("paidAmount")) || 0;

  const subTotal = qty * price;
  const grandTotal = subTotal > 0 ? subTotal - discount : 0;
  const dueAmount = grandTotal > 0 ? grandTotal - paidAmount : 0;
  // ---------------------------------------

  // সাবমিট মিউটেশন
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
    // ডাটাবেজ স্কিমা অনুযায়ী ডাটা ফরম্যাট করা
    const formattedData = {
      supplierId: data.supplierId,
      purchaseDate: new Date().toISOString(),

      // Items array (ভবিষ্যতে একাধিক প্রোডাক্ট এক বিলে নিতে পারবেন)
      items: [
        {
          productId: data.productId,
          quantity: Number(data.quantity),
          buyPriceAtPurchase: Number(data.buyPrice),
          totalLineAmount: subTotal,
        },
      ],

      // বিলের হিসাব (এই ডাটাগুলো দিয়ে ব্যাকএন্ডে সাপ্লায়ারের ডিউ আপডেট করবেন)
      subTotal: subTotal,
      discount: discount,
      grandTotal: grandTotal,
      paidAmount: paidAmount,
      dueAmount: dueAmount,

      // প্রোডাক্ট মাস্টার টেবিল আপডেট করার জন্য এক্সট্রা ডাটা
      updateMasterData: {
        newSellPrice: Number(data.sellPrice),
        unit: data.unit,
      },
    };

    console.log(formattedData);

    mutation.mutate(formattedData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">
            নতুন ক্রয় (Purchase Invoice)
          </DialogTitle>
          <DialogDescription>
            পণ্য কিনুন এবং সাপ্লায়ারের বিল আপডেট করুন।
          </DialogDescription>
        </DialogHeader>

        {isLoadingProducts || isLoadingParties ? (
          <div className="py-10 text-center text-sm text-gray-500">
            ডাটা লোড হচ্ছে...
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-5">
            {/* সেকশন ১: বেসিক ইনফো */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  সাপ্লায়ার / মহাজন *
                </label>
                <select
                  {...register("supplierId", {
                    required: "সাপ্লায়ার নির্বাচন করুন!",
                  })}
                  className="w-full h-10 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">সাপ্লায়ার নির্বাচন করুন</option>
                  {suppliers.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} (বকেয়া: {s.currentDue || s.dueBalance || 0} ৳)
                    </option>
                  ))}
                </select>
                {errors.supplierId && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.supplierId.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  ক্যাটাগরি *
                </label>
                <select
                  {...register("category", { required: "ক্যাটাগরি আবশ্যক!" })}
                  className="w-full h-10 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => {
                    setValue("category", e.target.value);
                    setValue("productId", "");
                  }}
                >
                  <option value="">নির্বাচন করুন</option>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  পণ্যের নাম *
                </label>
                <select
                  {...register("productId", {
                    required: "পণ্য নির্বাচন করুন!",
                  })}
                  onChange={handleProductChange}
                  disabled={!selectedCategory}
                  className="w-full h-10 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
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
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  পরিমাণ *
                </label>
                <Input
                  type="number"
                  step="any"
                  {...register("quantity", { required: "পরিমাণ দিন" })}
                  placeholder="0"
                  className="h-10 text-sm"
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  একক *
                </label>
                <select
                  {...register("unit", { required: true })}
                  className="w-full h-10 px-3 py-2 rounded-lg border border-slate-300 text-sm"
                >
                  <option value="কেজি">কেজি</option>
                  <option value="পিস">পিস</option>
                  <option value="লিটার">লিটার</option>
                  <option value="প্যাকেট">প্যাকেট</option>
                  <option value="বস্তা">বস্তা</option>
                </select>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  ক্রয় মূল্য *
                </label>
                <Input
                  type="number"
                  step="any"
                  {...register("buyPrice", { required: "দাম দিন" })}
                  placeholder="0"
                  className="h-10 text-sm"
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  বিক্রয় মূল্য
                </label>
                <Input
                  type="number"
                  step="any"
                  {...register("sellPrice")}
                  placeholder="0"
                  className="h-10 text-sm text-blue-600 font-bold"
                />
              </div>
            </div>

            {/* সেকশন ৩: বিলিং ও পেমেন্ট (সবচেয়ে গুরুত্বপূর্ণ অংশ) */}
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mt-6">
              <h3 className="text-sm font-bold text-blue-800 mb-4 border-b border-blue-200 pb-2">
                বিলের হিসাব (Billing Details)
              </h3>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">
                    মোট বিল (Subtotal):
                  </span>
                  <span className="text-sm font-bold text-gray-800">
                    {subTotal.toFixed(2)} ৳
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">
                    ডিসকাউন্ট (ছাড়):
                  </span>
                  <Input
                    type="number"
                    {...register("discount")}
                    className="h-8 w-32 text-right text-sm"
                    placeholder="0"
                  />
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-blue-100">
                  <span className="text-base font-bold text-gray-800">
                    সর্বমোট (Grand Total):
                  </span>
                  <span className="text-base font-bold text-blue-700">
                    {grandTotal.toFixed(2)} ৳
                  </span>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-bold text-green-700">
                    নগদ পরিশোধ (Paid):
                  </span>
                  <Input
                    type="number"
                    {...register("paidAmount")}
                    className="h-9 w-32 text-right text-sm border-green-300 focus:ring-green-500"
                    placeholder="0"
                  />
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-blue-100 bg-red-50 p-2 rounded-lg">
                  <span className="text-sm font-bold text-red-600">
                    বকেয়া থাকবে (Due):
                  </span>
                  <span className="text-lg font-black text-red-600">
                    {dueAmount.toFixed(2)} ৳
                  </span>
                </div>
              </div>
            </div>

            {/* বাটন গ্রুপ */}
            <div className="flex gap-3 pt-4">
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
                disabled={mutation.isPending}
                className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white"
              >
                {mutation.isPending ? "সেভ হচ্ছে..." : "ইনভয়েস সেভ করুন"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
