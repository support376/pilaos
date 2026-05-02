import Link from "next/link";

export const metadata = {
  title: "혼자 사면 위험한 7가지 이유",
  description: "필라테스·요가 학원을 인수한 뒤 6개월 안에 분쟁이 터지는 7가지 패턴",
};

const RISKS = [
  {
    n: 1,
    title: "회원권 환불 폭탄",
    loss: "5천만 ~ 3억",
    pattern: '인수 첫 달부터 회원이 "예전 원장님과 계약했다"며 환불을 요구합니다. 양수인이 미사용 회원권 잔여분을 모두 떠안게 됩니다.',
    detail: "방문판매법상 잔여분 환불 의무가 양수인에게 그대로 넘어옵니다. 회원당 미사용 평균 50~150만원 × 활성 회원수만큼 잠재 부채가 됩니다.",
  },
  {
    n: 2,
    title: "임대인이 갱신·승계 거부",
    loss: "권리금 전액",
    pattern: "권리금 1억을 지급한 뒤 임대인이 보증금 인상이나 신규 임차인 거부를 통보합니다. 권리금 회수가 사실상 불가능해집니다.",
    detail: "상가임대차보호법에 권리금 회수 방해 금지 조항이 있어도 분쟁 사례가 많습니다. 계약 전에 임대인 동의서를 동시에 받는 것이 필수입니다.",
  },
  {
    n: 3,
    title: "핵심 강사가 단체로 그만둠",
    loss: "월매출 절반↓",
    pattern: "인수 즉시 강사들이 인근에 새 학원을 열고, 기존 회원을 그룹 채팅방으로 데려갑니다. 빈 기구만 남게 됩니다.",
    detail: "강사 잔류 인센티브 + 매도자·강사 모두에 대한 경업금지 약정(반경 1~2km, 1~2년) + 위약금이 표준 방어책입니다.",
  },
  {
    n: 4,
    title: "실제 매출이 매도자 말과 다름",
    loss: "권리금의 30~50%",
    pattern: '"월 8천 매출"이 실제로는 4천. POS와 카드사 명세를 검증해보면 매도자 주장과 다른 경우가 흔합니다.',
    detail: "현금과 계좌이체를 분리하거나 휴면 회원을 활성으로 표시하는 방식의 매출 부풀리기. 변호사 입회 데이터룸이 필요합니다.",
  },
  {
    n: 5,
    title: "세금 추징",
    loss: "부가세 10% + 양도세",
    pattern: "포괄양수도 신고를 누락하면 매매가의 10%를 부가세로 추징당합니다. 권리금 기타소득 8.8% 원천징수도 누락하기 쉽습니다.",
    detail: "포괄양수도 요건을 충족하지 못하면 일반 양수도로 처리되어 부가세가 발생합니다. 사전 세무사 검토가 필수입니다.",
  },
  {
    n: 6,
    title: "기구·시설 노후 발견",
    loss: "2~3천만",
    pattern: "리포머 스프링·프레임이나 바닥 충격흡수재가 노후. 인수한 뒤 발견되면 전체 교체를 해야 합니다.",
    detail: "기구마다 시리얼·연식·정비 이력을 받고, 인수 30일 안에 하자가 발견되면 매도자가 부담하는 특약을 거는 것이 표준입니다.",
  },
  {
    n: 7,
    title: "공동 명의·법인 분쟁",
    loss: "사업 정지",
    pattern: "매도자가 단독 명의가 아닌데 공동 명의자 동의 없이 양도. 인수 후 공동 명의자가 무효를 주장합니다.",
    detail: "사업자등록이 단독인지 공동인지 먼저 확인해야 합니다. 법인일 경우 주주명부와 이사회 결의서를 함께 검토해야 합니다.",
  },
];

export default function Risk() {
  return (
    <div className="bg-white">
      <section className="mx-auto max-w-2xl px-5 pt-14 pb-10">
        <div className="text-[11px] font-bold uppercase tracking-widest text-red-600">혼자 사면 위험합니다</div>
        <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight">
          학원 100곳 중 <span className="text-red-600">30곳은 6개월 안에 분쟁</span>
        </h1>
        <p className="mt-5 text-base text-black/65 leading-relaxed">
          필라테스·요가 학원을 인수한 매수자가 실제로 겪는 분쟁 7가지를 정리했습니다.<br />
          이 중 <strong className="text-black">3~4가지는 인수 전에 알 수 없는 항목</strong>입니다.
        </p>
      </section>

      <section className="mx-auto max-w-2xl px-5 pb-10">
        <div className="space-y-4">
          {RISKS.map((r) => (
            <div key={r.n} className="rounded-2xl border border-black/10 bg-white p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-600 text-base font-extrabold text-white">{r.n}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h2 className="text-lg font-extrabold text-black">{r.title}</h2>
                    <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-bold text-red-600">손실 {r.loss}</span>
                  </div>
                  <p className="mt-3 text-sm text-black/75 leading-relaxed">{r.pattern}</p>
                  <p className="mt-2 text-xs text-black/55 leading-relaxed">{r.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-5 pb-12">
        <div className="rounded-2xl bg-black p-7 text-white">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-400">우리의 대책</div>
          <h3 className="mt-3 text-2xl font-extrabold leading-snug">
            7가지를 <span className="text-blue-400">단계로 끊어드립니다.</span>
          </h3>
          <p className="mt-4 text-sm text-white/75 leading-relaxed">
            매물 찾기 → 권리금 계산 → 실사·검토 → 변호사 마무리 → 1년 점검까지.<br />
            매수자분이 우리에게 내시는 비용은 <strong className="text-white">예약금 50만원</strong>이 전부입니다. 나머지는 단계마다 결정해요.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/process" className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700">5단계 보기 →</Link>
            <Link href="/inquire?kind=acquire" className="rounded-lg border border-white/20 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10">상담 신청</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
