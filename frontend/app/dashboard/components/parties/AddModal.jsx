"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axiosInstance";
import {
  Dialog,
  DialogContent,
  DialogDescription, // ১. এটি ইমপোর্ট করুন
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
      dueBalance: "",
    },
  });

  const selectedType = watch("type");

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const response = await api.post("/api/parties", formData);
      return response.data;
    },

    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "সফল!",
        text: "সফলভাবে যোগ করা হয়েছে!",
        confirmButtonText: "ঠিক আছে",
      });

      queryClient.invalidateQueries({ queryKey: ["parties"] });
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
    // console.log("Form Data Before Formatting:", data);
    const formattedData = {
      ...data,
      dueBalance: Number(data.dueBalance) || 0,
    };
    mutation.mutate(formattedData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            নতুন যোগ করুন
          </DialogTitle>
          {/* ২. বর্ণনা যোগ করুন (এটি স্ক্রিন রিডারের জন্য প্রয়োজন) */}
          <DialogDescription>
            নতুন গ্রাহক বা সাপ্লায়ারের তথ্য এখানে লিখুন। প্রয়োজনীয় ঘরগুলো পূরণ
            করুন।
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-2 mb-2 mt-2">
            <Button
              type="button"
              variant={selectedType === "customer" ? "default" : "outline"}
              onClick={() => setValue("type", "customer")}
              className={`rounded-full h-8 px-4 text-xs ${
                selectedType === "customer"
                  ? "bg-[#e8f5ee] text-[#0f5234] border-[#1a7a4a] hover:bg-[#c3e6d0]"
                  : "text-gray-500"
              }`}
            >
              গ্রাহক
            </Button>
            <Button
              type="button"
              variant={selectedType === "supplier" ? "default" : "outline"}
              onClick={() => setValue("type", "supplier")}
              className={`rounded-full h-8 px-4 text-xs ${
                selectedType === "supplier"
                  ? "bg-[#e8f5ee] text-[#0f5234] border-[#1a7a4a] hover:bg-[#c3e6d0]"
                  : "text-gray-500"
              }`}
            >
              সাপ্লায়ার
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">
                নাম *
              </label>
              <Input
                {...register("name", { required: "নাম দেওয়া আবশ্যক!" })}
                placeholder="ব্যক্তি বা প্রতিষ্ঠানের নাম"
                className="h-10 rounded-lg text-sm"
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">
                মোবাইল নম্বর
              </label>

              <Input
                {...register("phone", {
                  required: "মোবাইল নম্বর দিতে হবে",
                  pattern: {
                    value: /^(?:\+8801|01)[3-9]\d{8}$/,
                    message: "সঠিক বাংলাদেশি মোবাইল নম্বর দিন",
                  },
                })}
                placeholder="+8801XXXXXXXXX"
                className="h-10 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">
                ঠিকানা
              </label>
              <Input
                {...register("address")}
                placeholder="এলাকা বা বাজারের নাম"
                className="h-10 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">
                প্রারম্ভিক বকেয়া (টাকা)
              </label>
              <Input
                type="number"
                {...register("dueBalance")}
                placeholder="0.00"
                className="h-10 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-lg"
              onClick={onClose}
            >
              বাতিল
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="flex-[2] rounded-lg bg-[#1a7a4a] hover:bg-[#0f5234] text-white"
            >
              {mutation.isPending ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
