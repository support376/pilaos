type Expert = {
  initial: string;
  name: string;
  role: string;
  firm: string;
  career: string;
  quote: string;
  badge: string;
};

const EXPERTS: Expert[] = [
  {
    initial: "김",
    name: "김OO 변호사",
    role: "영업양수도·임대차 전문",
    firm: "법무법인 OOO",
    career: "경력 7년 · 서울대 법학",
    quote: "필라테스 양수도 분쟁의 95%는 사전 계약 단계에서 막을 수 있습니다.",
    badge: "변호사 (P)",
  },
  {
    initial: "박",
    name: "박OO 세무사",
    role: "포괄양수도·양도세 전문",
    firm: "OOO세무회계",
    career: "경력 12년 · 한양대 회계학",
    quote: "포괄양수도 신고만 잘 해도 부가세 10% 추징은 100% 막힙니다.",
    badge: "세무사 (P)",
  },
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
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 border border-blue-200 text-[16px] font-extrabold text-blue-700">{e.initial}</div>
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-extrabold text-black">{e.name}</div>
          <div className="text-[12px] text-black/65">{e.role}</div>
          <div className="text-[11px] text-black/45 mt-0.5">{e.firm} · {e.career}</div>
        </div>
        <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">{e.badge}</span>
      </div>
      <blockquote className="mt-4 text-[13px] text-black/80 leading-relaxed">"{e.quote}"</blockquote>
    </div>
  );
}

function PendingCard() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-black/15 bg-black/[.02] p-5 flex flex-col items-center justify-center text-center">
      <div className="text-[12px] font-bold text-black/40 uppercase tracking-widest">제휴 모집 중</div>
      <div className="mt-2 text-[14px] font-extrabold text-black/70">필라테스 양수도 전문</div>
      <div className="text-[14px] font-extrabold text-black/70">변호사·세무사 모집</div>
      <div className="mt-3 text-[11px] text-black/45">관심 있으신 분은 운영팀에 문의</div>
    </div>
  );
}
