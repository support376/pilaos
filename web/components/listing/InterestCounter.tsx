import { headers } from "next/headers";

async function fetchCount(listingId: string): Promise<number> {
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
    const proto = h.get("x-forwarded-proto") ?? "http";
    if (!host) return 0;
    const r = await fetch(`${proto}://${host}/api/listings/${listingId}/fav`, {
      cache: "no-store",
    });
    if (!r.ok) return 0;
    const j = await r.json();
    return j.count ?? 0;
  } catch { return 0; }
}

export async function InterestCounter({ listingId }: { listingId: string }) {
  const n = await fetchCount(listingId);
  if (n === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-black/[.03] px-2 py-1 text-[11px] text-black/65">
        ♡ 첫 관심을 표시하세요
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-[11px] font-bold text-red-700">
      ♥ {n}명이 관심 표시
    </span>
  );
}
