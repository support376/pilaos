import Link from "next/link";

export const metadata = {
  title: "변호사·세무사 비용 — pilaos",
  description: "변호사·세무사·공증·법무법인 비용. 의뢰인이 직접 결제. pilaos는 자문료 미관여 (변호사법 제109조 준수).",
};

const ITEMS = [
  { title: "변호사 1차 상담 (30분)", price: "15만원", desc: "매물·계약·임대·세무 1차 평가. 매수자/매도자 모두 가능. 결제 후에도 본 위임은 별도 결정." },
  { title: "표준 양수도계약 + 임대인 동의서 + 마무리", price: "120만원", desc: "매수자가 변호사에게 직접 위임. 임대인 동의서 동시 체결 + 회원 동의 통지 양식 포함." },
  { title: "위약금 공증", price: "5~20만원", desc: "공증사무소에 직접. 경업금지·매출 거짓 시 권리금 200% 반환 약정 → 강제집행 가능." },
  { title: "포괄양수도 신고 + 양도세", price: "35만원", desc: "제휴 세무사. 부가세 10% 추징 차단 + 양도소득세 정확히 처리. 매도자 부담이 일반적." },
  { title: "권리금 예치 (선택)", price: "매매가의 0.3~0.5%", desc: "제휴 법무법인 예치 계좌 + 3자 약정. 인수인계 6개월 후 잔금 출금. pilaos는 자금을 보관하지 않습니다." },
  { title: "분쟁 시 1차 상담 (12개월 안)", price: "15만원/회", desc: "회원·임대·강사·세무 분쟁 1차 평가. 본격 소송 수임은 별도 계약." },
];

export default function LegalPricing() {
  return (
    <div className="bg-white">
      <section className="mx-auto max-w-3xl px-5 pt-14 pb-6">
        <Link href="/pricing" className="text-xs text-black/55 hover:text-black">← 비용 정책으로</Link>
        <div className="mt-3 text-[11px] font-bold uppercase tracking-widest text-red-600">변호사·세무사 비용 (외부)</div>
        <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight">
          이 비용은 <span className="text-red-600">의뢰인이 직접</span> 결제합니다.
        </h1>
        <p className="mt-5 text-base text-black/65 leading-relaxed">
          pilaos는 매칭과 일정 조율만 무료로 합니다. 변호사·세무사·공증사무소·법무법인의 자문료에는 <strong className="text-black">일절 관여하지 않습니다</strong>. 이는 <strong>변호사법 제109조</strong>를 준수하기 위한 합법 구조입니다.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-10">
        <div className="space-y-3">
          {ITEMS.map((it) => (
            <div key={it.title} className="rounded-2xl border border-black/10 bg-white p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-base sm:text-lg font-extrabold">{it.title}</h2>
                <span className="text-xl font-extrabold text-blue-600 whitespace-nowrap">{it.price}</span>
              </div>
              <p className="mt-2 text-sm text-black/70 leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-blue-50 border border-blue-200 p-6">
          <h3 className="text-base font-extrabold text-blue-900">왜 분리해서 받나요?</h3>
          <p className="mt-2 text-sm text-black/80 leading-relaxed">
            변호사법 제109조는 변호사가 아닌 자가 변호사를 알선하고 수임료의 일부를 받는 행위를 형사처벌합니다 (7년 이하 징역 또는 5천만원 이하 벌금).
            pilaos가 "법률 묶음"을 만들어 변호사 비용까지 받으면 위반 위험이 있습니다.
          </p>
          <p className="mt-3 text-sm text-black/80 leading-relaxed">
            그래서 <strong>거래 자문</strong>에 대한 비용만 우리가 받고, 법률 자문료는 변호사가 의뢰인에게 직접 청구하도록 분리합니다. 이게 합법 구조이며 매수자에게도 가장 투명합니다.
          </p>
        </div>

        <div className="mt-6 rounded-2xl bg-black/5 p-6">
          <h3 className="text-base font-extrabold">제휴 변호사·세무사는 어떻게 정하나요?</h3>
          <ul className="mt-3 space-y-2 text-sm text-black/80 leading-relaxed">
            <li>• 영업양수도·임대차·세무 전문 경력 5년 이상 검증 후 디렉토리에 등재</li>
            <li>• 매수자분이 디렉토리에서 <strong>본인이 선택</strong>합니다. 우리가 강제로 매칭하지 않습니다.</li>
            <li>• 자문료는 변호사·세무사가 정찰가로 게시. 우리는 가격에 관여하지 않습니다.</li>
            <li>• 변호사·세무사는 정액 월 광고비를 pilaos에 지급합니다 (광고 모델).</li>
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-12">
        <div className="rounded-2xl bg-black p-7 text-white text-center">
          <h3 className="text-xl font-extrabold">먼저 무료 상담부터.</h3>
          <p className="mt-2 text-sm text-white/75">상황을 듣고 어느 단계에서 어떤 변호사·세무사가 필요한지 함께 정리해요.</p>
          <Link href="/inquire?kind=acquire" className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700">상담 신청 →</Link>
        </div>
      </section>
    </div>
  );
}
