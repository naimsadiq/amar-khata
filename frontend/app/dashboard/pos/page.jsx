"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axiosInstance";
import Swal from "sweetalert2";
import PosHeader from "../components/pos/PosHeader";
import ProductList from "../components/pos/ProductList";
import CartSidebar from "../components/pos/CartSidebar";
import { Loader2 } from "lucide-react";

export default function PosPage() {
  const queryClient = useQueryClient();
  const [cart, setCart] = useState([]);

  // ডাইনামিক বিল নাম্বার (Timestamp ভিত্তিক)
  const [billNo, setBillNo] = useState(
    `INV-${Date.now().toString().slice(-6)}`,
  );

  // ১. ইনভেন্টরি থেকে প্রোডাক্ট ফেচ করা
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      const res = await api.get("/api/inventory");
      return res.data;
    },
  });

  // ২. পার্টি থেকে শুধু গ্রাহকদের (Customer) ফেচ করা
  const { data: customers = [], isLoading: loadingCustomers } = useQuery({
    queryKey: ["parties"],
    queryFn: async () => {
      const res = await api.get("/api/parties");
      return res.data.filter((p) => p.type === "customer"); // শুধু কাস্টমার
    },
  });

  // Cart Functions
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item._id === product._id);
      if (exists) {
        // স্টকের চেয়ে বেশি অ্যাড করা যাবে না
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
          // স্টক লিমিট চেক
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

  // ৩. ইনভয়েস সাবমিট করার Mutation
  const mutation = useMutation({
    mutationFn: async (invoiceData) => {
      const res = await api.post("/api/invoices", invoiceData);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "সফল!",
        text: "বিল সফলভাবে তৈরি হয়েছে।",
      });
      setCart([]); // কার্ট ক্লিয়ার
      setBillNo(`INV-${Date.now().toString().slice(-6)}`); // নতুন বিল নাম্বার
      queryClient.invalidateQueries({ queryKey: ["inventory"] }); // স্টক আপডেট দেখার জন্য
      queryClient.invalidateQueries({ queryKey: ["parties"] }); // বকেয়া আপডেট দেখার জন্য
      queryClient.invalidateQueries({ queryKey: ["cashbook"] }); // ক্যাশবুক আপডেট
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "ভুল হয়েছে!",
        text: error.response?.data?.message || "সার্ভারে সমস্যা হয়েছে।",
      });
    },
  });

  // চেকআউট হ্যান্ডলার (প্যারেন্ট থেকে কল হবে)
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
        total: c.sellPrice * c.qty,
      })),
      ...checkoutData, // subTotal, discount, totalAmount, paidAmount, dueAmount, partyId
    };

    mutation.mutate(payload);
  };

  if (loadingProducts || loadingCustomers) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#2ecc71] h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#f5f7fa] overflow-hidden w-full font-['Hind_Siliguri']">
      <PosHeader billNo={billNo} />
      <div className="flex flex-col lg:flex-row gap-[20px] p-[16px] lg:p-[20px_24px] overflow-y-auto lg:overflow-hidden h-full">
        <ProductList products={products} onAddToCart={handleAddToCart} />
        <CartSidebar
          billNo={billNo}
          cartItems={cart}
          customers={customers}
          updateQty={updateQty}
          removeItem={removeItem}
          onCheckout={handleCheckout}
          isSubmitting={mutation.isPending}
        />
      </div>
    </div>
  );
}
