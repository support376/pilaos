import Link from "next/link";

export function NDAGate({ listingId, children }: { listingId: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-black/15 bg-black/[.03] p-6 text-center">
      <div className="mb-2 inline-block rounded-full bg-black px-3 py-1 text-xs font-bold text-white">
        🔒 NDA 후 공개
      </div>
      <p className="text-sm text-black/75">
        {children ?? "임차계약, 매출장, 회원명단, 도면 등은 NDA 서명 후 매수자에게만 공개됩니다."}
      </p>
      <Link
        href={`/buy/intent?listing=${encodeURIComponent(listingId)}`}
        className="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-sm font-bold text-white hover:bg-black/75"
      >
        매수 의향 등록 → NDA 진행
      </Link>
    </div>
  );
}
