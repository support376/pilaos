import Link from "next/link";

export const metadata = { title: "협업 전문가 · 자문진" };

const EXPERTS = [
  {
    name: "양홍수 변호사",
    role: "법률 자문 · 영업양수도 · 분쟁 조정",
    org: "법무 자문 (협업)",
    bio: "필라테스 양수도 표준 계약·실사 자문, 임대차 승계·회원 환급 분쟁, 권리금 산정 검토를 담당합니다. pilaos 거래 단계의 표준 양수도계약서 검토 및 변호사 동반 실사 자문 협업.",
    areas: ["영업양수도 계약", "권리금 분쟁", "임대차 승계", "회원 환급", "양도소득세"],
  },
];

export default function Experts() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-600">협업 전문가</p>
        <h1 className="mt-2 text-3xl font-bold">자문진 · 실사 파트너</h1>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          pilaos는 거래 단계에서 의뢰인이 변호사·세무사·인테리어·노무 전문가와 직접 위임 계약을 체결할 수 있도록 돕습니다.
          모든 자문은 의뢰인과 전문가 간 직접 위임 형태이며, pilaos는 자문료를 받지 않습니다 (변호사법 제109조 준수).
        </p>
      </div>

      <section className="space-y-4">
        {EXPERTS.map((e) => (
          <article key={e.name} className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{e.name}</h2>
                <p className="mt-1 text-sm text-gray-600">{e.role} · <span className="text-gray-500">{e.org}</span></p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">자문 협업</span>
            </div>
            <p className="mt-3 text-sm text-gray-700 leading-relaxed">{e.bio}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {e.areas.map((a) => (
                <span key={a} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">{a}</span>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-2xl bg-gray-50 p-6">
        <h2 className="text-lg font-bold">전문가 위임 구조</h2>
        <ol className="mt-3 list-decimal pl-5 text-sm text-gray-700 space-y-1.5 leading-relaxed">
          <li>거래 진행 단계에서 의뢰인이 본인 변호사·세무사를 선택하거나 협업 풀에서 추천 받습니다.</li>
          <li><strong>의뢰인과 전문가가 직접 위임 계약</strong>을 체결합니다. pilaos는 자문료를 중개·수수하지 않습니다.</li>
          <li>pilaos는 표준 영업양수도계약서·NDA·실사 체크리스트를 제공하고, 거래 일정·문서 vault·메시지 스레드를 운영 지원합니다.</li>
          <li>실사 패키지(시설·재무·회원 검증)는 pilaos가 운영하되 법률 자문 부분은 의뢰인 변호사가 별도 수행합니다.</li>
        </ol>
      </section>

      <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        <strong>전문가로 함께하고 싶으신 분.</strong> 부동산임대·영업양수도·세무·노무·인테리어 분야 협업을 모집합니다. 운영팀 카톡 채널 또는 <Link href="/terms" className="underline">이용약관</Link> 하단 연락처로 제안 부탁드립니다.
      </section>

      <div className="mt-8 text-center">
        <Link href="/listings" className="rounded-md bg-gray-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-gray-700">매물 둘러보기</Link>
      </div>
    </div>
  );
}
