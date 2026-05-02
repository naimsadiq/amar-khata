import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";

const enToBn = (num) => num.toLocaleString("bn-BD");

export default function CartSidebar({
  billNo,
  cartItems,
  customers,
  updateQty,
  removeItem,
}) {
  // সাবটোটাল হিসাব
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );
  const discount = 0;
  const grandTotal = subtotal - discount;

  return (
    <div className="w-full lg:w-[340px] shrink-0 flex flex-col">
      <div className="bg-white rounded-[12px] border border-[#e8ecf0] flex flex-col flex-1 overflow-hidden h-[calc(100vh-140px)] lg:h-auto">
        {/* Cart Header */}
        <div className="p-[14px_16px] border-b border-[#e8ecf0] flex justify-between items-center bg-white shrink-0">
          <span className="text-[0.9rem] font-bold text-[#2c3e50]">
            🧾 বর্তমান বিল
          </span>
          <span className="text-[0.75rem] text-[#7f8c9a] font-medium">
            বিল #{billNo}
          </span>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto py-[8px]">
          {cartItems.length === 0 ? (
            <div className="text-center text-[#7f8c9a] text-sm mt-10">
              কোনো পণ্য যোগ করা হয়নি
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-[10px] p-[10px_16px] border-b border-[#e8ecf0] last:border-none"
              >
                <div className="flex-1">
                  <div className="text-[0.82rem] font-bold text-[#2c3e50]">
                    {item.name}
                  </div>
                  <div className="text-[0.78rem] text-[#7f8c9a]">
                    ৳{enToBn(item.price)}/{item.unit}
                  </div>
                </div>

                <div className="flex items-center gap-[6px]">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="w-[24px] h-[24px] border border-[#e8ecf0] rounded-[6px] bg-white flex items-center justify-center text-[#7f8c9a] font-bold hover:border-[#2ecc71] hover:text-[#2ecc71] transition-colors"
                  >
                    −
                  </button>
                  <span className="text-[0.85rem] font-bold text-[#2c3e50] min-w-[20px] text-center">
                    {enToBn(item.qty)}
                  </span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="w-[24px] h-[24px] border border-[#e8ecf0] rounded-[6px] bg-white flex items-center justify-center text-[#7f8c9a] font-bold hover:border-[#2ecc71] hover:text-[#2ecc71] transition-colors"
                  >
                    +
                  </button>
                </div>

                <div className="text-[0.85rem] font-bold text-[#2c3e50] min-w-[60px] text-right">
                  ৳{enToBn(item.price * item.qty)}
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="w-[22px] h-[22px] flex items-center justify-center text-[#e74c3c] hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer / Checkout */}
        <div className="p-[14px_16px] border-t border-[#e8ecf0] bg-white shrink-0">
          <div className="flex justify-between text-[0.82rem] mb-[6px] text-[#7f8c9a] font-medium">
            <span>সাবটোটাল</span>
            <span>৳{enToBn(subtotal)}</span>
          </div>
          <div className="flex justify-between text-[0.82rem] mb-[6px] text-[#e74c3c] font-medium">
            <span>ডিসকাউন্ট</span>
            <span>-৳{enToBn(discount)}</span>
          </div>
          <div className="flex justify-between text-[1.1rem] font-bold text-[#2c3e50] m-[10px_0] pt-[10px] border-t-2 border-[#e8ecf0]">
            <span>মোট</span>
            <span className="text-[#2ecc71]">৳{enToBn(grandTotal)}</span>
          </div>

          <Select>
            <SelectTrigger className="w-full mb-[10px] border-[#e8ecf0] bg-white text-[0.82rem] h-[38px]">
              <SelectValue placeholder="গ্রাহক নির্বাচন করুন (ঐচ্ছিক)" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((cus, idx) => (
                <SelectItem key={idx} value={cus}>
                  {cus}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="grid grid-cols-2 gap-[8px]">
            <button className="bg-[#2ecc71] hover:bg-[#27ae60] text-white p-[11px] rounded-[8px] font-bold text-[0.85rem] transition-colors flex items-center justify-center gap-2">
              💵 নগদ পেমেন্ট
            </button>
            <button className="bg-[#3498db] hover:bg-[#2980b9] text-white p-[11px] rounded-[8px] font-bold text-[0.85rem] transition-colors flex items-center justify-center gap-2">
              📋 বাকিতে দিন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
