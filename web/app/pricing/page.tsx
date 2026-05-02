import Link from "next/link";
import { SuccessFeeSimulator } from "./SuccessFeeSimulator";

export const metadata = {
  title: "가격 정책 — pilaos",
  description: "M&A advisory 모델. Retainer + Success Fee. 매수자 디파짓 50만. 법률·세무 비용은 별도.",
};

type Props = { searchParams: Promise<{ tab?: string }> };

export default async function PricingPage({ searchParams }: Props) {
  const sp = await searchParams;
  const tab = sp.tab === "seller" ? "seller" : sp.tab === "legal" ? "legal" : "buyer";

  return (
    <div className="bg-stone-50">
      <section className="mx-auto max-w-3xl px-5 pt-14 pb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-700">가격 정책</div>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          단계마다 <span className="text-amber-700">결제 시점이 명확</span>합니다.
        </h1>
        <p className="mt-4 text-base text-stone-600 leading-relaxed">
          IB식 M&amp;A advisory 모델. <strong>매수자가 우리에게 내는 비용은 디파짓 50만원뿐</strong>이고, 매도자는 거래 성사 시 권리금의 일정 % (success fee)를 부담합니다. 법률·세무 비용은 별도 페이지에서 분리해 명시합니다.
        </p>
      </section>

      {/* 탭 */}
      <section className="mx-auto max-w-3xl px-5">
        <div className="flex gap-1 rounded-xl bg-stone-200 p-1">
          <Tab href="/pricing?tab=buyer" active={tab === "buyer"}>매수자</Tab>
          <Tab href="/pricing?tab=seller" active={tab === "seller"}>매도자</Tab>
          <Tab href="/pricing?tab=legal" active={tab === "legal"}>법률·세무 (외부)</Tab>
        </div>
      </section>

      {/* 매수자 탭 */}
      {tab === "buyer" ? (
        <section className="mx-auto max-w-3xl px-5 py-10">
          <h2 className="text-xl font-bold">매수자 비용</h2>
          <p className="mt-1 text-sm text-stone-600">우리에게 내시는 돈은 <strong>디파짓 50만원</strong>이 전부입니다.</p>

          <div className="mt-6 rounded-2xl border-2 border-stone-900 bg-white p-7">
            <div className="text-5xl font-black text-amber-700">50<span className="text-2xl text-stone-500">만원</span></div>
            <div className="mt-2 text-sm text-stone-600">매수자 디파짓 (Stage 2 진입 시)</div>
            <ul className="mt-5 space-y-2 text-sm text-stone-700">
              <li className="flex gap-2"><Check />운영팀 1명 전담 배정</li>
              <li className="flex gap-2"><Check />매도자 진성정보 NDA 후 수령</li>
              <li className="flex gap-2"><Check />변호사·세무사·금융사 매칭 무료</li>
              <li className="flex gap-2"><Check />임대인·강사 컨택 대행</li>
              <li className="flex gap-2"><Check />1년 사후 운영 점검 무료</li>
            </ul>
            <p className="mt-5 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
              <strong>환불 정책:</strong> 매수자 단순 변심 시 환불 X (NDA·자료 수령 후). 매도자 잠적·자료 거짓 입증 시 디파짓 다음 매물 매칭에 활용 또는 환불.
            </p>
          </div>

          <div className="mt-6 rounded-xl bg-stone-100 p-5">
            <div className="text-xs font-bold text-stone-500 mb-2">매수자 단계별 결제 흐름</div>
            <table className="w-full text-sm">
              <thead className="text-xs text-stone-500">
                <tr><th className="text-left py-1">단계</th><th className="text-right py-1">결제처</th><th className="text-right py-1">금액</th></tr>
              </thead>
              <tbody>
                <tr className="border-t border-stone-200"><td>0 발견</td><td className="text-right">—</td><td className="text-right">0</td></tr>
                <tr className="border-t border-stone-200"><td>1 권리금 산정</td><td className="text-right">—</td><td className="text-right">0</td></tr>
                <tr className="border-t border-stone-200 bg-amber-50"><td className="py-2">2 실사 진입</td><td className="text-right">pilaos</td><td className="text-right font-bold text-amber-700">50만</td></tr>
                <tr className="border-t border-stone-200"><td>3 클로징</td><td className="text-right">변호사·세무사 직접</td><td className="text-right">~165만</td></tr>
                <tr className="border-t border-stone-200"><td>4 1년 점검</td><td className="text-right">—</td><td className="text-right">0</td></tr>
              </tbody>
            </table>
            <p className="mt-3 text-xs text-stone-500">
              ※ 매수자가 우리에게 내는 비용은 50만원. 변호사·세무사·공증 비용은 <Link href="/pricing?tab=legal" className="text-amber-700 underline">별도 페이지</Link>에서 명시.
            </p>
          </div>
        </section>
      ) : null}

      {/* 매도자 탭 */}
      {tab === "seller" ? (
        <section className="mx-auto max-w-3xl px-5 py-10">
          <h2 className="text-xl font-bold">매도자 비용</h2>
          <p className="mt-1 text-sm text-stone-600">M&amp;A advisory 표준: <strong>Engagement Retainer + Success Fee</strong>. 거래 성사 시만 success fee 부담.</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border-2 border-stone-200 bg-white p-6">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-500">Engagement Retainer</div>
              <div className="mt-2 text-3xl font-black text-amber-700">150<span className="text-base text-stone-500">만원</span></div>
              <p className="mt-1 text-xs text-stone-500">권리금 산정 PDF 제작 시점에 1회 결제</p>
              <ul className="mt-4 space-y-1.5 text-xs text-stone-700">
                <li>• POS·카드·세금 통합 매출 검증</li>
                <li>• 회원권 잠재 부채 산정</li>
                <li>• 임대차 분석 + 시설 평가</li>
                <li>• 적정 권리금 의견 PDF</li>
                <li>• 검증 매물 배지 + 상위 노출</li>
                <li>• 운영팀 매수자 컨택 대행</li>
              </ul>
            </div>

            <div className="rounded-2xl border-2 border-amber-500 bg-white p-6">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-700">Success Fee</div>
              <div className="mt-2 text-3xl font-black text-amber-700">2~4<span className="text-base text-stone-500">%</span></div>
              <p className="mt-1 text-xs text-stone-500">거래 성사 시 권리금에서 슬라이딩</p>
              <table className="mt-4 w-full text-xs">
                <thead className="text-stone-500"><tr><th className="text-left py-1">권리금</th><th className="text-right py-1">요율</th></tr></thead>
                <tbody>
                  <tr className="border-t border-stone-200"><td className="py-1">1억 미만</td><td className="text-right py-1 font-bold">정액 300만</td></tr>
                  <tr className="border-t border-stone-200"><td className="py-1">1~3억</td><td className="text-right py-1 font-bold">4%</td></tr>
                  <tr className="border-t border-stone-200"><td className="py-1">3~10억</td><td className="text-right py-1 font-bold">3%</td></tr>
                  <tr className="border-t border-stone-200"><td className="py-1">10억 이상</td><td className="text-right py-1 font-bold">2%</td></tr>
                </tbody>
              </table>
              <p className="mt-3 text-[11px] text-stone-500">거래 미성사 시 success fee 0.</p>
            </div>
          </div>

          {/* 시뮬레이터 */}
          <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-6">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-700">권리금 입력 → 비용 계산</div>
            <SuccessFeeSimulator />
          </div>

          {/* 매물 PRO */}
          <div className="mt-6 rounded-xl border border-stone-200 bg-white p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500">선택 옵션</div>
            <div className="mt-1 flex items-baseline justify-between">
              <h3 className="text-base font-bold">매물 PRO 구독</h3>
              <span className="text-xl font-black text-amber-700">월 5<span className="text-sm text-stone-500">만원</span></span>
            </div>
            <p className="mt-2 text-xs text-stone-600">검증 매물 배지 + 상위 노출 + 매수자 컨택 즉시 알림 + 익명 노출 옵션. 해지 자유.</p>
          </div>

          <p className="mt-6 text-xs text-stone-500 leading-relaxed">
            ※ 부동산 중개수수료(0.4~0.9%)와 별개. 영업양수도 advisory는 한도 무관. 점포라인 매도자 부담(임대가 0.9% + 권리금 3~5%) 대비 합리적인 single-fee 모델.
          </p>
        </section>
      ) : null}

      {/* 법률·세무 탭 */}
      {tab === "legal" ? (
        <section className="mx-auto max-w-3xl px-5 py-10">
          <h2 className="text-xl font-bold">법률·세무 비용 (외부)</h2>
          <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
            <strong>이 비용은 의뢰인이 변호사·세무사·공증사무소에 직접 결제합니다.</strong><br />
            pilaos는 매칭과 일정 조율만 하고 자문료에 일절 관여하지 않습니다 (변호사법 §109 준수).
          </div>

          <div className="mt-6 space-y-3">
            <Legal title="변호사 1차 컨설팅 (30분)" price="15만원" desc="매물·계약·임대·세무 1차 평가. 매수자/매도자 모두 가능." />
            <Legal title="표준 양수도계약 + 임대인 동의서 + 클로징" price="120만원" desc="매수자가 변호사에 직접 위임. 임대인 동의서 동시 체결까지." />
            <Legal title="위약금 공증" price="5~20만원" desc="경업금지 위반·매출 거짓 시 권리금 200% 반환 약정. 강제집행 가능." />
            <Legal title="포괄양수도 신고 + 양도세" price="35만원" desc="제휴 세무사. 부가세 10% 추징 차단 + 양도소득세 정확히 처리." />
            <Legal title="권리금 에스크로 (선택)" price="매매가 0.3~0.5%" desc="제휴 법무법인 예치계좌 + 3자 약정. 인수인계 6개월 후 잔금 출금." />
            <Legal title="분쟁 시 1차 자문 (12개월 내)" price="15만원/회" desc="회원·임대·강사·세무 1차 평가. 본격 소송 수임은 별도." />
          </div>

          <div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-900 leading-relaxed">
            <strong>왜 분리하나요?</strong><br />
            변호사법 §109는 변호사 아닌 자가 변호사를 알선하고 수임료 일부를 받는 행위를 금지합니다. pilaos는 거래 자문(M&amp;A advisory) 자체에 대한 비용만 받고, 법률 자문료는 변호사가 의뢰인에게 직접 청구합니다. 이게 합법 구조이며 동시에 매수자분께도 가장 투명한 비용 구조입니다.
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-5 pb-12">
        <div className="rounded-2xl bg-stone-900 p-7 text-white text-center">
          <h3 className="text-xl font-bold">먼저 무료 상담부터.</h3>
          <p className="mt-2 text-sm text-stone-300">선생님 상황 듣고 어느 단계가 맞는지 같이 결정해요.</p>
          <Link href="/inquire?kind=acquire" className="mt-5 inline-block rounded-lg bg-amber-400 px-6 py-3 text-sm font-bold text-stone-900 hover:bg-amber-300">무료 상담 신청 →</Link>
        </div>
      </section>
    </div>
  );
}

function Tab({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className={`flex-1 rounded-lg px-3 py-2.5 text-center text-sm font-bold transition ${active ? "bg-white text-stone-900 shadow-sm" : "text-stone-600 hover:text-stone-900"}`}>
      {children}
    </Link>
  );
}

function Check() {
  return <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">✓</span>;
}

function Legal({ title, price, desc }: { title: string; price: string; desc: string }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-bold">{title}</h3>
        <span className="text-base font-extrabold text-amber-700">{price}</span>
      </div>
      <p className="mt-2 text-xs text-stone-600">{desc}</p>
    </div>
  );
}
