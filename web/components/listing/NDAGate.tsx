import Link from "next/link";

export function NDAGate({ listingId, children }: { listingId: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
      <div className="mb-2 inline-block rounded-full bg-gray-900 px-3 py-1 text-xs font-bold text-white">
        🔒 NDA 후 공개
      </div>
      <p className="text-sm text-gray-700">
        {children ?? "임차계약, 매출장, 회원명단, 도면 등은 NDA 서명 후 매수자에게만 공개됩니다."}
      </p>
      <Link
        href={`/buy/intent?listing=${encodeURIComponent(listingId)}`}
        className="mt-4 inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-gray-700"
      >
        매수 의향 등록 → NDA 진행
      </Link>
    </div>
  );
}
