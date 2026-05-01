import Link from "next/link";
import { getListing, similarListings, searchListings } from "@/lib/listings";
import { Listing } from "@/lib/types";
import { fmtMan } from "@/lib/estimate";
import { BadgeStack } from "@/components/listing/BadgeStack";

type Props = { searchParams: Promise<{ ids?: string }> };

export default async function ComparePage({ searchParams }: Props) {
  const sp = await searchParams;
  const idList = (sp.ids ?? "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4);
  const rows = idList.map((id) => getListing(id)).filter((x): x is NonNullable<typeof x> => x !== null);

  // 추천: 첫 매물의 시군구·가격대에서 비슷한 3개
  const suggestions = rows.length > 0 ? similarListings(rows[0], 4).filter((x) => !idList.includes(x.id)).slice(0, 3) : searchListings({}, "yield_desc", 3).rows;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold">매물 비교</h1>
      <p className="mt-1 text-sm text-gray-600">최대 4개까지. 매물 상세에서 "비교 추가"로 누적.</p>

      {rows.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">
          비교할 매물이 없습니다. <Link href="/listings" className="underline">매물 전체</Link>에서 추가해주세요.
        </div>
      ) : (
        <>
          <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="min-w-[700px] w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500">
                <tr>
                  <th className="px-3 py-2 text-left">축</th>
                  {rows.map((l) => (
                    <th key={l.id} className="px-3 py-2 text-left">
                      <Link href={`/listings/${l.id}`} className="font-bold text-gray-900 hover:underline">{l.studio.place_name}</Link>
                    </th>
                  ))}
                </tr>
                <tr>
                  <th className="px-3 pb-2"></th>
                  {rows.map((l) => (<th key={`${l.id}-b`} className="px-3 pb-2"><BadgeStack badges={l.badges} /></th>))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                <Row label="지역" cells={rows.map((l) => `${l.sigungu ?? ""} ${l.dong ?? ""}`.trim())} />
                <Row label="권리금" cells={rows.map((l) => fmtMan(l.estimate.key_money.mid))} />
                <Row label="월매출" cells={rows.map((l) => fmtMan(l.estimate.monthly_revenue.mid))} />
                <Row label="월순익" cells={rows.map((l) => fmtMan(l.estimate.monthly_profit.mid))} />
                <Row label="월수익률" cells={rows.map((l) => `${l.estimate.monthly_yield_pct}%`)} />
                <Row label="회수기간(권리금)" cells={rows.map((l) => l.estimate.payback_months_keyMoney >= 999 ? "—" : `${l.estimate.payback_months_keyMoney}개월`)} />
                <Row label="총 인수가" cells={rows.map((l) => fmtMan(l.estimate.total_acquisition.mid))} />
                <Row label="디지털 등급" cells={rows.map((l) => `${l.digital_grade} (${l.digital_score})`)} />
                <Row label="채널 보유" cells={rows.map((l) => [l.studio.naver_url && "N", l.studio.kakao_channel_name && "K", l.studio.instagram_handle && "I", l.studio.naver_blog_handle && "B", l.studio.homepage_url && "H"].filter(Boolean).join(" ") || "—")} />
                <Row label="신뢰등급" cells={rows.map((l) => l.estimate.confidence)} />
              </tbody>
            </table>
          </div>

          {suggestions.length > 0 ? (
            <section className="mt-8">
              <h2 className="mb-3 text-base font-bold">비교에 추가할 만한 매물</h2>
              <div className="grid gap-2 md:grid-cols-3">
                {suggestions.map((sg) => {
                  const newIds = [...idList, sg.id].slice(0, 4).join(",");
                  return (
                    <Link key={sg.id} href={`/compare?ids=${encodeURIComponent(newIds)}`}
                      className="rounded-lg border border-gray-200 bg-white p-4 transition hover:border-emerald-400 hover:bg-emerald-50/50">
                      <div className="text-xs text-gray-400 font-mono">{sg.id}</div>
                      <div className="mt-1 font-bold text-gray-900 text-sm">{sg.studio.place_name}</div>
                      <div className="mt-0.5 text-xs text-gray-600">{sg.sigungu}</div>
                      <div className="mt-1 text-xs text-emerald-700">권리금 {fmtMan(sg.estimate.key_money.mid)} · 수익률 {sg.estimate.monthly_yield_pct}%</div>
                      <div className="mt-2 text-[11px] text-emerald-700 font-bold">+ 비교 추가 →</div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}

function Row({ label, cells }: { label: string; cells: string[]; highlight?: "hi" | "lo"; pick?: (l: Listing) => number }) {
  return (
    <tr>
      <td className="bg-gray-50 px-3 py-2 text-xs text-gray-500">{label}</td>
      {cells.map((c, i) => <td key={i} className="px-3 py-2 text-gray-900">{c}</td>)}
    </tr>
  );
}

export const metadata = { title: "매물 비교" };
