export const metadata = { title: "개인정보 처리방침" };

export default function Privacy() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">pilaos 개인정보 처리방침</h1>
      <p className="text-xs text-gray-500 mt-1">시행일: 2026-05-02 · v1.0</p>

      <h2 className="mt-8 text-lg font-bold">1. 수집하는 개인정보 항목 및 근거</h2>
      <table className="mt-3 w-full text-sm border border-gray-200">
        <thead className="bg-gray-50 text-xs">
          <tr><th className="px-3 py-2 text-left">구분</th><th className="px-3 py-2 text-left">항목</th><th className="px-3 py-2 text-left">근거</th></tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-xs">
          <tr><td className="px-3 py-2">매장 공개 정보</td><td className="px-3 py-2">상호, 주소, 좌표, 전화번호, 디지털 채널 URL, 리뷰수</td><td className="px-3 py-2">개인정보보호법 제15조 1항 6호 (공개된 정보)</td></tr>
          <tr><td className="px-3 py-2">매도자 등록</td><td className="px-3 py-2">대표자 이름, 휴대폰, 사업자번호, 매도 사유, 희망가</td><td className="px-3 py-2">정보주체 동의 (등록 폼)</td></tr>
          <tr><td className="px-3 py-2">매수자 등록</td><td className="px-3 py-2">이름, 휴대폰, 관심 지역, 예산, 경험</td><td className="px-3 py-2">정보주체 동의 (등록 폼)</td></tr>
          <tr><td className="px-3 py-2">자동 수집</td><td className="px-3 py-2">접속 IP, User-Agent, 쿠키(찜 매물)</td><td className="px-3 py-2">서비스 운영상 필요 (제15조 1항 4호)</td></tr>
        </tbody>
      </table>

      <h2 className="mt-6 text-lg font-bold">2. 이용 목적</h2>
      <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 leading-relaxed space-y-1.5">
        <li>매물 디렉토리 노출 및 검색·필터 제공</li>
        <li>매수·매도 의향 매칭 및 운영팀의 컨택 대행 (잠재 매수자가 있을 때 매도자에게 정보 제공)</li>
        <li>거래 진행 시 본인확인·NDA·계약</li>
        <li>이용자 문의 응대 및 분쟁 해결</li>
        <li>서비스 개선을 위한 통계 분석 (개인 비식별)</li>
      </ul>

      <h2 className="mt-6 text-lg font-bold">3. 보관 기간</h2>
      <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 leading-relaxed space-y-1.5">
        <li>매장 공개 정보: 서비스 운영 기간 (정보주체 삭제 요청 시 즉시)</li>
        <li>매도/매수 의향 등록 정보: 등록 후 3년 (전자상거래법)</li>
        <li>거래 완료 정보: 5년 (전자상거래법, 세무 목적)</li>
        <li>접속 로그: 3개월</li>
      </ul>

      <h2 className="mt-6 text-lg font-bold">4. 제3자 제공</h2>
      <p className="mt-2 text-sm text-gray-700 leading-relaxed">
        다음 경우를 제외하고 개인정보를 제3자에게 제공하지 않습니다.
      </p>
      <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 leading-relaxed space-y-1.5">
        <li>매수↔매도 매칭 시 — 양측 NDA 체결 후 제한된 진성정보만 상호 공개</li>
        <li>실사 의뢰 시 — 의뢰인이 위임한 변호사·회계사에게 의뢰인 동의 범위 내 자료 공유</li>
        <li>법적 의무 (수사기관 요청 등) 발생 시</li>
      </ul>

      <h2 className="mt-6 text-lg font-bold">5. 처리 위탁</h2>
      <table className="mt-3 w-full text-sm border border-gray-200">
        <thead className="bg-gray-50 text-xs">
          <tr><th className="px-3 py-2 text-left">수탁업체</th><th className="px-3 py-2 text-left">위탁 업무</th></tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-xs">
          <tr><td className="px-3 py-2">Vercel Inc. (미국)</td><td className="px-3 py-2">웹사이트 호스팅·CDN</td></tr>
          <tr><td className="px-3 py-2">Supabase Inc. (싱가포르 리전 예정)</td><td className="px-3 py-2">의향·매물 데이터 저장 (v3.1+)</td></tr>
        </tbody>
      </table>
      <p className="mt-2 text-xs text-gray-500">국외 이전 시 정보주체 동의 절차 별도 진행.</p>

      <h2 className="mt-6 text-lg font-bold">6. 정보주체의 권리</h2>
      <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 leading-relaxed space-y-1.5">
        <li><strong>열람·정정·삭제</strong> — 매물 페이지의 "노출 거부 신청" 또는 이메일 요청 (24시간 처리)</li>
        <li><strong>처리 정지</strong> — 동의 철회 시 즉시 처리 정지</li>
        <li><strong>이의 제기</strong> — 개인정보보호위원회 (privacy.go.kr) 또는 한국인터넷진흥원 (privacy.kisa.or.kr) 신고 가능</li>
      </ul>

      <h2 className="mt-6 text-lg font-bold">7. 안전성 확보 조치</h2>
      <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 leading-relaxed space-y-1.5">
        <li>전송 구간 HTTPS/TLS 암호화</li>
        <li>전화번호는 외부 페이지에서 마스킹 노출, 운영팀 인박스에서도 마지막 4자리 ****</li>
        <li>접근 권한 분리 — 운영자만 raw 정보 열람</li>
        <li>접근 로그 기록 (감사 목적)</li>
      </ul>

      <h2 className="mt-6 text-lg font-bold">8. 개인정보 보호 책임자</h2>
      <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 leading-relaxed space-y-1.5">
        <li>이름 / 직책: pilaos 운영팀 (예정)</li>
        <li>연락처: support@pilaos.app</li>
        <li>접수 시간: 평일 10–18시 / 처리 SLA 24시간</li>
      </ul>

      <hr className="my-8" />
      <p className="text-xs text-gray-500">본 처리방침은 법령·서비스 변경에 따라 개정될 수 있으며, 변경 시 시행일 7일 전 공지합니다.</p>
    </article>
  );
}
