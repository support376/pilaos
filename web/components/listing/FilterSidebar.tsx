import Link from "next/link";

type Props = {
  total: number;
  filtered: number;
  current: Record<string, string>;
  topSigungu: { sigungu: string; count: number }[];
};

const NumberInput = ({ name, defaultValue, placeholder }: { name: string; defaultValue?: string; placeholder?: string }) => (
  <input
    type="number"
    name={name}
    defaultValue={defaultValue}
    placeholder={placeholder}
    className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-gray-900 focus:outline-none"
  />
);

export function FilterSidebar({ total, filtered, current, topSigungu }: Props) {
  const sigungu = current.sigungu ?? "";
  return (
    <aside className="space-y-4">
      <div className="rounded-lg bg-amber-50 px-4 py-3 text-xs text-amber-900">
        총 <strong>{total.toLocaleString()}</strong>개 매물 中 <strong>{filtered.toLocaleString()}</strong>개 필터링
      </div>

      <form method="get" className="space-y-4 rounded-xl border border-gray-200 bg-white p-4">
        {/* 검색 */}
        <div>
          <label className="mb-1 block text-xs font-bold text-gray-700">검색</label>
          <input
            type="text"
            name="q"
            defaultValue={current.q ?? ""}
            placeholder="상호·동·주소"
            className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-gray-900 focus:outline-none"
          />
        </div>

        {/* 지역 */}
        <div>
          <label className="mb-1 block text-xs font-bold text-gray-700">지역 (시군구)</label>
          <select name="sigungu" defaultValue={sigungu} className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm">
            <option value="">전체</option>
            {topSigungu.map((s) => (
              <option key={s.sigungu} value={s.sigungu}>{s.sigungu} ({s.count})</option>
            ))}
          </select>
        </div>

        {/* 권리금 */}
        <div>
          <label className="mb-1 block text-xs font-bold text-gray-700">권리금 (만원)</label>
          <div className="flex items-center gap-1">
            <NumberInput name="key_min" defaultValue={current.key_min} placeholder="최소" />
            <span className="text-xs text-gray-400">~</span>
            <NumberInput name="key_max" defaultValue={current.key_max} placeholder="최대" />
          </div>
        </div>

        {/* 총 인수가 */}
        <div>
          <label className="mb-1 block text-xs font-bold text-gray-700">총 인수가 ≤ (만원)</label>
          <NumberInput name="total_max" defaultValue={current.total_max} placeholder="예 50000" />
        </div>

        {/* 월수익률 */}
        <div>
          <label className="mb-1 block text-xs font-bold text-gray-700">월수익률 ≥ (%)</label>
          <NumberInput name="yield_min" defaultValue={current.yield_min} placeholder="예 5" />
        </div>

        {/* 회수기간 */}
        <div>
          <label className="mb-1 block text-xs font-bold text-gray-700">권리금 회수기간 ≤ (개월)</label>
          <NumberInput name="payback_max" defaultValue={current.payback_max} placeholder="예 12" />
        </div>

        {/* 면적 */}
        <div>
          <label className="mb-1 block text-xs font-bold text-gray-700">면적 (평)</label>
          <div className="flex items-center gap-1">
            <NumberInput name="area_min" defaultValue={current.area_min} placeholder="최소" />
            <span className="text-xs text-gray-400">~</span>
            <NumberInput name="area_max" defaultValue={current.area_max} placeholder="최대" />
          </div>
        </div>

        {/* 리포머 */}
        <div>
          <label className="mb-1 block text-xs font-bold text-gray-700">리포머 ≥ (대)</label>
          <NumberInput name="reformer_min" defaultValue={current.reformer_min} placeholder="예 6" />
        </div>

        {/* 시설 */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-700">시설</label>
          <label className="flex items-center gap-2 text-xs text-gray-700">
            <input type="checkbox" name="parking" defaultChecked={current.parking === "1"} value="1" /> 주차 가능
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-700">
            <input type="checkbox" name="shower" defaultChecked={current.shower === "1"} value="1" /> 샤워실
          </label>
        </div>

        {/* 거래구분 */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-700">거래구분</label>
          <label className="flex items-center gap-2 text-xs text-gray-700">
            <input type="checkbox" name="owner_direct" defaultChecked={current.owner_direct === "1"} value="1" /> 직거래만
          </label>
        </div>

        {/* 정렬 보존 */}
        {current.sort ? <input type="hidden" name="sort" value={current.sort} /> : null}

        <div className="flex gap-2">
          <button type="submit" className="flex-1 rounded-md bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-gray-700">
            필터 적용
          </button>
          <Link href="/listings" className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-center text-sm text-gray-700 hover:bg-gray-50">
            초기화
          </Link>
        </div>
      </form>
    </aside>
  );
}
