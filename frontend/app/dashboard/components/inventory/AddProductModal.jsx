"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

export default function AddProductModal({ isOpen, onClose }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      category: "",
      buyPrice: "",
      sellPrice: "",
      openingStock: "",
      lowStockAlert: "5",
      unit: "পিস",
    },
  });

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const response = await api.post("/api/inventory", formData);
      return response.data;
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "সফল!",
        text: "নতুন পণ্য সফলভাবে যোগ করা হয়েছে!",
        confirmButtonText: "ঠিক আছে",
      });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      reset();
      onClose();
    },
    onError: (error) => {
      console.error(error);
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
      ...data,
      buyPrice: Number(data.buyPrice) || 0,
      sellPrice: Number(data.sellPrice) || 0,
      openingStock: Number(data.openingStock) || 0,
      lowStockAlert: Number(data.lowStockAlert) || 5,
    };
    mutation.mutate(formattedData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl p-6 bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground">
            নতুন পণ্য যোগ করুন
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            পণ্যের নাম, দাম এবং স্টকের বিবরণ নিচে পূরণ করুন।
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">
                পণ্যের নাম *
              </label>
              <Input
                {...register("name", { required: "পণ্যের নাম দেওয়া আবশ্যক!" })}
                placeholder="যেমন: বাসমতি চাল, সয়াবিন তেল..."
                className="h-10 rounded-lg text-sm bg-background border-border"
              />
              {errors.name && (
                <p className="text-xs text-destructive mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  ক্যাটাগরি *
                </label>
                <Input
                  {...register("category", { required: "ক্যাটাগরি আবশ্যক!" })}
                  placeholder="যেমন: চাল/ডাল"
                  className="h-10 rounded-lg text-sm bg-background border-border"
                />
                {errors.category && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  একক (Unit)
                </label>
                <select
                  {...register("unit")}
                  className="w-full h-10 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="পিস">পিস</option>
                  <option value="কেজি">কেজি</option>
                  <option value="লিটার">লিটার</option>
                  <option value="প্যাকেট">প্যাকেট</option>
                  <option value="বক্স">বক্স</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  ক্রয় মূল্য (টাকা) *
                </label>
                <Input
                  type="number"
                  step="any"
                  {...register("buyPrice", {
                    required: "ক্রয় মূল্য দিতে হবে!",
                  })}
                  placeholder="0.00"
                  className="h-10 rounded-lg text-sm bg-background border-border"
                />
                {errors.buyPrice && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.buyPrice.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  বিক্রয় মূল্য (টাকা) *
                </label>
                <Input
                  type="number"
                  step="any"
                  {...register("sellPrice", {
                    required: "বিক্রয় মূল্য দিতে হবে!",
                  })}
                  placeholder="0.00"
                  className="h-10 rounded-lg text-sm bg-background border-border"
                />
                {errors.sellPrice && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.sellPrice.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  বর্তমান স্টক (পরিমাণ)
                </label>
                <Input
                  type="number"
                  {...register("openingStock")}
                  placeholder="0"
                  className="h-10 rounded-lg text-sm bg-background border-border"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  লো-স্টক অ্যালার্ট (Low Stock)
                </label>
                <Input
                  type="number"
                  {...register("lowStockAlert")}
                  placeholder="5"
                  className="h-10 rounded-lg text-sm bg-background border-border"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-lg border-border"
              onClick={onClose}
            >
              বাতিল
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="flex-[2] rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {mutation.isPending ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
