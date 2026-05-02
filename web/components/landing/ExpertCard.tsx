type Expert = {
  initial: string; name: string; role: string; firm: string;
  career: string; quote: string; badge: string;
};

const EXPERTS: Expert[] = [
  { initial: "김", name: "김OO 변호사", role: "영업양수도·임대차 전문", firm: "법무법인 OOO", career: "경력 7년 · 서울대 법학", quote: "필라테스 양수도 분쟁의 95%는 사전 계약 단계에서 막을 수 있습니다.", badge: "변호사" },
  { initial: "박", name: "박OO 세무사", role: "포괄양수도·양도세 전문", firm: "OOO세무회계", career: "경력 12년 · 한양대 회계학", quote: "포괄양수도 신고만 잘 해도 부가세 10% 추징은 100% 막힙니다.", badge: "세무사" },
];

export function ExpertSection() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {EXPERTS.map((e, i) => <Card key={i} e={e} />)}
      <PendingCard />
    </div>
  );
}

function Card({ e }: { e: Expert }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white overflow-hidden">
      {/* 사진 박스 영역 */}
      <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-blue-100/50 flex items-center justify-center relative">
        {/* 큰 이니셜 */}
        <div className="text-[72px] font-black text-blue-600/30 leading-none">{e.initial}</div>
        <div className="absolute top-3 right-3 rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold text-white">{e.badge}</div>
        <div className="absolute bottom-3 left-3 rounded-md bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-black/65">사진 준비 중</div>
      </div>
      {/* 정보 */}
      <div className="p-5">
        <div className="text-[15px] font-extrabold text-black">{e.name}</div>
        <div className="mt-0.5 text-[12px] text-black/65">{e.role}</div>
        <div className="text-[11px] text-black/45 mt-0.5">{e.firm} · {e.career}</div>
        <blockquote className="mt-3 text-[13px] text-black/80 leading-relaxed">"{e.quote}"</blockquote>
      </div>
    </div>
  );
}

function PendingCard() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-black/15 bg-black/[.02] flex flex-col items-center justify-center text-center min-h-[280px] p-5">
      <div className="text-[36px] mb-3 text-black/25">+</div>
      <div className="text-[12px] font-bold text-black/40 uppercase tracking-widest">제휴 모집 중</div>
      <div className="mt-2 text-[14px] font-extrabold text-black/65">필라테스 양수도 전문</div>
      <div className="text-[14px] font-extrabold text-black/65">변호사·세무사 모집</div>
      <div className="mt-3 text-[11px] text-black/45">관심 있으신 분은 운영팀에 문의</div>
    </div>
  );
}
