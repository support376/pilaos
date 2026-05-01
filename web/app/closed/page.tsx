import { listAllListings } from "@/lib/listings";
import { fmtMan } from "@/lib/estimate";

// 시드 — hash로 일부를 "closed"로 간주하고 거래 결과 mock 생성
function mockClosedRecords() {
  const all = listAllListings();
  const records: Array<{ region: string; pyeong: number; key: number; days: number; rating: number; review: string; }> = [];
  const reviews = [
    "변호사 동반 실사가 결정적이었음",
    "회원 승계 동의서 자동화로 빨랐음",
    "3주 만에 클로징, 매수자 자금증빙 미리 받아둔 게 큰 도움",
    "임대인 협조 미리 확인한 게 결정타",
    "권리금 협상 한 번에 합의",
    "잔금 에스크로로 안전하게",
  ];
  for (let i = 0; i < 30; i++) {
    const l = all[(i * 137) % all.length];
    if (!l) continue;
    const seed = ((i + 1) * 9301 + 49297) % 233280;
    const days = 14 + (seed % 60);
    const rating = 3.6 + ((seed % 14) / 10);
    const final = Math.round(l.estimate.key_money.mid * (0.85 + ((seed % 30) / 100)));
    records.push({
      region: `${l.sido} ${l.sigungu}`,
      pyeong: l.area_pyeong ?? 60,
      key: final,
      days,
      rating: Math.round(rating * 10) / 10,
      review: reviews[i % reviews.length],
    });
  }
  return records;
}

export default function Closed() {
  const recs = mockClosedRecords();
  const avgKey = Math.round(recs.reduce((a, r) => a + r.key, 0) / recs.length);
  const avgDays = Math.round(recs.reduce((a, r) => a + r.days, 0) / recs.length);
  const avgRating = Math.round(recs.reduce((a, r) => a + r.rating, 0) / recs.length * 10) / 10;
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold">실거래가 · 거래 후기</h1>
      <p className="mt-1 text-sm text-gray-600">거래완료된 매물의 익명 카드. 베타 데모 데이터입니다.</p>

      <section className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-gray-50 p-4"><div className="text-xs text-gray-500">평균 권리금</div><div className="mt-1 text-xl font-bold">{fmtMan(avgKey)}</div></div>
        <div className="rounded-lg bg-gray-50 p-4"><div className="text-xs text-gray-500">평균 거래 일수</div><div className="mt-1 text-xl font-bold">{avgDays}일</div></div>
        <div className="rounded-lg bg-gray-50 p-4"><div className="text-xs text-gray-500">평균 만족도</div><div className="mt-1 text-xl font-bold">★ {avgRating}</div></div>
      </section>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>
              <th className="px-3 py-2 text-left">지역</th>
              <th className="px-3 py-2 text-right">면적</th>
              <th className="px-3 py-2 text-right">권리금</th>
              <th className="px-3 py-2 text-right">거래기간</th>
              <th className="px-3 py-2 text-center">만족도</th>
              <th className="px-3 py-2 text-left">후기</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recs.map((r, i) => (
              <tr key={i}>
                <td className="px-3 py-2">{r.region}</td>
                <td className="px-3 py-2 text-right">{r.pyeong}평</td>
                <td className="px-3 py-2 text-right font-bold">{fmtMan(r.key)}</td>
                <td className="px-3 py-2 text-right">{r.days}일</td>
                <td className="px-3 py-2 text-center">★ {r.rating}</td>
                <td className="px-3 py-2 text-gray-600">{r.review}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const metadata = { title: "실거래가 · 거래 후기" };
