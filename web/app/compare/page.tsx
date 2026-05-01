import Link from "next/link";
import { getListing } from "@/lib/listings";
import { fmtMan } from "@/lib/estimate";
import { BadgeStack } from "@/components/listing/BadgeStack";

type Props = { searchParams: Promise<{ ids?: string }> };

export default async function ComparePage({ searchParams }: Props) {
  const sp = await searchParams;
  const idList = (sp.ids ?? "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4);
  const rows = idList.map((id) => getListing(id)).filter((x): x is NonNullable<typeof x> => x !== null);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold">매물 비교</h1>
      <p className="mt-1 text-sm text-gray-600">매물 상세에서 "비교 추가"로 최대 4개까지 비교 가능합니다.</p>

      {rows.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">
          비교할 매물이 없습니다. <Link href="/listings" className="underline">매물 전체</Link>에서 추가해주세요.
        </div>
      ) : (
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
                {rows.map((l) => (
                  <th key={`${l.id}-b`} className="px-3 pb-2"><BadgeStack badges={l.badges} /></th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              <Row label="지역" cells={rows.map((l) => `${l.sigungu} ${l.dong ?? ""}`)} />
              <Row label="면적" cells={rows.map((l) => `${l.area_pyeong}평 (${l.area_m2}㎡)`)} />
              <Row label="층수" cells={rows.map((l) => l.floor ?? "—")} />
              <Row label="리포머" cells={rows.map((l) => `${l.reformer_count}대`)} />
              <Row label="권리금" cells={rows.map((l) => fmtMan(l.estimate.key_money.mid))} highlightHigh={false} />
              <Row label="월매출" cells={rows.map((l) => fmtMan(l.estimate.monthly_revenue.mid))} highlightHigh />
              <Row label="월순익" cells={rows.map((l) => fmtMan(l.estimate.monthly_profit.mid))} highlightHigh />
              <Row label="월수익률" cells={rows.map((l) => `${l.estimate.monthly_yield_pct}%`)} highlightHigh />
              <Row label="회수기간" cells={rows.map((l) => `${l.estimate.payback_months_keyMoney}개월`)} highlightHigh={false} />
              <Row label="총 인수가" cells={rows.map((l) => fmtMan(l.estimate.total_acquisition.mid))} highlightHigh={false} />
              <Row label="디지털 등급" cells={rows.map((l) => `${l.digital_grade} (${l.digital_score}점)`)} />
              <Row label="신뢰등급" cells={rows.map((l) => l.estimate.confidence)} />
              <Row label="매수자 대기" cells={rows.map((l) => `${l.buyer_intent_count}명`)} />
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Row({ label, cells, highlightHigh }: { label: string; cells: string[]; highlightHigh?: boolean }) {
  return (
    <tr>
      <td className="bg-gray-50 px-3 py-2 text-xs text-gray-500">{label}</td>
      {cells.map((c, i) => <td key={i} className="px-3 py-2 text-gray-900">{c}</td>)}
    </tr>
  );
}

export const metadata = { title: "매물 비교" };
