"use client";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axiosInstance";
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

  // Parties/Customers ফেচ করা (ড্রপডাউনের জন্য)
  const { data: parties = [] } = useQuery({
    queryKey: ["parties"],
    queryFn: async () => {
      const res = await api.get("/api/parties");
      return res.data;
    },
    enabled: isOpen, // মডাল ওপেন থাকলেই শুধু কল হবে
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      category: "General",
    },
  });

  const selectedCategory = watch("category");

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const res = await api.post("/api/cashbook", formData);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({ icon: "success", title: "সফল!", text: "লেনদেন সেভ হয়েছে।" });
      queryClient.invalidateQueries({ queryKey: ["cashbook"] });
      queryClient.invalidateQueries({ queryKey: ["parties"] }); // বকেয়া আপডেট হবে তাই
      reset();
      onClose();
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "ভুল হয়েছে!",
        text: "কিছু একটা সমস্যা হয়েছে।",
      });
    },
  });

  const onSubmit = (data) => {
    mutation.mutate({
      ...data,
      type: type,
      amount: Number(data.amount),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle
            className={`text-lg font-bold ${isIncome ? "text-[#2ecc71]" : "text-[#e74c3c]"}`}
          >
            {isIncome ? "টাকা পেলাম (Cash In)" : "টাকা দিলাম (Cash Out)"}
          </DialogTitle>
          <DialogDescription>লেনদেনের বিবরণ নিচে লিখুন।</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
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
            <div>
              <label className="text-xs text-gray-600 mb-1 block">
                পরিমাণ (টাকা) *
              </label>
              <Input
                type="number"
                step="any"
                {...register("amount", { required: true })}
                placeholder="0.00"
                className="h-10 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">
              খাত (Category)
            </label>
            <select
              {...register("category")}
              className="w-full h-10 px-3 py-2 rounded-lg border border-slate-200 text-sm"
            >
              <option value="General">সাধারণ আয়/ব্যয়</option>
              <option value="Party Payment">
                পার্টি লেনদেন (বকেয়া আদায়/পরিশোধ)
              </option>
              <option value="Salary">বেতন</option>
              <option value="Bills">ইউটিলিটি বিল</option>
            </select>
          </div>

          {selectedCategory === "Party Payment" && (
            <div>
              <label className="text-xs text-gray-600 mb-1 block">
                পার্টি সিলেক্ট করুন
              </label>
              <select
                {...register("partyId")}
                className="w-full h-10 px-3 py-2 rounded-lg border border-slate-200 text-sm"
              >
                <option value="">-- কাস্টমার/সাপ্লায়ার সিলেক্ট করুন --</option>
                {parties.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.phone})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-xs text-gray-600 mb-1 block">বিবরণ *</label>
            <Input
              {...register("description", { required: true })}
              placeholder="যেমন: চা নাস্তা খরচ / রফিকের বকেয়া"
              className="h-10 text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">
              নোট (ঐচ্ছিক)
            </label>
            <Input
              {...register("note")}
              placeholder="অতিরিক্ত কোনো নোট..."
              className="h-10 text-sm"
            />
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
              className={`flex-[2] text-white ${isIncome ? "bg-[#2ecc71] hover:bg-[#27ae60]" : "bg-[#e74c3c] hover:bg-[#c0392b]"}`}
            >
              {mutation.isPending ? "সেভ হচ্ছে..." : "সেভ করুন"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
