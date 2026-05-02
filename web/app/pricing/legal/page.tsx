import Link from "next/link";

export const metadata = {
  title: "법률·세무 비용 (외부) — pilaos",
  description: "변호사·세무사·공증사무소·법무법인에 의뢰인이 직접 결제. pilaos는 자문료 미관여 (변호사법 §109 준수).",
};

const ITEMS = [
  { title: "변호사 1차 컨설팅 (30분)", price: "15만원", desc: "매물·계약·임대·세무 1차 평가. 매수자/매도자 모두 가능. 결제 후에도 변호사 본 위임 별도 결정." },
  { title: "표준 양수도계약 + 임대인 동의서 + 클로징", price: "120만원", desc: "매수자가 변호사에 직접 위임. 임대인 동의서 동시 체결 + 회원 동의 통지 양식 포함." },
  { title: "위약금 공증", price: "5~20만원", desc: "공증사무소 직접. 경업금지·매출 거짓 시 권리금 200% 반환 약정 → 강제집행 가능." },
  { title: "포괄양수도 신고 + 양도세", price: "35만원", desc: "제휴 세무사. 부가세 10% 추징 차단 + 양도소득세 정확히 처리. 매도자 부담 일반적." },
  { title: "권리금 에스크로 (선택)", price: "매매가 0.3~0.5%", desc: "제휴 법무법인 예치계좌 + 3자 약정. 인수인계 6개월 후 잔금 출금. pilaos는 자금 미보관." },
  { title: "분쟁 시 1차 자문 (12개월 내)", price: "15만원/회", desc: "회원·임대·강사·세무 분쟁 1차 평가. 본격 소송 수임은 별도 계약." },
];

export default function LegalPricing() {
  return (
    <div className="bg-stone-50">
      <section className="mx-auto max-w-3xl px-5 pt-14 pb-6">
        <Link href="/pricing" className="text-xs text-stone-500 hover:text-stone-900">← 가격 정책으로</Link>
        <div className="mt-2 text-xs font-bold uppercase tracking-wider text-rose-700">법률·세무 비용 (외부)</div>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          이 비용은 <span className="text-rose-700">의뢰인이 직접</span> 결제합니다.
        </h1>
        <p className="mt-4 text-base text-stone-600 leading-relaxed">
          pilaos는 매칭과 일정 조율만 무료로 합니다. 변호사·세무사·공증사무소·법무법인의 자문료에는 <strong className="text-stone-900">일절 관여하지 않습니다</strong>. 이는 <strong>변호사법 §109</strong>를 준수하기 위한 합법 구조입니다.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-10">
        <div className="space-y-3">
          {ITEMS.map((it) => (
            <div key={it.title} className="rounded-2xl border border-stone-200 bg-white p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-base font-bold sm:text-lg">{it.title}</h2>
                <span className="text-xl font-extrabold text-amber-700 whitespace-nowrap">{it.price}</span>
              </div>
              <p className="mt-2 text-sm text-stone-600 leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-amber-50 border border-amber-200 p-6">
          <h3 className="text-base font-bold text-amber-900">왜 분리해서 받나요?</h3>
          <p className="mt-2 text-sm text-stone-700 leading-relaxed">
            변호사법 §109는 변호사 아닌 자가 변호사를 알선하고 수임료의 일부를 받는 행위를 형사처벌합니다 (7년 이하 징역 또는 5천만원 이하 벌금).
            pilaos가 "법률 패키지"라며 변호사 비용까지 묶어 받으면 위반 위험이 있습니다.
          </p>
          <p className="mt-3 text-sm text-stone-700 leading-relaxed">
            그래서 <strong>거래 자문(M&amp;A advisory)</strong>에 대한 비용만 우리가 받고, 법률 자문료는 변호사가 의뢰인에게 직접 청구하도록 분리합니다. 이게 합법 구조이며, 동시에 매수자분께도 가장 투명한 비용 구조입니다.
          </p>
        </div>

        <div className="mt-8 rounded-2xl bg-stone-100 p-6">
          <h3 className="text-base font-bold">제휴 변호사·세무사 어떻게 정하나요?</h3>
          <ul className="mt-2 space-y-1.5 text-sm text-stone-700 leading-relaxed">
            <li>• 영업양수도·임대차·세무 전문 경력 5년+ 검증 후 디렉토리 등재</li>
            <li>• 매수자분이 디렉토리에서 <strong>본인이 선택</strong>. 우리가 강제 매칭하지 않습니다.</li>
            <li>• 자문료는 변호사·세무사가 정찰가로 게시. 우리가 가격에 관여 X.</li>
            <li>• 변호사·세무사는 정액 월 광고비를 pilaos에 지급 (로톡 모델)</li>
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-12">
        <div className="rounded-2xl bg-stone-900 p-7 text-white text-center">
          <h3 className="text-xl font-bold">먼저 무료 상담부터.</h3>
          <p className="mt-2 text-sm text-stone-300">선생님 상황 듣고 어느 단계에서 어떤 변호사·세무사가 필요한지 같이 정리해요.</p>
          <Link href="/inquire?kind=acquire" className="mt-5 inline-block rounded-lg bg-amber-400 px-6 py-3 text-sm font-bold text-stone-900 hover:bg-amber-300">무료 상담 신청 →</Link>
        </div>
      </section>
    </div>
  );
}
