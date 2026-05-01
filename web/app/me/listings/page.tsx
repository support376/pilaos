import Link from "next/link";

export default function MyListings() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">내 매물 · 진행상태</h1>
      <p className="mt-1 text-sm text-gray-600">매도 의향 등록 후 운영팀과의 진행 상태를 확인합니다.</p>

      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
        <p className="text-sm font-semibold text-amber-900">로그인 / 본인확인 후 활성화 (v3+)</p>
        <p className="mt-1 text-xs text-amber-800/85">현재는 운영팀이 등록된 휴대폰으로 직접 연락드리고 있습니다. 진행 상태가 궁금하시면 운영팀 카톡 채널 문의 부탁드립니다.</p>
      </div>

      <div className="mt-6">
        <h2 className="text-base font-bold mb-3">표준 진행 단계</h2>
        <ol className="space-y-2 text-sm">
          {[
            ["접수", "매도 의향 등록 즉시"],
            ["본인확인 통화", "24시간 내"],
            ["매물 정보 검토", "1~3일"],
            ["매수자 매칭", "조건 맞는 매수자 등록 시"],
            ["NDA 체결", "양측 동의 후"],
            ["실사 진행", "변호사 동반 (선택)"],
            ["가격 협상·계약", "협의"],
            ["잔금·인수인계", "표준 30일"],
          ].map(([label, when], i) => (
            <li key={label} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-500">{i + 1}</span>
                <span className="text-gray-900">{label}</span>
              </div>
              <span className="text-xs text-gray-500">{when}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export const metadata = { title: "내 매물", robots: { index: false } };
