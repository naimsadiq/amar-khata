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

export default function AddModal({ isOpen, onClose }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "customer",
      name: "",
      phone: "",
      address: "",
      openingBalance: "",
    },
  });

  const selectedType = watch("type");

  const mutation = useMutation({
    mutationFn: async (formData) =>
      (await api.post("/api/parties", formData)).data,
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "সফল!",
        text: "সফলভাবে যোগ করা হয়েছে!",
      });
      queryClient.invalidateQueries({ queryKey: ["parties"] });
      reset();
      onClose();
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "ভুল হয়েছে!",
        text: error.response?.data?.message || "সমস্যা হয়েছে!",
      });
    },
  });

  const onSubmit = (data) =>
    mutation.mutate({
      ...data,
      openingBalance: Number(data.openingBalance) || 0,
    });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] rounded-2xl p-6 bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground">
            নতুন যোগ করুন
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            নতুন গ্রাহক বা সাপ্লায়ারের তথ্য এখানে লিখুন।
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Toggle Type */}
          <div className="flex bg-muted p-1 rounded-lg mb-4">
            <button
              type="button"
              onClick={() => setValue("type", "customer")}
              className={`flex-1 py-1.5 text-sm rounded-md transition-all font-medium ${selectedType === "customer" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              গ্রাহক
            </button>
            <button
              type="button"
              onClick={() => setValue("type", "supplier")}
              className={`flex-1 py-1.5 text-sm rounded-md transition-all font-medium ${selectedType === "supplier" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              সাপ্লায়ার
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">
                নাম *
              </label>
              <Input
                {...register("name", { required: "নাম দেওয়া আবশ্যক!" })}
                placeholder="ব্যক্তি বা প্রতিষ্ঠানের নাম"
                className="bg-background border-border"
              />
              {errors.name && (
                <p className="text-xs text-destructive mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">
                মোবাইল নম্বর
              </label>
              <Input
                {...register("phone")}
                placeholder="+8801XXXXXXXXX"
                className="bg-background border-border"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">
                ঠিকানা
              </label>
              <Input
                {...register("address")}
                placeholder="এলাকা বা বাজারের নাম"
                className="bg-background border-border"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">
                প্রারম্ভিক বকেয়া (টাকা)
              </label>
              <Input
                type="number"
                {...register("openingBalance")}
                placeholder="0.00"
                className="bg-background border-border"
              />
            </div>
          </div>

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
              disabled={mutation.isPending}
              className="flex-[2]"
            >
              {mutation.isPending ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
