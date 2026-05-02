export default function PosHeader({ billNo }) {
  return (
    <div className="bg-white border-b border-[#e8ecf0] px-[24px] h-[56px] flex items-center justify-between shrink-0">
      <span className="text-[1.1rem] font-bold text-[#2c3e50]">
        POS / বিলিং
      </span>
      <div className="flex gap-[10px] items-center">
        <span className="text-[0.8rem] text-[#7f8c9a]">বিল #{billNo}</span>
        <button className="px-[14px] py-[6px] bg-white border border-[#e8ecf0] rounded-[6px] text-[0.78rem] font-semibold text-[#2c3e50] cursor-pointer hover:border-[#2ecc71] hover:text-[#2ecc71] transition-colors">
          পুরনো বিল
        </button>
      </div>
    </div>
  );
}
