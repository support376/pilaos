import Link from "next/link";
import { SuccessFeeSimulator } from "./SuccessFeeSimulator";

export const metadata = {
  title: "비용 정책 — pilaos",
  description: "착수금 + 성공 보수. 매수자 예약금 50만. 변호사·세무사 비용은 별도.",
};

type Props = { searchParams: Promise<{ tab?: string }> };

export default async function Pricing({ searchParams }: Props) {
  const sp = await searchParams;
  const tab = sp.tab === "seller" ? "seller" : sp.tab === "legal" ? "legal" : "buyer";

  return (
    <div className="bg-white">
      <section className="mx-auto max-w-3xl px-5 pt-14 pb-6">
        <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">비용 정책</div>
        <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight">
          단계마다 <span className="text-blue-600">결제 시점이</span> 명확합니다.
        </h1>
        <p className="mt-5 text-base text-black/65 leading-relaxed">
          매수자가 우리에게 내시는 비용은 <strong className="text-black">예약금 50만원</strong>이 전부입니다. 매도자는 거래가 성사된 경우에만 권리금의 일정 %를 부담합니다. 변호사·세무사 비용은 별도 페이지에서 분리해 명시합니다.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-5">
        <div className="flex gap-1 rounded-xl bg-black/5 p-1">
          <Tab href="/pricing?tab=buyer" active={tab === "buyer"}>매수자</Tab>
          <Tab href="/pricing?tab=seller" active={tab === "seller"}>매도자</Tab>
          <Tab href="/pricing?tab=legal" active={tab === "legal"}>변호사·세무</Tab>
        </div>
      </section>

      {tab === "buyer" ? (
        <section className="mx-auto max-w-3xl px-5 py-10">
          <h2 className="text-xl font-extrabold">매수자 비용</h2>
          <p className="mt-2 text-sm text-black/65">우리에게 내시는 돈은 <strong className="text-black">예약금 50만원</strong>이 전부입니다.</p>

          <div className="mt-6 rounded-2xl border-2 border-black bg-white p-7">
            <div className="text-5xl font-black text-blue-600">50<span className="text-2xl text-black/50">만원</span></div>
            <div className="mt-3 text-sm text-black/70">자료 수령 디파짓 — 비밀유지 약속 후 진성정보 일체 수령</div>
            <ul className="mt-5 space-y-2 text-sm text-black/85">
              <li className="flex gap-2"><Check />매도자가 이미 인증받은 권리금 계산서 수령 (3~6개월 유효)</li>
              <li className="flex gap-2"><Check />POS·카드사·세금계산서 진성 자료 일체</li>
              <li className="flex gap-2"><Check />운영팀 1명이 전담으로 배정</li>
              <li className="flex gap-2"><Check />변호사·세무사·금융사 매칭 무료</li>
              <li className="flex gap-2"><Check />1년간 사후 운영 점검 무료</li>
            </ul>
            <p className="mt-5 rounded-lg bg-blue-50 p-3 text-xs text-blue-900 leading-relaxed">
              <strong>왜 디파짓을 받나요?</strong><br />
              매도자가 들인 시간과 자료에는 가치가 있습니다. 진성 매수자만 자료를 수령하도록 비밀유지 약속과 함께 디파짓을 받습니다. 변심 시 환불 X (자료 공개 완료). 매도자 잠적·자료 거짓 시 100% 환불 또는 다음 매물 매칭에 활용.
            </p>
          </div>

          <div className="mt-6 rounded-xl bg-black/5 p-5">
            <div className="text-xs font-bold text-black/55 mb-3">매수자 단계별 결제</div>
            <table className="w-full text-sm">
              <thead className="text-xs text-black/55">
                <tr><th className="text-left py-1">단계</th><th className="text-right py-1">결제처</th><th className="text-right py-1">금액</th></tr>
              </thead>
              <tbody>
                <tr className="border-t border-black/10"><td className="py-1.5">0 매물 찾기</td><td className="text-right">—</td><td className="text-right">0</td></tr>
                <tr className="border-t border-black/10"><td className="py-1.5">1 권리금 계산</td><td className="text-right">—</td><td className="text-right">0</td></tr>
                <tr className="border-t border-black/10 bg-blue-50/60"><td className="py-2.5 font-bold">2 실사·검토</td><td className="text-right">pilaos</td><td className="text-right font-bold text-blue-700">50만원</td></tr>
                <tr className="border-t border-black/10"><td className="py-1.5">3 계약·잔금</td><td className="text-right">변호사·세무사 직접</td><td className="text-right">약 165만</td></tr>
                <tr className="border-t border-black/10"><td className="py-1.5">4 1년 점검</td><td className="text-right">—</td><td className="text-right">0</td></tr>
              </tbody>
            </table>
            <p className="mt-3 text-xs text-black/55 leading-relaxed">
              ※ 변호사·세무사 비용은 의뢰인이 변호사·세무사에게 직접 결제합니다. <Link href="/pricing?tab=legal" className="text-blue-600 underline">자세히</Link>
            </p>
          </div>
        </section>
      ) : null}

      {tab === "seller" ? (
        <section className="mx-auto max-w-3xl px-5 py-10">
          <h2 className="text-xl font-extrabold">매도자 비용</h2>
          <p className="mt-2 text-sm text-black/65">착수금 <strong className="text-black">150만원</strong>으로 권리금 계산서 1회 인증 → <strong className="text-black">3~6개월 유효</strong>. 거래 성사 시 권리금의 일정 % 추가.</p>
          <div className="mt-3 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-xs text-blue-900 leading-relaxed">
            <strong>이미 인증받은 자료는 재사용됩니다.</strong> 다른 매수자가 같은 매물에 디파짓을 걸면 매도자분은 추가 비용 없이 자료가 그대로 활용됩니다.
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-black/15 bg-white p-6">
              <div className="text-[11px] font-bold uppercase tracking-widest text-black/55">착수금</div>
              <div className="mt-2 text-3xl font-black text-blue-600">150<span className="text-base text-black/50">만원</span></div>
              <p className="mt-1 text-xs text-black/55">권리금 계산서 제작 시점에 1회 결제</p>
              <ul className="mt-4 space-y-1.5 text-xs text-black/80">
                <li>• POS·카드·세금계산서 통합 매출 검증</li>
                <li>• 회원권 잠재 환불 부채 산정</li>
                <li>• 임대차 분석 + 시설 평가</li>
                <li>• 적정 권리금 의견 보고서</li>
                <li>• 검증 매물 배지 + 상위 노출</li>
                <li>• 매수자 컨택 우리가 대행</li>
              </ul>
            </div>

            <div className="rounded-2xl border-2 border-blue-600 bg-white p-6">
              <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">성공 보수 (거래 성사 시)</div>
              <div className="mt-2 text-3xl font-black text-blue-600">2~4<span className="text-base text-black/50">%</span></div>
              <p className="mt-1 text-xs text-black/55">권리금 구간별 슬라이딩</p>
              <table className="mt-4 w-full text-xs">
                <thead className="text-black/55"><tr><th className="text-left py-1">권리금</th><th className="text-right py-1">요율</th></tr></thead>
                <tbody>
                  <tr className="border-t border-black/10"><td className="py-1.5">1억 미만</td><td className="text-right py-1.5 font-bold">정액 300만</td></tr>
                  <tr className="border-t border-black/10"><td className="py-1.5">1억 ~ 3억</td><td className="text-right py-1.5 font-bold">4%</td></tr>
                  <tr className="border-t border-black/10"><td className="py-1.5">3억 ~ 10억</td><td className="text-right py-1.5 font-bold">3%</td></tr>
                  <tr className="border-t border-black/10"><td className="py-1.5">10억 이상</td><td className="text-right py-1.5 font-bold">2%</td></tr>
                </tbody>
              </table>
              <p className="mt-3 text-[11px] text-black/55">거래 미성사 시 성공 보수 0.</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-black/10 bg-black/[.02] p-6">
            <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">권리금 입력 → 비용 미리 계산</div>
            <SuccessFeeSimulator />
          </div>

          <div className="mt-6 rounded-xl border border-black/10 bg-white p-5">
            <div className="text-[11px] font-bold uppercase tracking-widest text-black/55">선택 옵션</div>
            <div className="mt-1 flex items-baseline justify-between">
              <h3 className="text-base font-bold">매물 검증 구독</h3>
              <span className="text-xl font-black text-blue-600">월 5<span className="text-sm text-black/50">만원</span></span>
            </div>
            <p className="mt-2 text-xs text-black/65 leading-relaxed">검증 매물 배지 + 상위 노출 + 매수자 컨택 즉시 알림 + 익명 노출 옵션. 해지 자유.</p>
          </div>

          <p className="mt-6 text-xs text-black/55 leading-relaxed">
            ※ 부동산 중개수수료(0.4~0.9%)와는 별개입니다. 영업양수도 자문은 한도가 따로 없습니다. 점포라인 매도자 부담(임대가 0.9% + 권리금 3~5%)보다 합리적인 단일 비용 모델입니다.
          </p>
        </section>
      ) : null}

      {tab === "legal" ? (
        <section className="mx-auto max-w-3xl px-5 py-10">
          <h2 className="text-xl font-extrabold">변호사·세무사 비용 (외부)</h2>
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 leading-relaxed">
            <strong>이 비용은 의뢰인이 변호사·세무사·공증사무소에 직접 결제합니다.</strong><br />
            pilaos는 매칭과 일정 조율만 하고 변호사 자문료에 일절 관여하지 않습니다 (변호사법 제109조 준수).
          </div>

          <div className="mt-6 space-y-3">
            <Legal title="변호사 1차 상담 (30분)" price="15만원" desc="매물·계약·임대·세무 1차 평가. 매수자/매도자 모두 가능." />
            <Legal title="표준 양수도계약 + 임대인 동의서 + 마무리" price="120만원" desc="매수자가 변호사에 직접 위임. 임대인 동의서 동시 체결까지." />
            <Legal title="위약금 공증" price="5~20만원" desc="공증사무소에 직접. 경업금지·매출 거짓 시 권리금 200% 반환을 강제 집행 가능." />
            <Legal title="포괄양수도 신고 + 양도세" price="35만원" desc="제휴 세무사. 부가세 10% 추징 차단 + 양도소득세 정확히 처리." />
            <Legal title="권리금 예치 (선택)" price="매매가의 0.3~0.5%" desc="제휴 법무법인 예치 계좌 + 3자 약정. 인수인계 6개월 후 잔금 출금. pilaos는 자금을 보관하지 않습니다." />
            <Legal title="분쟁 시 1차 상담 (12개월 안)" price="15만원/회" desc="회원·임대·강사·세무 분쟁 1차 평가. 본격 소송 수임은 별도 계약." />
          </div>

          <div className="mt-6 rounded-xl bg-blue-50 border border-blue-200 p-5 text-sm text-blue-900 leading-relaxed">
            <strong>왜 분리해서 받나요?</strong><br />
            변호사법 제109조는 변호사가 아닌 자가 변호사를 알선하고 수임료의 일부를 받는 행위를 형사처벌합니다. pilaos가 "법률 묶음 패키지"를 만들어 변호사 비용까지 받으면 위반 위험이 있습니다.
            <br /><br />
            그래서 <strong>거래 자문</strong>에 대한 비용만 우리가 받고, 법률 자문료는 변호사가 의뢰인에게 직접 청구하도록 분리합니다. 이게 합법 구조이며 매수자에게도 가장 투명한 방식입니다.
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-3xl px-5 pb-12">
        <div className="rounded-2xl bg-black p-7 text-white text-center">
          <h3 className="text-xl font-extrabold">먼저 무료 상담부터.</h3>
          <p className="mt-2 text-sm text-white/75">상황을 듣고 어느 단계부터 시작하면 좋을지 함께 결정해요.</p>
          <Link href="/inquire?kind=acquire" className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700">상담 신청 →</Link>
        </div>
      </section>
    </div>
  );
}

function Tab({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className={`flex-1 rounded-lg px-2 py-2.5 text-center text-[13px] sm:text-sm font-bold transition whitespace-nowrap ${active ? "bg-white text-black shadow-sm" : "text-black/55 hover:text-black"}`}>
      {children}
    </Link>
  );
}

function Check() { return <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">✓</span>; }

function Legal({ title, price, desc }: { title: string; price: string; desc: string }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-bold">{title}</h3>
        <span className="text-base font-extrabold text-blue-600 whitespace-nowrap">{price}</span>
      </div>
      <p className="mt-2 text-xs text-black/65 leading-relaxed">{desc}</p>
    </div>
  );
}
