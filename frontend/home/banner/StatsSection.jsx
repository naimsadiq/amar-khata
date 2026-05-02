export default function Stats() {
  const stats = [
    { n: "৫০", s: "হাজার+", d: "সক্রিয় ব্যবসায়ী" },
    { n: "১.২", s: "কোটি+", d: "মাসিক লেনদেন" },
    { n: "৬৪", s: "জেলায়", d: "সারাদেশে ব্যবহার" },
    { n: "৪.৮", s: "/৫", d: "ব্যবহারকারী রেটিং" },
  ];

  return (
    <div className="border-y border-paper-3 bg-paper-2 py-7 px-5 md:px-[5vw]">
      <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-6 md:gap-y-0">
        {stats.map((st, i) => (
          <div
            key={i}
            className={`text-center px-5 ${i !== stats.length - 1 ? "md:border-r border-paper-3" : ""}`}
          >
            <div className="font-serif text-3xl md:text-4xl text-ink mb-1.5 leading-none">
              {st.n}
              <span className="text-brand">{st.s}</span>
            </div>
            <div className="text-[13px] text-ink-3">{st.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
