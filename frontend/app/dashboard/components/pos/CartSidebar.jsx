import { useState, useEffect } from "react";
import { CustomerCombobox } from "./CustomerCombobox";
import { Trash2, Loader2, Banknote, CreditCard } from "lucide-react";
import Swal from "sweetalert2";

export default function CartSidebar({
  billNo,
  cartItems,
  customers,
  updateQty,
  removeItem,
  onCheckout,
  isSubmitting,
  setIsModalOpen,
}) {
  const [discount, setDiscount] = useState("");
  const [paidAmount, setPaidAmount] = useState(""); // নগদ কত টাকা দিচ্ছে
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // হিসাব-নিকাশ
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.sellPrice * item.qty,
    0,
  );
  const grandTotal = subtotal - (Number(discount) || 0);
  const dueAmount = grandTotal - (Number(paidAmount) || 0);

  // যখনই ডিসকাউন্ট পরিবর্তন হবে বা কার্ট আইটেম কমবে-বাড়বে,
  // তখন পেইড অ্যামাউন্ট অটোমেটিক গ্র্যান্ড টোটালের সমান করে দেওয়ার জন্য (অপশনাল)
  // যদি আপনি চান কাস্টমার ডিফল্টভাবে ফুল পেমেন্ট করবে:
  /*
  useEffect(() => {
    setPaidAmount(grandTotal > 0 ? grandTotal.toString() : "");
  }, [grandTotal]);
  */

  const handleSubmit = () => {
    if (cartItems.length === 0) {
      return Swal.fire("খালি কার্ট!", "দয়া করে পণ্য যোগ করুন", "warning");
    }
    if (grandTotal < 0) {
      return Swal.fire(
        "ভুল অংক!",
        "ডিসকাউন্ট বিলের চেয়ে বেশি হতে পারে না",
        "error",
      );
    }
    if (Number(paidAmount) > grandTotal) {
      return Swal.fire(
        "সতর্কতা!",
        "পেইড অ্যামাউন্ট মোট বিলের চেয়ে বেশি হতে পারে না",
        "warning",
      );
    }

    // যদি ১ টাকাও বকেয়া থাকে, তবে কাস্টমার সিলেক্ট করা বাধ্যতামূলক
    if (dueAmount > 0 && !selectedCustomer) {
      return Swal.fire(
        "গ্রাহক নির্বাচন করুন!",
        "যেহেতু বকেয়া আছে (৳" +
          dueAmount.toLocaleString() +
          "), তাই গ্রাহকের নাম প্রয়োজন।",
        "warning",
      );
    }

    const payload = {
      subTotal: subtotal,
      discount: Number(discount) || 0,
      grandTotal: grandTotal,
      paidAmount: Number(paidAmount) || 0,
      dueAmount: dueAmount > 0 ? dueAmount : 0,
      partyId: selectedCustomer || null,
    };

    onCheckout(payload);
  };

  // কুইক বাটন: ফুল ক্যাশ পেমেন্ট করার জন্য
  const handleFullPayment = () => {
    setPaidAmount(grandTotal.toString());
  };

  return (
    <div className="w-full lg:w-[360px] shrink-0 flex flex-col">
      <div className="bg-white rounded-[12px] border border-[#e8ecf0] flex flex-col flex-1 h-full shadow-sm">
        {/* কার্ট হেডার */}
        <div className="p-[14px_16px] border-b border-[#e8ecf0] flex justify-between items-center bg-white shrink-0">
          <span className="text-[0.9rem] font-bold text-[#2c3e50]">
            🧾 বর্তমান বিল
          </span>
          <span className="text-[0.75rem] text-[#7f8c9a] font-medium">
            {billNo}
          </span>
        </div>

        {/* কার্ট আইটেম লিস্ট */}
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
                    className="w-[24px] h-[24px] border border-[#e8ecf0] rounded bg-white hover:bg-gray-50 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="text-[0.85rem] font-bold min-w-[20px] text-center">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateQty(item._id, 1)}
                    className="w-[24px] h-[24px] border border-[#e8ecf0] rounded bg-white hover:bg-gray-50 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
                <div className="text-[0.85rem] font-bold text-[#2c3e50] min-w-[60px] text-right">
                  ৳{(item.sellPrice * item.qty).toLocaleString("en-IN")}
                </div>
                <button
                  onClick={() => removeItem(item._id)}
                  className="text-[#e74c3c] hover:bg-red-50 p-1 rounded transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* পেমেন্ট সেকশন */}
        <div className="p-[16px] border-t border-[#e8ecf0] bg-[#fcfdfe] shrink-0">
          {/* হিসাব নিকাশ */}
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-[0.82rem] text-[#7f8c9a]">
              <span>সাবটোটাল</span>
              <span>৳{subtotal.toLocaleString("en-IN")}</span>
            </div>

            <div className="flex justify-between items-center text-[0.82rem] text-[#e74c3c]">
              <span>ডিসকাউন্ট (৳)</span>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-[90px] h-[28px] border border-gray-200 rounded px-2 text-right outline-none focus:border-[#e74c3c]"
                placeholder="0"
              />
            </div>

            <div className="flex justify-between text-[1rem] font-bold text-[#2c3e50] pt-2 border-t border-dashed border-[#d1d8df]">
              <span>মোট বিল</span>
              <span className="text-[#2ecc71]">
                ৳{grandTotal.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* নগদ গ্রহণ ইনপুট */}
          <div className="bg-white p-3 rounded-lg border border-[#e8ecf0] shadow-sm mb-3">
            <div className="flex justify-between items-center mb-2">
              <label className="text-[0.85rem] font-bold text-[#2c3e50]">
                নগদ গ্রহণ (৳)
              </label>
              <button
                onClick={handleFullPayment}
                className="text-[0.7rem] bg-[#2ecc71]/10 text-[#2ecc71] px-2 py-1 rounded hover:bg-[#2ecc71] hover:text-white transition-all"
              >
                পুরো নগদ
              </button>
            </div>
            <input
              type="number"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              className="w-full h-[36px] border border-[#cbd5e0] rounded-md px-3 text-[1rem] font-bold text-[#2ecc71] outline-none focus:ring-2 focus:ring-[#2ecc71]/20 focus:border-[#2ecc71]"
              placeholder="0.00"
            />

            {/* বকেয়া স্ট্যাটাস */}
            <div className="flex justify-between items-center mt-2 text-[0.8rem]">
              <span className="text-[#7f8c9a]">বকেয়া থাকবে:</span>
              <span
                className={`font-bold ${dueAmount > 0 ? "text-[#e67e22]" : "text-gray-400"}`}
              >
                ৳{dueAmount > 0 ? dueAmount.toLocaleString("en-IN") : "0"}
              </span>
            </div>
          </div>

          {/* কাস্টমার সিলেকশন */}
          <div className="mb-4">
            <CustomerCombobox
              customers={customers}
              selectedCustomer={selectedCustomer}
              onSelectCustomer={setSelectedCustomer}
              setIsModalOpen={setIsModalOpen}
            />
          </div>

          {/* ফাইনাল সাবমিট বাটন */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center gap-2 p-[12px] rounded-[10px] font-bold text-[0.95rem] transition-all shadow-md ${
              dueAmount > 0
                ? "bg-[#3498db] hover:bg-[#2980b9] text-white"
                : "bg-[#2ecc71] hover:bg-[#27ae60] text-white"
            }`}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <>
                {dueAmount > 0 ? (
                  <CreditCard size={18} />
                ) : (
                  <Banknote size={18} />
                )}
                {dueAmount > 0 ? "বাকি ও নগদ বিক্রি" : "নগদ বিক্রি কনফার্ম"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
