export default function ReportHeader({ date, onToast }) {
  return (
    <div className="bg-white border-b border-[#e4e8f0] px-[20px] md:px-[28px] py-[12px] md:h-[56px] flex flex-col md:flex-row items-start md:items-center justify-between sticky top-0 z-50 gap-3 md:gap-0">
      <div>
        <h1 className="text-[17px] font-bold text-[#1a2236]">রিপোর্ট ও বিশ্লেষণ</h1>
        <div className="text-[12px] text-[#7a8aaa] mt-[2px]">{date}</div>
      </div>
      <div className="flex gap-[10px] w-full md:w-auto">
        <button 
          onClick={() => onToast('🖨️ প্রিন্ট প্রিভিউ খুলছে...')}
          className="flex-1 md:flex-none px-[16px] py-[7px] rounded-[8px] bg-white border border-[#e4e8f0] text-[#1a2236] text-[12px] font-semibold hover:bg-[#e8f5ee] hover:border-[#2ea86b] hover:text-[#2ea86b] transition-all"
        >
          🖨️ প্রিন্ট
        </button>
        <button 
          onClick={() => onToast('⬇️ রিপোর্ট ডাউনলোড হচ্ছে...')}
          className="flex-1 md:flex-none px-[16px] py-[7px] rounded-[8px] bg-[#1a7f4b] text-white text-[12px] font-semibold hover:bg-[#146038] transition-all"
        >
          ⬇ ডাউনলোড PDF
        </button>
      </div>
    </div>
  );
}