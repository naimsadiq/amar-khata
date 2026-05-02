"use client";

import { useEffect, useState } from "react";
import PosHeader from "../components/pos/PosHeader";
import ProductList from "../components/pos/ProductList";
import CartSidebar from "../components/pos/CartSidebar";


export default function PosPage() {
  const [data, setData] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Public ফোল্ডার থেকে JSON ডাটা ফেচ করা
    const fetchPosData = async () => {
      try {
        const res = await fetch("/data/pos.json");
        const jsonData = await res.json();
        setData(jsonData);
        setCart(jsonData.initialCart); // Initial cart data set করা
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch POS data:", error);
        setLoading(false);
      }
    };
    fetchPosData();
  }, []);

  // Cart Functions
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item.id === product.id);
      if (exists) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : item;
        }
        return item;
      }),
    );
  };

  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  if (loading || !data) {
    return (
      <div className="p-6 text-center text-slate-500 flex-1">লোড হচ্ছে...</div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#f5f7fa] overflow-hidden w-full">
      {/* Top Header */}
      <PosHeader billNo={data.billNo} />

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-[20px] p-[16px] lg:p-[20px_24px] overflow-y-auto lg:overflow-hidden h-full">
        {/* Left Side: Product Search & Grid */}
        <ProductList products={data.products} onAddToCart={handleAddToCart} />

        {/* Right Side: Cart / Bill Section */}
        <CartSidebar
          billNo={data.billNo}
          cartItems={cart}
          customers={data.customers}
          updateQty={updateQty}
          removeItem={removeItem}
        />
      </div>
    </div>
  );
}
