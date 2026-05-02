import Link from "next/link";

export const metadata = { title: "이용약관 — pilaos" };

export default function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-2xl font-bold sm:text-3xl">이용약관 (v3)</h1>
      <p className="mt-2 text-xs text-black/50">최종 개정: 2026년 5월 2일 · 시행: 2026년 5월 2일</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-black/75">

        <Article num="1" title="플랫폼의 성격">
          <p>pilaos(이하 "회사")는 필라테스·요가 영업양수도(권리금 거래)에 대한 <strong>거래 자문 플랫폼(거래 자문 플랫폼)</strong>입니다. 회사는 변호사·세무사·공인중개사·금융기관이 아니며, 법률·세무·중개·금융 자문을 직접 제공하지 않습니다.</p>
        </Article>

        <Article num="2" title="제공 서비스">
          <ul className="list-disc pl-5 space-y-1">
            <li>매물 자동 시드 검색·매칭 (무료)</li>
            <li>권리금 산정 보고서 제작 (착수금 결제 후 제공)</li>
            <li>매도자·매수자 카톡 컨택 대행</li>
            <li>변호사·세무사·금융사 매칭(무료, 자문료 미관여)</li>
            <li>거래 성사 시 성공 보수 청구</li>
            <li>인수 후 12개월 운영 점검 (무료)</li>
          </ul>
        </Article>

        <Article num="3" title="단계별 비용 정책">
          <p><strong>매수자</strong>: Stage 2 진입 시 디파짓 50만원. 변호사·세무사·공증·금융 비용은 의뢰인이 해당 사무소에 직접 결제합니다.</p>
          <p className="mt-2"><strong>매도자</strong>: Stage 1 착수금 150만원. 거래 성사 시 권리금 구간별 성공 보수:</p>
          <ul className="mt-1.5 list-disc pl-5 space-y-0.5 text-xs">
            <li>1억 미만: 정액 300만원</li>
            <li>1억~3억: 4%</li>
            <li>3억~10억: 3%</li>
            <li>10억 이상: 2%</li>
          </ul>
          <p className="mt-2 text-xs text-black/50">자세히는 <Link href="/pricing" className="underline">/pricing</Link> 참조.</p>
        </Article>

        <Article num="4" title="환불 정책">
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>착수금 (매도자 150만)</strong>: 작업 시작 전 100% 환불, 보고서 제작 50% 진행 후 50% 환불, 완료 후 환불 X.</li>
            <li><strong>디파짓 (매수자 50만)</strong>: 비밀유지 약속 진행 전 100% 환불. 비밀유지 약속·자료 수령 후 매수자 단순 변심은 환불 X. 매도자 잠적·자료 거짓 입증 시 다음 매물 매칭에 활용 또는 100% 환불.</li>
            <li><strong>성공 보수</strong>: 거래 성사 시점에만 발생. 미성사 시 0.</li>
          </ul>
        </Article>

        <Article num="5" title="변호사·세무사 자문료 분리 원칙">
          <p>회사는 변호사법 §109 및 §34를 준수하기 위해 다음을 지킵니다:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>변호사·세무사 자문료를 회사가 청구하거나 수령하지 않습니다.</li>
            <li>변호사·세무사 디렉토리는 정액 월 광고비 모델로 운영됩니다(헌재 2022.5.26. 2021헌마619).</li>
            <li>매수자/매도자가 변호사·세무사를 직접 선택하고, 자문료는 변호사·세무사 사무소에 직접 결제합니다.</li>
            <li>회사는 매칭과 일정 조율, 자료 전달만 수행하며 자문료에 일절 관여하지 않습니다.</li>
          </ul>
        </Article>

        <Article num="6" title="자금 보관 금지 원칙">
          <p>회사는 권리금·매매대금·에스크로 자금을 직접 보관하지 않습니다. 권리금 분할지급·에스크로가 필요한 경우 다음 중 하나로 안내합니다:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>제휴 법무법인 예치계좌 (변호사 위임)</li>
            <li>은행 신탁계좌 (KB·하나·우리 등)</li>
            <li>3자 약정 은행계좌 (매수자·매도자·은행 약정)</li>
          </ul>
          <p className="mt-2">이는 특정금융정보법(특금법) 및 유사수신행위 규제에 따른 것입니다.</p>
        </Article>

        <Article num="7" title="매물 정보의 성격">
          <p>회사가 노출하는 매물 정보 중 자동 시드 매물(잠재매물)은 카카오·네이버 등 공개 데이터를 기반으로 자동 수집된 것이며, 매장 운영자가 직접 등록한 매물이 아닙니다. 권리금·매출·수익률·매도 시그널 등 모든 숫자와 평가는 <strong>추정·참고용</strong>이며 실제 거래가를 보증하지 않습니다.</p>
          <p className="mt-2">매장 운영자께서 노출 거부를 원하시면 매물 페이지의 "노출 거부 신청" 또는 운영팀 카톡으로 연락 주시면 24시간 내 처리합니다.</p>
        </Article>

        <Article num="8" title="면책">
          <p>회사가 제공하는 권리금·매출·수익률 등의 추정값과 평가, 변호사·세무사·금융사 매칭은 거래 의사결정의 <strong>참고 자료</strong>이며, 회사는 거래 당사자 간 분쟁의 직접 당사자가 아닙니다. 매수자·매도자 간 거래 결정의 책임은 전적으로 이용자에게 있습니다.</p>
          <p className="mt-2">단, 회사가 제작한 권리금 산정 보고서에 매도자 자료와 무관한 산정 오류가 있는 경우 100% 환불합니다 (착수금 한정).</p>
        </Article>

        <Article num="9" title="개인정보">
          <p>회사는 신청 단계에서 휴대폰 번호와 자유 입력 정보만 수집하며, 매도자가 제출하는 회원·강사 명단은 마스킹 후 전달받습니다. 자세한 내용은 <Link href="/privacy" className="underline">개인정보처리방침</Link> 참조.</p>
        </Article>

        <Article num="10" title="분쟁 해결">
          <p>본 약관에 관한 분쟁은 서울중앙지방법원을 1심 관할법원으로 합니다. 1년 이내 발생한 분쟁에 대해서는 회사 운영팀이 1차 중재를 무료로 시도합니다(법적 효력 없음).</p>
        </Article>

      </div>

      <div className="mt-10 rounded-lg bg-blue-50 border border-blue-200 p-4 text-xs text-blue-900">
        <strong>면책의 한계.</strong> 본 약관은 v3입니다. 향후 정책 변경 시 사전 공지 후 시행합니다. 약관 해석 분쟁은 이용자에게 유리하게 적용합니다.
      </div>

      <div className="mt-6 flex gap-3 text-sm">
        <Link href="/pricing" className="text-blue-600 underline">가격 정책</Link>
        <Link href="/process" className="text-blue-600 underline">5단계 절차</Link>
        <Link href="/privacy" className="text-blue-600 underline">개인정보</Link>
      </div>
    </div>
  );
}

function Article({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-base font-bold sm:text-lg">제 {num} 조 <span className="text-black/50 font-normal">·</span> {title}</h2>
      <div className="mt-2 space-y-1.5">{children}</div>
    </section>
  );
}
