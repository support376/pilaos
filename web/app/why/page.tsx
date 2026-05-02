import Link from "next/link";

export const metadata = { title: "왜 변호사 동반 실사가 필요한가" };

const DISPUTES = [
  {
    title: "권리금 분쟁 — 매출 부풀리기 / 회원수 허위 신고",
    pct: "약 38%",
    desc: "매도자가 신고한 월매출과 실제 매출이 크게 다른 케이스. 인수 후 1~3개월 내 매출 검증으로 발견됨. 협상 후 권리금 일부 환급 또는 소송으로 진행. 평균 분쟁 기간 6~12개월, 변호사 비용 300~800만원.",
    prevention: "실사 단계에서 카드매출·POS 데이터·세무신고서 3종 교차 검증",
  },
  {
    title: "임대차 승계 거부 / 갱신청구권 분쟁",
    pct: "약 22%",
    desc: "임대인이 양수인 입주 시 임대차 갱신을 거부하거나 보증금·월세 인상 요구. 매수자는 권리금 회수 못 하고 단기간 폐업 위험. 상가건물임대차보호법상 갱신청구권 보호되지만 주장 입증 필요.",
    prevention: "계약 전 임대인 미팅 + 갱신협조 확인서 + 잔여 계약 기간 5년+ 검증",
  },
  {
    title: "회원권 승계 / 환급 분쟁",
    pct: "약 18%",
    desc: "기존 회원이 양수인 운영 정책 변경(가격·시간·강사)에 환불 요구. 회원권 약관 표준화 안 돼있으면 양수인 부담. 1인당 평균 환급 30~150만원, 100명 매장 기준 최대 1억대 부담.",
    prevention: "회원 동의서 사전 수집 + 양수인 정책 사전 공지 + 환급 책임 분담 계약 명시",
  },
  {
    title: "강사 인수인계 거부 / 단체 이탈",
    pct: "약 12%",
    desc: "주력 강사가 양수도 시점에 단체 이탈 → 매출 50%+ 즉시 손실. 강사 회원 이끌고 인근에 새 매장 오픈하는 케이스도. 인수인계 동의 없이 진행하면 매수자가 권리금 일부 환급 청구.",
    prevention: "강사별 인수 동의서 + 비경쟁 약정 + 핵심 강사 1~3개월 인수인계 의무",
  },
  {
    title: "체험 후 노쇼 / 5분 전 취소 (단톡방 사례)",
    pct: "약 12%",
    desc: "체험 1회 등록 후 노쇼 또는 임박 취소. 자리 손실 + 강사 시간 낭비. 보상 룰 모호 시 회원과 분쟁. 단톡방에서도 '체험 후 등록 안 함'이 빈번한 페인.",
    prevention: "체험비 사전 결제 (2~7만) + 24시간 전 취소 정책 + 노쇼 시 차감 조항",
  },
  {
    title: "수업 중 회원 부상 → 강사 보상 청구",
    pct: "약 8%",
    desc: "그룹/개인 수업 중 회원이 넘어지거나 다친 경우 보상 요구. 일상생활책임보험 미가입 강사·센터가 직접 부담. 1건당 합의금 100~500만, 의료비 + 위자료 포함.",
    prevention: "센터 영업배상책임보험 + 강사 단체보험 가입 확인. 수업 전 컨디션 확인서.",
  },
  {
    title: "시설·기기 하자 / 인테리어 잔존가치 과대평가",
    pct: "약 6%",
    desc: "리포머·캐딜락·인테리어가 외관과 달리 노후. 인수 후 6개월 내 교체 비용 1~3천만원 발생. 매도자는 중고이니 책임 없다 주장.",
    prevention: "기기별 사용 연식·정비 이력 + 인테리어 사진·동영상 + 잔존가치 산정서",
  },
  {
    title: "동업 운영 폐업 / 의사결정 분쟁",
    pct: "약 5%",
    desc: "지인·강사와 동업으로 시작 → 매출 분배·운영 방향 충돌 → 폐업. 자본 회수 분쟁이 가장 어려움. 평균 분쟁 6개월~2년.",
    prevention: "동업 약정서 (지분·역할·이탈 조건 명시) + 운영 KPI·의사결정 룰 사전 합의",
  },
  {
    title: "강사 권고사직 / 부당해고 소송",
    pct: "약 5%",
    desc: "수습 1주 ~ 1개월 후 강사 해고 → 부당해고로 소송. 계약서 미작성 시 노동위원회에서 사용자 판정 → 1~3개월치 임금 지급 명령. 위로금 합의가 일반적.",
    prevention: "계약서 작성 (수습 3개월 명시) + 권고사직 사유 문서화 + 노무사 자문",
  },
  {
    title: "카드 결제 환불 시스템 미스매칭",
    pct: "약 4%",
    desc: "토스·바디코디 등 결제 PG간 분할결제·환불 미동기화 → 회원이 환불 안 됐다 클레임. 운영팀 확인 동안 부정 송금 의심까지. 1건당 처리 1~3일.",
    prevention: "분할결제 시 단일 PG 사용 + 환불은 카드사 승인번호 직접 확인",
  },
  {
    title: "양도소득세 분쟁 / 세무 조사",
    pct: "약 4%",
    desc: "권리금에 대한 양도소득세 신고 누락 → 추후 세무 조사로 가산세·과태료. 매도자·매수자 모두 영향. 권리금이 4,800만원 초과 시 양도소득세 22~33%.",
    prevention: "양도소득세 신고 의무 사전 안내 + 세무사 동반 신고 패키지",
  },
];

export default function Why() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-rose-600">분쟁 통계 + 실사 필요성</p>
        <h1 className="mt-2 text-3xl font-bold">왜 변호사 동반 실사가 필요한가</h1>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          영업양수도 거래 + 일상 운영에서 발생하는 실제 분쟁 11대 유형과 빈도, 평균 손해 규모, 사전 예방 방법.
          매도자도 매수자도 놓치는 부분이 많기 때문에 — 분쟁 방지를 위해서라도 실사가 결정적입니다.
        </p>
      </div>

      <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-900">
        <p>
          <strong>실 분쟁 발생률 — 영업양수도 100건 中 약 30~40건</strong>이 최소 1개 이상의 분쟁을 겪습니다.
          한국공정거래조정원·소상공인진흥공단 조정 사건 + 변호사회 자문 사례 + 실 단톡방 발화 기반 추정.
          중·소 매장 거래일수록 표준 절차 부재로 분쟁 빈도가 더 높습니다.
        </p>
      </section>

      <section className="mt-8 space-y-4">
        {DISPUTES.map((d) => (
          <article key={d.title} className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg font-bold text-gray-900">{d.title}</h2>
              <span className="rounded-md bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-800">발생 빈도 {d.pct}</span>
            </div>
            <p className="mt-3 text-sm text-gray-700 leading-relaxed">{d.desc}</p>
            <div className="mt-3 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-900">
              <strong>실사 시 예방.</strong> {d.prevention}
            </div>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-2xl bg-gray-900 p-6 text-white">
        <h2 className="text-xl font-bold">pilaos 실사 패키지가 다루는 4축</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-gray-800 p-4">
            <div className="text-xs text-amber-400 font-bold">법률</div>
            <div className="mt-1 font-bold">임대차계약 · 권리양도 · 강사 인수</div>
            <p className="mt-1 text-xs text-gray-300">변호사 검토 (의뢰인 직접 위임)</p>
          </div>
          <div className="rounded-lg bg-gray-800 p-4">
            <div className="text-xs text-amber-400 font-bold">재무</div>
            <div className="mt-1 font-bold">매출장 · 카드매출 · POS · 세무 신고</div>
            <p className="mt-1 text-xs text-gray-300">3중 교차 검증으로 매출 진위 확인</p>
          </div>
          <div className="rounded-lg bg-gray-800 p-4">
            <div className="text-xs text-amber-400 font-bold">시설</div>
            <div className="mt-1 font-bold">리포머·인테리어 잔존가치 · 시설 사진</div>
            <p className="mt-1 text-xs text-gray-300">기기 정비 이력 + 잔여 수명 평가</p>
          </div>
          <div className="rounded-lg bg-gray-800 p-4">
            <div className="text-xs text-amber-400 font-bold">회원</div>
            <div className="mt-1 font-bold">활성 회원 · 재등록률 · 환급 잠재 부담</div>
            <p className="mt-1 text-xs text-gray-300">표준 회원 승계 동의 절차</p>
          </div>
        </div>
        <p className="mt-5 text-sm text-gray-300">
          분쟁은 사후 변호사 비용보다 사전 실사가 훨씬 저렴합니다.
          실사 패키지 평균 300~500만 vs 분쟁 발생 시 평균 변호사 비용 + 합의금 1,000~5,000만.
        </p>
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link href="/buy/intent" className="rounded-xl bg-gray-900 px-5 py-4 text-center text-white hover:bg-gray-700">
          <div className="text-xs text-gray-300">매수자라면</div>
          <div className="text-base font-bold">매수 의향 등록 →</div>
        </Link>
        <Link href="/sell/new" className="rounded-xl border-2 border-amber-300 bg-amber-50 px-5 py-4 text-center hover:bg-amber-100">
          <div className="text-xs text-amber-700">매도자라면</div>
          <div className="text-base font-bold text-amber-900">매물 등록 →</div>
        </Link>
      </section>
    </div>
  );
}
