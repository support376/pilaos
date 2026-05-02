import Link from "next/link";

export const metadata = { title: "이용약관" };

export default function Terms() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 prose prose-sm">
      <h1 className="text-2xl font-bold">pilaos 이용약관</h1>
      <p className="text-xs text-gray-500 mt-1">시행일: 2026-05-02 · v1.0</p>

      <h2 className="mt-8 text-lg font-bold">제1조 (목적)</h2>
      <p className="mt-2 text-sm text-gray-700 leading-relaxed">
        본 약관은 pilaos (이하 "서비스")의 운영자와 이용자 간의 권리·의무·책임 사항을 규정합니다.
        서비스는 전국 필라테스 영업양수도(M&amp;A) 정보 제공 및 매수·매도 의향 매칭 플랫폼입니다.
      </p>

      <h2 className="mt-6 text-lg font-bold">제2조 (서비스 성격 — 잠재매물)</h2>
      <ol className="mt-2 list-decimal pl-5 text-sm text-gray-700 leading-relaxed space-y-1.5">
        <li>본 서비스에 노출되는 매물은 카카오·네이버 등의 공개 데이터를 기반으로 자동 수집된 <strong>잠재매물</strong>입니다.</li>
        <li>매장 운영자가 직접 등록한 매물이 아니며, 권리금·매출·수익률 등 모든 숫자는 <strong>공개 데이터 기반 추정치</strong>입니다.</li>
        <li>서비스는 매장 운영자가 매물 노출 거부, 정보 정정, 익명 처리, 즉시 삭제를 요청할 수 있는 절차를 제공합니다 (제5조).</li>
        <li>서비스가 제공하는 가치 평가·매칭은 매도/매수 의사결정의 참고 자료이며, 거래의 결과를 보장하지 않습니다.</li>
      </ol>

      <h2 className="mt-6 text-lg font-bold">제3조 (이용자의 구분)</h2>
      <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 leading-relaxed space-y-1.5">
        <li><strong>매수자</strong> — 필라테스 매장 인수 또는 창업을 검토하는 자</li>
        <li><strong>매도자</strong> — 본인 운영 매장의 양도·이전·폐업을 검토하는 자</li>
        <li><strong>일반 방문자</strong> — 매물 정보·시세·통계를 열람하는 자</li>
      </ul>

      <h2 className="mt-6 text-lg font-bold">제4조 (제공 서비스)</h2>
      <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 leading-relaxed space-y-1.5">
        <li>매물 디렉토리·검색·필터·시세 통계</li>
        <li>매수·매도·창업·폐업 4 인텐트 등록</li>
        <li>운영팀의 매도 측 컨택 대행 (정보 제공 목적)</li>
        <li>NDA 후 진성정보 매칭 (선택)</li>
        <li>변호사 동반 실사 패키지 (선택)</li>
        <li>표준 영업양수도 계약 템플릿 (변호사 검토판)</li>
      </ul>

      <h2 className="mt-6 text-lg font-bold">제5조 (매장 운영자의 권리)</h2>
      <p className="mt-2 text-sm text-gray-700 leading-relaxed">매장 운영자(매도자)는 다음 권리를 행사할 수 있습니다.</p>
      <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 leading-relaxed space-y-1.5">
        <li><strong>노출 거부 (Take-down)</strong> — 매물 페이지에서 "노출 거부 신청" → 휴대폰·사업자번호 인증 → 24시간 내 hide</li>
        <li><strong>정보 정정</strong> — 본인확인 후 평수·층·시설·전화번호 등 잘못된 정보 정정 요청</li>
        <li><strong>익명 노출</strong> — 상호 비공개, 시군구·동까지만 노출</li>
        <li><strong>매도 의향 등록</strong> — "이거 우리 매장입니다" 5단계 위저드</li>
        <li><strong>개인정보 삭제</strong> — 휴대폰번호·사업자번호 등 본인 식별 가능 정보의 즉시 삭제</li>
      </ul>

      <h2 className="mt-6 text-lg font-bold">제6조 (운영팀 컨택 정책)</h2>
      <ol className="mt-2 list-decimal pl-5 text-sm text-gray-700 leading-relaxed space-y-1.5">
        <li>운영팀은 매수자가 의향 등록한 매물의 매도자에게 "잠재 매수자 N명이 있다"는 정보 제공 목적의 1회 컨택을 진행할 수 있습니다.</li>
        <li>매도자가 응답하지 않으면 90일 후 1회 추가 컨택만 가능합니다.</li>
        <li>매도자가 거절 의사를 밝히면 영구적으로 do-not-contact 리스트에 등록됩니다.</li>
        <li>본 컨택은 1:1 비즈니스 제안이며 광고성 정보가 아닙니다.</li>
      </ol>

      <h2 className="mt-6 text-lg font-bold">제7조 (수수료 및 비용)</h2>
      <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 leading-relaxed space-y-1.5">
        <li>매물 등록·검색·의향 등록은 <strong>무료</strong>입니다.</li>
        <li>거래 성공 시 매도가의 1~3% 성공보수 (매도자 부담)</li>
        <li>실사 패키지 (선택) 별도 정액 — 시설·재무·회원 검증</li>
        <li>변호사 자문은 의뢰인이 변호사와 직접 위임 계약 체결, pilaos는 자문료를 받지 않습니다 (변호사법 제109조 준수)</li>
      </ul>

      <h2 className="mt-6 text-lg font-bold">제8조 (책임의 한계)</h2>
      <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 leading-relaxed space-y-1.5">
        <li>매물의 권리금·매출·수익률 등 모든 추정치는 공개 데이터 기반이며, 정확성을 보장하지 않습니다.</li>
        <li>거래 당사자 간 분쟁에 대해 pilaos는 중개·조정 역할만 수행하며, 거래의 효력·이행 책임은 당사자에게 귀속됩니다.</li>
        <li>서비스 일시 중단·데이터 오류로 인한 간접 손해에 대해 책임을 지지 않습니다.</li>
      </ul>

      <h2 className="mt-6 text-lg font-bold">제9조 (지적재산권 · 데이터 출처)</h2>
      <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 leading-relaxed space-y-1.5">
        <li>매장 사진은 카카오맵·네이버 플레이스의 공개 데이터를 hotlinking 방식으로 노출하며, 출처를 명시합니다 (자체 저장 X).</li>
        <li>pilaos가 자체 산출한 가치 평가 알고리즘·매칭 모델은 pilaos의 지적재산입니다.</li>
        <li>매장 운영자는 본인 매장 사진의 노출 거부 또는 자체 사진 업로드를 요청할 수 있습니다.</li>
      </ul>

      <h2 className="mt-6 text-lg font-bold">제10조 (분쟁 해결)</h2>
      <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 leading-relaxed space-y-1.5">
        <li>이용 중 분쟁은 우선 운영팀과의 협의로 해결합니다.</li>
        <li>협의가 어려운 경우 한국소비자원 또는 관할 법원의 조정·소송으로 진행합니다.</li>
        <li>관할 법원: 서울중앙지방법원</li>
      </ul>

      <h2 className="mt-6 text-lg font-bold">제11조 (약관 변경)</h2>
      <p className="mt-2 text-sm text-gray-700 leading-relaxed">
        약관 변경 시 시행일 7일 전 사이트 공지. 중대 변경(수수료·서비스 범위)은 30일 전 공지 + 이용자 동의 절차.
      </p>

      <hr className="my-8" />
      <p className="text-xs text-gray-500">
        문의 / 노출 거부 / 정보 정정: <Link href="/listings" className="underline">매물 페이지에서 노출 거부 신청</Link> · 운영팀 카톡 채널 (예정) · 이메일: support@pilaos.app
      </p>
    </article>
  );
}
