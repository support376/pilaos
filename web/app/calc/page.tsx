import Link from "next/link";
import { getListing } from "@/lib/listings";
import { fmtMan } from "@/lib/estimate";

type Props = { searchParams: Promise<{ listing?: string; key?: string; deposit?: string; rent?: string; rev?: string; profit?: string }> };

function n(s: string | undefined, d: number): number {
  if (!s) return d;
  const v = Number(s.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(v) ? v : d;
}

export default async function CalcPage({ searchParams }: Props) {
  const sp = await searchParams;
  const seedListing = sp.listing ? getListing(sp.listing) : null;
  const e = seedListing?.estimate;

  const key = n(sp.key, e?.key_money.mid ?? 5000);
  const deposit = n(sp.deposit, e?.deposit.mid ?? 5000);
  const rent = n(sp.rent, e?.monthly_rent.mid ?? 250);
  const rev = n(sp.rev, e?.monthly_revenue.mid ?? 2000);
  const profit = n(sp.profit, e?.monthly_profit.mid ?? 800);

  const setup = Math.round(key * 0.15);
  const total = key + deposit + setup;
  const yieldPct = total > 0 ? Math.round((profit / total) * 1000) / 10 : 0;
  const paybackKey = profit > 0 ? Math.round(key / profit) : 999;
  const paybackTotal = profit > 0 ? Math.round(total / profit) : 999;
  const annual = total > 0 ? Math.round((profit * 12) / total * 1000) / 10 : 0;
  const irr3y = total > 0 ? Math.round((((profit * 36) - total) / total) * 1000) / 10 : 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">수익률 계산기</h1>
      <p className="mt-1 text-sm text-gray-600">{seedListing ? `${seedListing.studio.place_name} 추정값으로 시작` : "값을 입력해 5대 지표 즉시 계산"}</p>

      <form method="get" className="mt-6 grid gap-4 rounded-xl border border-gray-200 bg-white p-6 sm:grid-cols-2">
        {seedListing ? <input type="hidden" name="listing" value={seedListing.id} /> : null}
        <Field label="권리금 (만원)" name="key" value={key} />
        <Field label="보증금 (만원)" name="deposit" value={deposit} />
        <Field label="월세 (만원)" name="rent" value={rent} />
        <Field label="월매출 (만원)" name="rev" value={rev} />
        <Field label="월순익 (만원)" name="profit" value={profit} />
        <div className="sm:col-span-2 flex justify-end">
          <button className="rounded-md bg-gray-900 px-5 py-2 text-sm font-bold text-white hover:bg-gray-700">계산</button>
        </div>
      </form>

      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Out label="총 인수가" v={fmtMan(total)} sub="권리금+보증금+준비비" />
        <Out label="월수익률" v={`${yieldPct}%`} sub={`연 ROI ${annual}%`} />
        <Out label="권리금 회수" v={`${paybackKey}개월`} sub={`총투자 ${paybackTotal}개월`} />
        <Out label="3년 누적 IRR" v={`${irr3y}%`} sub="단순 (월순익×36 − 총인수가) / 총인수가" />
        <Out label="준비비 추정" v={fmtMan(setup)} sub="권리금 × 15%" />
        <Out label="월 고정비" v={fmtMan(rent + 30)} sub="월세 + 관리비 30" />
      </section>

      {seedListing ? (
        <div className="mt-6">
          <Link href={`/listings/${seedListing.id}`} className="text-xs text-gray-500 underline">← 원 매물로 돌아가기</Link>
        </div>
      ) : null}
    </div>
  );
}

function Field({ label, name, value }: { label: string; name: string; value: number }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold text-gray-700">{label}</label>
      <input name={name} type="number" defaultValue={value} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" />
    </div>
  );
}
function Out({ label, v, sub }: { label: string; v: string; sub: string }) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 text-xl font-bold text-gray-900">{v}</div>
      <div className="text-[11px] text-gray-400">{sub}</div>
    </div>
  );
}

export const metadata = { title: "수익률 계산기" };
