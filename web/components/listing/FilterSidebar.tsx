import Link from "next/link";
import { RegionSelect } from "./RegionSelect";

type RegionGroup = { sido: string; total: number; sigungu: { sigungu: string; count: number }[] };
type Props = {
  total: number;
  filtered: number;
  current: Record<string, string>;
  metros: RegionGroup[];
  dos: RegionGroup[];
};

const NumInput = ({ name, defaultValue, placeholder }: { name: string; defaultValue?: string; placeholder?: string }) => (
  <input
    type="number" name={name} defaultValue={defaultValue} placeholder={placeholder} inputMode="numeric"
    className="w-full rounded-md border border-black/15 px-3 py-2 text-[14px] focus:border-black focus:outline-none"
  />
);

export function FilterSidebar({ total, filtered, current, metros, dos }: Props) {
  return (
    <aside className="space-y-4">
      <div className="rounded-lg border border-black/10 bg-white px-4 py-3 text-sm">
        <div className="text-[11px] font-bold text-black/55 uppercase">검색 결과</div>
        <div className="mt-0.5 text-[18px] font-extrabold text-black">
          {filtered.toLocaleString()}<span className="ml-1 text-[12px] font-normal text-black/55">/ {total.toLocaleString()}</span>
        </div>
      </div>

      <form method="get" className="space-y-5 rounded-xl border border-black/10 bg-white p-4">
        {/* 키워드 */}
        <div>
          <label className="block text-[12px] font-bold text-black/75 mb-1.5">키워드</label>
          <input type="text" name="q" defaultValue={current.q ?? ""} placeholder="상호 · 동 · 주소"
            className="w-full rounded-md border border-black/15 px-3 py-2 text-[14px] focus:border-black focus:outline-none" />
        </div>

        {/* 지역 */}
        <div>
          <label className="block text-[12px] font-bold text-black/75 mb-1.5">지역</label>
          <RegionSelect metros={metros} dos={dos} defaultSido={current.sido ?? ""} defaultSigungu={current.sigungu ?? ""} size="sm" />
        </div>

        {/* 권리금 quick chips */}
        <div>
          <label className="block text-[12px] font-bold text-black/75 mb-1.5">권리금 (만원)</label>
          <div className="mb-2 flex flex-wrap gap-1">
            {[
              { label: "무권리", max: "500" },
              { label: "3천↓", max: "3000" },
              { label: "5천↓", max: "5000" },
              { label: "1억↓", max: "10000" },
              { label: "3억↓", max: "30000" },
            ].map((c) => {
              const active = current.key_max === c.max && !current.key_min;
              const params = new URLSearchParams();
              for (const [k, v] of Object.entries(current)) {
                if (k === "key_min" || k === "key_max" || !v) continue;
                params.set(k, v);
              }
              params.set("key_max", c.max);
              return (
                <Link key={c.max} href={`/listings?${params.toString()}`}
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${active ? "bg-black text-white" : "bg-black/5 text-black/75 hover:bg-black/10"}`}>
                  {c.label}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-1">
            <NumInput name="key_min" defaultValue={current.key_min} placeholder="최소" />
            <span className="text-[11px] text-black/40">~</span>
            <NumInput name="key_max" defaultValue={current.key_max} placeholder="최대" />
          </div>
        </div>

        {/* 총 인수가 */}
        <div>
          <label className="block text-[12px] font-bold text-black/75 mb-1.5">총 인수가 ≤ (만원)</label>
          <NumInput name="total_max" defaultValue={current.total_max} placeholder="예: 50000" />
        </div>

        {/* 수익률 */}
        <div>
          <label className="block text-[12px] font-bold text-black/75 mb-1.5">월수익률 ≥ (%)</label>
          <NumInput name="yield_min" defaultValue={current.yield_min} placeholder="예: 5" />
        </div>

        {/* 회수기간 */}
        <div>
          <label className="block text-[12px] font-bold text-black/75 mb-1.5">회수기간 ≤ (개월)</label>
          <NumInput name="payback_max" defaultValue={current.payback_max} placeholder="예: 12" />
        </div>

        {/* 무권리 토글 */}
        <label className="flex items-center gap-2 text-[13px] text-black/85 border-t border-black/10 pt-3">
          <input type="checkbox" name="no_key" defaultChecked={current.no_key === "1"} value="1" className="accent-black" />
          무권리 매물만 보기
        </label>

        {/* 디지털 채널 */}
        <div className="border-t border-black/10 pt-3">
          <div className="text-[12px] font-bold text-black/75 mb-2">디지털 채널</div>
          <div className="space-y-1.5 text-[13px] text-black/85">
            <Check name="has_naver" current={current.has_naver} label="네이버 플레이스" />
            <Check name="has_kchan" current={current.has_kchan} label="카카오톡 채널" />
            <Check name="has_insta" current={current.has_insta} label="인스타그램" />
            <Check name="has_blog" current={current.has_blog} label="네이버 블로그" />
            <Check name="has_rev" current={current.has_rev} label="리뷰 보유" />
          </div>
        </div>

        {current.sort ? <input type="hidden" name="sort" value={current.sort} /> : null}

        <div className="flex gap-2 pt-2">
          <button type="submit" className="flex-1 rounded-md bg-black px-4 py-2.5 text-[13px] font-bold text-white hover:bg-black/85">
            필터 적용
          </button>
          <Link href="/listings" className="rounded-md border border-black/15 px-3 py-2.5 text-center text-[13px] font-bold text-black/65 hover:bg-black/5">
            초기화
          </Link>
        </div>
      </form>
    </aside>
  );
}

function Check({ name, current, label }: { name: string; current: string | undefined; label: string }) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" name={name} defaultChecked={current === "1"} value="1" className="accent-black" />
      {label}
    </label>
  );
}
