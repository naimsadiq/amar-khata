// components/pos/CartSidebar.jsx

import { useState } from "react";
import { CustomerCombobox } from "./CustomerCombobox"; // নতুন কম্পোনেন্ট ইম্পোর্ট
import { Trash2, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

export default function CartSidebar({
  billNo,
  cartItems,
  customers,
  updateQty,
  removeItem,
  onCheckout,
  isSubmitting,
}) {
  const [discount, setDiscount] = useState(""); // খালি স্ট্রিং রাখা ভালো
  const [selectedCustomer, setSelectedCustomer] = useState(null); // null রাখা ভালো

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.sellPrice * item.qty,
    0,
  );
  const grandTotal = subtotal - (Number(discount) || 0);

  const processPayment = (type) => {
    if (cartItems.length === 0)
      return Swal.fire("খালি কার্ট!", "পণ্য যোগ করুন", "warning");
    if (grandTotal < 0)
      return Swal.fire(
        "ভুল অংক!",
        "ডিসকাউন্ট বিলের চেয়ে বেশি হতে পারে না",
        "error",
      );

    if (type === "due" && !selectedCustomer) {
      return Swal.fire(
        "সতর্কতা!",
        "বাকি দিতে চাইলে অবশ্যই গ্রাহক নির্বাচন করতে হবে।",
        "warning",
      );
    }

    const payload = {
      subTotal: subtotal,
      discount: Number(discount) || 0,
      totalAmount: grandTotal,
      paidAmount: type === "cash" ? grandTotal : 0, // নগদে পুরো টাকা, বাকিতে ০
      dueAmount: type === "cash" ? 0 : grandTotal,
      partyId: selectedCustomer || null,
    };
    onCheckout(payload);
  };

  return (
    // মূল কন্টেইনার
    <div className="w-full lg:w-[360px] shrink-0 flex flex-col">
      <div className="bg-white rounded-[12px] border border-[#e8ecf0] flex flex-col flex-1 h-full">
        {/* কার্ট হেডার (Fixed) */}
        <div className="p-[14px_16px] border-b border-[#e8ecf0] flex justify-between items-center bg-white shrink-0">
          <span className="text-[0.9rem] font-bold text-[#2c3e50]">
            🧾 বর্তমান বিল
          </span>
          <span className="text-[0.75rem] text-[#7f8c9a] font-medium">
            {billNo}
          </span>
        </div>

        {/* কার্ট আইটেম লিস্ট (Scrollable) */}
        <div className="flex-1 overflow-y-auto py-[8px]">
          {cartItems.length === 0 ? (
            <div className="text-center text-[#7f8c9a] text-sm mt-10">
              কোনো পণ্য যোগ করা হয়নি
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-[10px] p-[10px_16px] border-b border-[#e8ecf0] last:border-none"
              >
                <div className="flex-1">
                  <div className="text-[0.82rem] font-bold text-[#2c3e50]">
                    {item.name}
                  </div>
                  <div className="text-[0.78rem] text-[#7f8c9a]">
                    ৳{item.sellPrice.toLocaleString("en-IN")}/{item.unit}
                  </div>
                </div>
                <div className="flex items-center gap-[6px]">
                  <button
                    onClick={() => updateQty(item._id, -1)}
                    className="w-[24px] h-[24px] border border-[#e8ecf0] rounded bg-white font-bold hover:text-[#2ecc71]"
                  >
                    -
                  </button>
                  <span className="text-[0.85rem] font-bold text-[#2c3e50] min-w-[20px] text-center">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateQty(item._id, 1)}
                    className="w-[24px] h-[24px] border border-[#e8ecf0] rounded bg-white font-bold hover:text-[#2ecc71]"
                  >
                    +
                  </button>
                </div>
                <div className="text-[0.85rem] font-bold text-[#2c3e50] min-w-[60px] text-right">
                  ৳{(item.sellPrice * item.qty).toLocaleString("en-IN")}
                </div>
                <button
                  onClick={() => removeItem(item._id)}
                  className="text-[#e74c3c] hover:bg-red-50 p-1 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* পেমেন্ট সেকশন (Fixed) */}
        <div className="p-[14px_16px] border-t border-[#e8ecf0] bg-white shrink-0">
          <div className="flex justify-between text-[0.82rem] mb-[6px] text-[#7f8c9a] font-medium">
            <span>সাবটোটাল</span>
            <span>৳{subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between items-center text-[0.82rem] mb-[6px] text-[#e74c3c] font-medium">
            <span>ডিসকাউন্ট (৳)</span>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-[80px] h-[24px] border border-gray-200 rounded px-2 text-right outline-none focus:border-[#e74c3c]"
              placeholder="0"
            />
          </div>
          <div className="flex justify-between text-[1.1rem] font-bold text-[#2c3e50] m-[10px_0] pt-[10px] border-t-2 border-[#e8ecf0]">
            <span>মোট</span>
            <span className="text-[#2ecc71]">
              ৳{grandTotal.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="mb-[10px]">
            <CustomerCombobox
              customers={customers}
              selectedCustomer={selectedCustomer}
              onSelectCustomer={setSelectedCustomer}
            />
          </div>

          <div className="grid grid-cols-2 gap-[8px]">
            <button
              onClick={() => processPayment("cash")}
              disabled={isSubmitting}
              className="bg-[#2ecc71] hover:bg-[#27ae60] text-white p-[11px] rounded-[8px] font-bold text-[0.85rem] transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "💵 নগদ পেমেন্ট"
              )}
            </button>
            <button
              onClick={() => processPayment("due")}
              disabled={isSubmitting}
              className="bg-[#3498db] hover:bg-[#2980b9] text-white p-[11px] rounded-[8px] font-bold text-[0.85rem] transition-colors flex items-center justify-center gap-2"
            >
              📋 বাকিতে দিন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
