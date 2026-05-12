"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axiosInstance";
import Swal from "sweetalert2";
import PosHeader from "../components/pos/PosHeader";
import ProductList from "../components/pos/ProductList";
import CartSidebar from "../components/pos/CartSidebar";
import AddModal from "../components/parties/AddModal";
import { AlertTriangle } from "lucide-react";

export default function PosPage() {
  const queryClient = useQueryClient();
  const [cart, setCart] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ডাইনামিক বিল নাম্বার
  const [billNo, setBillNo] = useState(
    `INV-${Date.now().toString().slice(-6)}`,
  );

  // ১. ইনভেন্টরি ফেচ করা
  const {
    data: products = [],
    isLoading: loadingProducts,
    isError: errorProducts,
  } = useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      const res = await api.get("/api/inventory");
      return res.data;
    },
  });

  // ২. কাস্টমার ফেচ করা
  const {
    data: customers = [],
    isLoading: loadingCustomers,
    isError: errorCustomers,
  } = useQuery({
    queryKey: ["parties"],
    queryFn: async () => {
      const res = await api.get("/api/parties");
      return res.data.filter((p) => p.type === "customer");
    },
  });

  // Cart Functions (অপরিবর্তিত)
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item._id === product._id);
      if (exists) {
        if (exists.qty >= product.stockQuantity) {
          Swal.fire({
            icon: "warning",
            title: "স্টক শেষ",
            text: "স্টকে এর চেয়ে বেশি পণ্য নেই!",
          });
          return prevCart;
        }
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item._id === id) {
          const newQty = item.qty + delta;
          if (delta > 0 && newQty > item.stockQuantity) {
            Swal.fire({
              icon: "warning",
              title: "স্টক শেষ!",
              text: "স্টকে পর্যাপ্ত পণ্য নেই!",
              timer: 1500,
              showConfirmButton: false,
            });
            return item;
          }
          return newQty > 0 ? { ...item, qty: newQty } : item;
        }
        return item;
      }),
    );
  };

  const removeItem = (id) =>
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));

  // ৩. ইনভয়েস সাবমিট করার Mutation (অপরিবর্তিত)
  const mutation = useMutation({
    mutationFn: async (invoiceData) => {
      const res = await api.post("/api/sales", invoiceData);
      console.log(invoiceData);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "সফল!",
        text: "বিল সফলভাবে তৈরি হয়েছে।",
      });
      setCart([]);
      setBillNo(`INV-${Date.now().toString().slice(-6)}`);

      // ডাটা রিফ্রেশ
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["parties"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "ভুল হয়েছে!",
        text: error.response?.data?.message || "সার্ভারে সমস্যা হয়েছে।",
      });
    },
  });

  const handleCheckout = (checkoutData) => {
    if (cart.length === 0) {
      return Swal.fire({
        icon: "error",
        title: "কার্ট খালি",
        text: "দয়া করে পণ্য যোগ করুন।",
      });
    }

    const payload = {
      invoiceNo: billNo,
      items: cart.map((c) => ({
        productId: c._id,
        name: c.name,
        price: c.sellPrice,
        quantity: c.qty,
        totalLineAmount: c.sellPrice * c.qty,
      })),
      ...checkoutData,
    };

    mutation.mutate(payload);
  };

  // Error State Handling
  if (errorProducts || errorCustomers) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground space-y-4 px-4 text-center">
        <div className="text-destructive w-16 h-16 bg-destructive/10 p-4 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-full h-full" />
        </div>
        <h2 className="text-2xl font-bold">
          দুঃখিত, ডেটা লোড করতে সমস্যা হয়েছে!
        </h2>
        <p className="text-muted-foreground">
          আপনার ইন্টারনেট কানেকশন চেক করুন অথবা কিছুক্ষণ পর আবার চেষ্টা করুন।
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md shadow-md hover:opacity-90 transition"
        >
          রিলোড করুন
        </button>
      </div>
    );
  }

  // Skeleton Loading Animation
  if (loadingProducts || loadingCustomers) {
    return (
      <div className="flex flex-col h-screen bg-background w-full">
        {/* Header Skeleton */}
        <div className="h-[56px] border-b border-border bg-card flex justify-between items-center px-6 shrink-0">
          <div className="w-32 h-6 bg-muted animate-pulse rounded"></div>
          <div className="w-24 h-8 bg-muted animate-pulse rounded"></div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex flex-col lg:flex-row gap-[20px] p-[16px] lg:p-[20px_24px] h-full overflow-hidden">
          {/* Product Skeleton */}
          <div className="flex-1 bg-card rounded-[12px] border border-border p-4 flex flex-col gap-4">
            <div className="w-full h-10 bg-muted animate-pulse rounded-lg"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-[10px]">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-muted/60 animate-pulse rounded-[10px]"
                ></div>
              ))}
            </div>
          </div>

          {/* Cart Sidebar Skeleton */}
          <div className="w-full lg:w-[360px] xl:w-[400px] bg-card rounded-[12px] border border-border flex flex-col h-[500px] lg:h-full shrink-0">
            <div className="h-14 border-b border-border bg-muted/30 animate-pulse rounded-t-[12px]"></div>
            <div className="flex-1 p-4 flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-muted/40 animate-pulse rounded-lg"
                ></div>
              ))}
            </div>
            <div className="h-[280px] bg-muted/20 animate-pulse rounded-b-[12px] border-t border-border"></div>
          </div>
        </div>
      </div>
    );
  }

  // Main UI
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden w-full font-sans">
      <PosHeader billNo={billNo} />
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-[20px] p-4 lg:p-[20px_24px] overflow-y-auto lg:overflow-hidden h-full">
        <ProductList products={products} onAddToCart={handleAddToCart} />
        <CartSidebar
          billNo={billNo}
          cartItems={cart}
          customers={customers}
          updateQty={updateQty}
          removeItem={removeItem}
          onCheckout={handleCheckout}
          isSubmitting={mutation.isPending}
          setIsModalOpen={setIsModalOpen}
        />
      </div>
      <AddModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
