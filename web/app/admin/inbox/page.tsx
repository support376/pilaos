import Link from "next/link";
import { listAllListings, summary } from "@/lib/listings";
import { fmtMan } from "@/lib/estimate";

function buildTemplate(l: ReturnType<typeof listAllListings>[number]): string {
  const place = l.studio.place_name;
  const sigungu = l.sigungu ?? "";
  const key = fmtMan(l.estimate.key_money.mid);
  const rev = fmtMan(l.estimate.monthly_revenue.mid);
  return `안녕하세요, ${place} 원장님.

pilaos는 전국 필라테스 영업양수도 매칭 플랫폼입니다.
${sigungu} 권역에서 ${place}와 비슷한 조건의 매물을 찾는 잠재 매수자 N분이 등록되어 계셔서 연락드립니다.

— 우리쪽 추정 권리금 ${key}, 월매출 ${rev} 수준
— 매도 의향이 있으시면 익명 노출 옵션으로 시장 반응만 가볍게 확인해드립니다
— 변호사 동반 실사·계약·회원 승계 표준 절차도 함께 제공

답장 부담 없으시고, 매물 정보 잘못된 부분이 있으면 그것만 정정해드려도 됩니다.
매물 페이지: https://pilaos.vercel.app/listings/${l.id}`;
}

export default function AdminInbox() {
  const all = listAllListings();
  const queue = [...all].sort((a, b) => b.estimate.sell_signal_score - a.estimate.sell_signal_score).slice(0, 50);
  const s = summary();

  // 통계
  const byTier = {
    p0: queue.filter((l) => l.estimate.sell_signal_score >= 80).length,
    p1: queue.filter((l) => l.estimate.sell_signal_score >= 60 && l.estimate.sell_signal_score < 80).length,
    p2: queue.filter((l) => l.estimate.sell_signal_score < 60).length,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold">운영팀 인박스 — 콜드 컨택 큐</h1>
      <p className="mt-1 text-sm text-gray-600">매도 시그널 강도 상위 50. 카톡/통화로 의향 확인 → 인증 안내 → 매칭.</p>

      <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-900">
        <strong>매수자/매도자 lead 알림</strong>: 신규 신청은 Discord/Slack webhook 또는 Supabase intent 테이블에 적재됩니다. (lib/intent.ts) 다음 분류로 들어와요:
        <ul className="mt-1.5 space-y-0.5 list-disc pl-5">
          <li><b>kind=buyer · mode=matched</b>: 특정 매물에 관심 표한 매수자 (매물 ID 첨부)</li>
          <li><b>kind=buyer · mode=open</b>: 조건만 등록한 매수자 (지역·예산·시기)</li>
          <li><b>kind=buyer · mode=favs</b>: ♥ 5개 이상 모은 매수자 (매물 ID 리스트 첨부)</li>
          <li><b>kind=seller</b>: 매도자 직접 등록 또는 매물 claim</li>
        </ul>
        <div className="mt-2">우선 처리 순서: <b>buyer/matched</b> &gt; <b>buyer/favs</b> &gt; <b>buyer/open</b> &gt; <b>seller</b> &gt; <b>콜드 컨택 큐 (아래)</b></div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        <Stat label="대기 매물" v={queue.length.toLocaleString()} />
        <Stat label="P0 (≥80)" v={byTier.p0.toString()} accent="rose" />
        <Stat label="P1 (60~79)" v={byTier.p1.toString()} accent="amber" />
        <Stat label="P2 (<60)" v={byTier.p2.toString()} accent="sky" />
      </div>

      <section className="mt-8">
        <h2 className="text-base font-bold mb-3">콜드 컨택 큐</h2>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="px-3 py-2 text-left">시그널</th>
                <th className="px-3 py-2 text-left">매물</th>
                <th className="px-3 py-2 text-left">지역</th>
                <th className="px-3 py-2 text-right">권리금</th>
                <th className="px-3 py-2 text-right">디지털</th>
                <th className="px-3 py-2 text-left">전화</th>
                <th className="px-3 py-2 text-left">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {queue.map((l) => {
                const sig = l.estimate.sell_signal_score;
                const tier = sig >= 80 ? "rose" : sig >= 60 ? "amber" : "sky";
                const phoneTel = l.studio.phone?.replace(/[^0-9]/g, "");
                const tplPreview = buildTemplate(l);
                const ktUrl = `https://accounts.kakao.com/login/?continue=https://pf.kakao.com/`; // placeholder
                return (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-bold ${tier === "rose" ? "bg-rose-100 text-rose-800" : tier === "amber" ? "bg-amber-100 text-amber-800" : "bg-sky-100 text-sky-800"}`}>{sig}</span>
                    </td>
                    <td className="px-3 py-2">
                      <Link href={`/listings/${l.id}`} className="font-medium text-gray-900 hover:underline">{l.studio.place_name}</Link>
                      <div className="text-[11px] font-mono text-gray-400">{l.id}</div>
                    </td>
                    <td className="px-3 py-2 text-xs">{l.sigungu} {l.dong ?? ""}</td>
                    <td className="px-3 py-2 text-right">{fmtMan(l.estimate.key_money.mid)}</td>
                    <td className="px-3 py-2 text-right text-xs">{l.digital_grade}({l.digital_score})</td>
                    <td className="px-3 py-2 text-xs">
                      {phoneTel ? <PhoneMasked phone={l.studio.phone!} tel={phoneTel} /> : "—"}
                    </td>
                    <td className="px-3 py-2">
                      <details>
                        <summary className="cursor-pointer text-xs text-amber-700 underline">템플릿</summary>
                        <pre className="mt-2 max-w-md whitespace-pre-wrap rounded-md bg-gray-50 p-2 text-[10px] text-gray-700">{tplPreview}</pre>
                      </details>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
        <strong>현재.</strong> 컨택 결과 (완료/거절/보류) 토글은 v3.0 (Supabase 영속화) 후 추가. 지금은 운영팀 노션 또는 스프레드시트로 관리.
      </div>
    </div>
  );
}

function Stat({ label, v, accent }: { label: string; v: string; accent?: "rose" | "amber" | "sky" }) {
  const cls = accent === "rose" ? "text-rose-700" : accent === "amber" ? "text-amber-700" : accent === "sky" ? "text-sky-700" : "text-gray-900";
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`mt-1 text-xl font-bold ${cls}`}>{v}</div>
    </div>
  );
}

export const metadata = { title: "운영팀 인박스", robots: { index: false } };

function PhoneMasked({ phone, tel }: { phone: string; tel: string }) {
  // 마지막 4자리 마스킹: 010-1234-5678 → 010-1234-****
  const masked = phone.replace(/(\d{2,4})$/, (m) => "*".repeat(m.length));
  return (
    <details className="inline">
      <summary className="cursor-pointer text-sky-700 underline list-none">
        {masked} <span className="text-gray-400 text-[10px]">[unlock]</span>
      </summary>
      <a href={`tel:${tel}`} className="ml-2 text-rose-700 underline text-[11px]">{phone} 통화</a>
    </details>
  );
}

