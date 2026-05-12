import { useState } from "react";
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
  const [paidAmount, setPaidAmount] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // হিসাব-নিকাশ
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.sellPrice * item.qty,
    0,
  );
  const grandTotal = subtotal - (Number(discount) || 0);
  const dueAmount = grandTotal - (Number(paidAmount) || 0);

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

  const handleFullPayment = () => {
    setPaidAmount(grandTotal.toString());
  };

  return (
    // ফিক্স: মোবাইলের জন্য h-[500px] সরিয়ে h-auto দেওয়া হয়েছে
    <div className="w-full lg:w-[360px] xl:w-[400px] shrink-0 flex flex-col h-auto lg:h-full">
      {/* ফিক্স: overflow-hidden দেওয়া হয়েছে যেন ভেতরের কন্টেন্ট বাইরে না যায় */}
      <div className="bg-card rounded-xl border border-border flex flex-col flex-1 shadow-sm overflow-hidden">
        
        {/* কার্ট হেডার */}
        <div className="p-4 border-b border-border flex justify-between items-center bg-card shrink-0">
          <span className="text-sm font-bold text-foreground">
            🧾 বর্তমান বিল
          </span>
          <span className="text-xs text-muted-foreground font-medium">
            {billNo}
          </span>
        </div>

        {/* কার্ট আইটেম লিস্ট */}
        {/* ফিক্স: মোবাইলে স্ক্রল হওয়ার জন্য max-h-[40vh] এবং ডেস্কটপের জন্য lg:max-h-none দেওয়া হয়েছে */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 min-h-[150px] max-h-[40vh] lg:max-h-none">
          {cartItems.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm mt-10">
              কোনো পণ্য যোগ করা হয়নি
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-3 p-2 border-b border-border/50 last:border-none bg-background rounded-lg"
              >
                <div className="flex-1">
                  <div className="text-sm font-bold text-foreground">
                    {item.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ৳{item.sellPrice.toLocaleString("en-IN")}/{item.unit}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateQty(item._id, -1)}
                    className="w-7 h-7 border border-border rounded-md bg-card hover:bg-muted flex items-center justify-center text-foreground transition"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold min-w-[24px] text-center text-foreground">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateQty(item._id, 1)}
                    className="w-7 h-7 border border-border rounded-md bg-card hover:bg-muted flex items-center justify-center text-foreground transition"
                  >
                    +
                  </button>
                </div>
                <div className="text-sm font-bold text-foreground min-w-[65px] text-right">
                  ৳{(item.sellPrice * item.qty).toLocaleString("en-IN")}
                </div>
                <button
                  onClick={() => removeItem(item._id)}
                  className="text-destructive hover:bg-destructive/10 p-1.5 rounded-md transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* পেমেন্ট সেকশন */}
        {/* ফিক্স: z-10 এবং relative দেওয়া হয়েছে যেন কোনোভাবেই আইটেমের নিচে না যায় */}
        <div className="p-4 border-t border-border bg-card shrink-0 relative z-10">
          {/* হিসাব নিকাশ */}
          <div className="space-y-2.5 mb-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>সাবটোটাল</span>
              <span>৳{subtotal.toLocaleString("en-IN")}</span>
            </div>

            <div className="flex justify-between items-center text-sm text-destructive font-medium">
              <span>ডিসকাউন্ট (৳)</span>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-24 h-8 border border-border rounded-md px-2 text-right bg-background text-foreground outline-none focus:border-destructive focus:ring-1 focus:ring-destructive"
                placeholder="0"
              />
            </div>

            <div className="flex justify-between text-base font-bold text-foreground pt-3 border-t border-dashed border-border">
              <span>মোট বিল</span>
              <span className="text-primary">
                ৳{grandTotal.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* নগদ গ্রহণ ইনপুট */}
          <div className="bg-background p-3.5 rounded-lg border border-border shadow-sm mb-4">
            <div className="flex justify-between items-center mb-2.5">
              <label className="text-sm font-bold text-foreground">
                নগদ গ্রহণ (৳)
              </label>
              <button
                onClick={handleFullPayment}
                className="text-[11px] font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-md hover:bg-primary hover:text-primary-foreground transition-all"
              >
                পুরো নগদ
              </button>
            </div>
            <input
              type="number"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              className="w-full h-10 border border-border bg-background rounded-md px-3 text-base font-bold text-primary outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              placeholder="0.00"
            />

            {/* বকেয়া স্ট্যাটাস */}
            <div className="flex justify-between items-center mt-3 text-xs">
              <span className="text-muted-foreground">বকেয়া থাকবে:</span>
              <span
                className={`font-bold ${dueAmount > 0 ? "text-amber-500" : "text-muted-foreground"}`}
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
            className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg font-bold text-[15px] transition-all shadow-sm hover:shadow-md ${
              dueAmount > 0
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
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