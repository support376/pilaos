import Link from "next/link";
import { listAllListings } from "@/lib/listings";
import { fmtMan } from "@/lib/estimate";

export default function AdminInbox() {
  // 매도 시그널 강도 상위 30개를 콜드 컨택 큐로 표시
  const all = listAllListings();
  const queue = [...all].sort((a, b) => b.estimate.sell_signal_score - a.estimate.sell_signal_score).slice(0, 30);
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold">운영팀 인박스 — 콜드 컨택 큐</h1>
      <p className="mt-1 text-sm text-gray-600">매도 시그널 강도 상위 30개. 운영팀이 카톡/통화로 의향 확인 → 인증 안내 → 매칭.</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>
              <th className="px-3 py-2 text-left">시그널</th>
              <th className="px-3 py-2 text-left">매물</th>
              <th className="px-3 py-2 text-left">지역</th>
              <th className="px-3 py-2 text-right">권리금 추정</th>
              <th className="px-3 py-2 text-right">디지털</th>
              <th className="px-3 py-2 text-left">상태</th>
              <th className="px-3 py-2 text-left">액션</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {queue.map((l) => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 font-bold text-rose-700">{l.estimate.sell_signal_score}</td>
                <td className="px-3 py-2">
                  <Link href={`/listings/${l.id}`} className="font-medium text-gray-900 hover:underline">{l.studio.place_name}</Link>
                  <div className="text-[11px] text-gray-400 font-mono">{l.id}</div>
                </td>
                <td className="px-3 py-2">{l.sigungu} {l.dong ?? ""}</td>
                <td className="px-3 py-2 text-right">{fmtMan(l.estimate.key_money.mid)}</td>
                <td className="px-3 py-2 text-right">{l.digital_grade} ({l.digital_score})</td>
                <td className="px-3 py-2 text-xs">{l.status}</td>
                <td className="px-3 py-2">
                  <Link href={`/sell/new?listing=${encodeURIComponent(l.id)}`} className="text-xs text-sky-700 underline">매도 등록 안내</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const metadata = { title: "운영팀 인박스", robots: { index: false } };
