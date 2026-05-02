import Link from "next/link";

export const metadata = {
  title: "혼자 인수의 7가지 위험",
  description: "필라테스·요가 인수 후 6개월 안에 분쟁이 터지는 7가지 패턴",
};

const RISKS = [
  {
    n: 1,
    title: "회원권 환불 폭탄",
    loss: "5천만 ~ 3억",
    pattern: "인수 첫 달부터 회원이 \"양도인과 계약했다\"며 환불 청구. 양수인이 미사용 잔여 횟수를 떠안습니다.",
    detail: "방문판매법상 잔여분 환불 의무가 양수인에게 승계됩니다. 학원당 평균 잠재 부채는 1인당 50~150만원 × 활성 회원수.",
  },
  {
    n: 2,
    title: "임대인 갱신·승계 거부",
    loss: "권리금 전액",
    pattern: "권리금 1억 지급 후 임대인이 보증금 인상·신규 임차인 거부. 권리금 회수 불가.",
    detail: "상가임대차보호법상 권리금 회수 방해 금지에도 임대인 거부 사례 다수. 계약 전 임대인 동의서 동시 체결이 필수.",
  },
  {
    n: 3,
    title: "핵심 강사 단체 이탈",
    loss: "월매출 50% 이상",
    pattern: "인수 즉시 강사가 인근에 새 학원 오픈, 회원 그룹챗으로 이전. 양수인은 빈 리포머만 인수.",
    detail: "강사 잔류 인센티브 + 양도인·강사 경업금지 약정(반경 1~2km, 1~2년) + 위약벌이 표준 방어책.",
  },
  {
    n: 4,
    title: "매출 부풀리기 발견",
    loss: "권리금의 30~50%",
    pattern: "\"월 8천 매출\"이 실제 4천. POS·카드사 명세 검증 시 매도자 주장과 다름.",
    detail: "현금·계좌이체 분리, 휴면회원 활성화 처리 등으로 매출 조작. 변호사 입회 데이터룸 필수.",
  },
  {
    n: 5,
    title: "세무 추징",
    loss: "부가세 10% + 양도세",
    pattern: "포괄양수도 신고 누락 시 매매가 10% 부가세 추징. 권리금 기타소득 8.8% 원천징수 누락.",
    detail: "포괄양수도 요건 미충족 시 일반 양수도로 처리되어 부가세 발생. 사전 세무사 검토 필수.",
  },
  {
    n: 6,
    title: "리포머·캐딜락 시설 노후",
    loss: "2~3천만원",
    pattern: "스프링·프레임·바닥 충격흡수재 노후. 인수 후 발견 → 전체 교체 필요.",
    detail: "기구 시리얼·연식·정비이력 첨부 + 인수 30일 하자담보 특약이 표준.",
  },
  {
    n: 7,
    title: "동업·법인 지분 분쟁",
    loss: "사업 정지 위험",
    pattern: "매도자가 단독 명의가 아닌데 동업자 동의 없이 양도. 인수 후 동업자가 무효 주장.",
    detail: "사업자등록 단독 vs 공동 확인. 법인일 경우 주주명부·이사회 결의서 필수 검토.",
  },
];

export default function RiskPage() {
  return (
    <div className="bg-stone-50">
      <section className="mx-auto max-w-2xl px-5 pt-14 pb-10">
        <div className="text-xs font-bold uppercase tracking-wider text-rose-700">혼자 하실 때 위험</div>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          인수 100건 중 <span className="text-rose-600">30건은 6개월 안에 분쟁</span>
        </h1>
        <p className="mt-4 text-base text-stone-600 leading-relaxed">
          필라테스·요가 영업양수도에서 매수자가 인수 후 실제로 겪는 분쟁 7가지를 정리했습니다.<br />
          이 중 <strong>3~4가지</strong>는 매수자가 인수 전에 절대 모르는 항목입니다.
        </p>
      </section>

      <section className="mx-auto max-w-2xl px-5 pb-10">
        <div className="space-y-4">
          {RISKS.map((r) => (
            <div key={r.n} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-rose-600 text-base font-extrabold text-white">{r.n}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-lg font-bold">{r.title}</h2>
                    <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700">손실 {r.loss}</span>
                  </div>
                  <p className="mt-2 text-sm text-stone-700">{r.pattern}</p>
                  <p className="mt-2 text-xs text-stone-500 leading-relaxed">{r.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-5 pb-12">
        <div className="rounded-2xl bg-stone-900 p-7 text-white">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400">우리 대책</div>
          <h3 className="mt-2 text-2xl font-bold leading-snug">
            7가지를 <span className="text-amber-400">단계로 끊어드립니다.</span>
          </h3>
          <p className="mt-3 text-sm text-stone-300 leading-relaxed">
            매물 발견 → 권리금 산정 → 실사 → 변호사 클로징 → 1년 점검까지.<br />
            매수자분이 우리에게 내시는 돈은 <strong className="text-white">디파짓 50만원</strong>뿐. 나머지는 단계마다 결정.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/process" className="rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-bold text-stone-900 hover:bg-amber-300">5단계 절차 보기 →</Link>
            <Link href="/inquire?kind=acquire" className="rounded-lg border border-stone-700 px-5 py-2.5 text-sm font-bold hover:bg-stone-800">무료 상담 신청</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
