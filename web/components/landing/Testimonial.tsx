const TESTIMONIALS = [
  { quote: "권리금 7천 협상 성공. POS 검증 자료가 결정적이었어요.", who: "강남구 김OO 원장" },
  { quote: "강사 단체 이탈 위험을 사전에 막아주셨습니다.", who: "송파구 박OO 강사" },
  { quote: "임대인 동의서를 잔금 전에 받게 해줘서 진짜 안심됐어요.", who: "성남시 이OO 원장" },
];

export function TestimonialSection() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {TESTIMONIALS.map((t, i) => (
        <div key={i} className="rounded-2xl border border-black/10 bg-white p-5">
          <div className="text-blue-600 text-[20px] font-extrabold leading-none">"</div>
          <blockquote className="mt-2 text-[13px] text-black/80 leading-relaxed">{t.quote}</blockquote>
          <div className="mt-3 text-[11px] font-bold text-black/55">— {t.who}</div>
        </div>
      ))}
    </div>
  );
}
