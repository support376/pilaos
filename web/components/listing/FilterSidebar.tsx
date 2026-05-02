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
  return (
    <aside className="space-y-4">
      <div className="rounded-lg bg-amber-50 px-4 py-3 text-xs text-amber-900">
        총 <strong>{total.toLocaleString()}</strong>개 잠재매물 中 <strong>{filtered.toLocaleString()}</strong>개 필터링
      </div>

      <form method="get" className="space-y-4 rounded-xl border border-gray-200 bg-white p-4">
        <div>
          <label className="mb-1 block text-xs font-bold text-gray-700">검색</label>
          <input type="text" name="q" defaultValue={current.q ?? ""} placeholder="상호 · 동 · 주소" className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-gray-900 focus:outline-none" />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold text-gray-700">지역 (시군구)</label>
          <select name="sigungu" defaultValue={current.sigungu ?? ""} className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm">
            <option value="">전체</option>
            {topSigungu.map((s) => (
              <option key={s.sigungu} value={s.sigungu}>{s.sigungu} ({s.count})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold text-gray-700">권리금 추정 (만원)</label>
          <div className="flex items-center gap-1">
            <NumberInput name="key_min" defaultValue={current.key_min} placeholder="최소" />
            <span className="text-xs text-gray-400">~</span>
            <NumberInput name="key_max" defaultValue={current.key_max} placeholder="최대" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold text-gray-700">총 인수가 추정 ≤ (만원)</label>
          <NumberInput name="total_max" defaultValue={current.total_max} placeholder="예 50000" />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold text-gray-700">월수익률 ≥ (%)</label>
          <NumberInput name="yield_min" defaultValue={current.yield_min} placeholder="예 5" />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold text-gray-700">권리금 회수기간 ≤ (개월)</label>
          <NumberInput name="payback_max" defaultValue={current.payback_max} placeholder="예 12" />
        </div>

        <div className="space-y-1.5 border-t border-gray-100 pt-3">
          <label className="flex items-center gap-2 text-xs font-bold text-gray-700">
            <input type="checkbox" name="no_key" defaultChecked={current.no_key === "1"} value="1" /> 무권리 매물만 (권리금 ≤ 500만)
          </label>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-700">디지털 채널 보유</label>
          <label className="flex items-center gap-2 text-xs text-gray-700">
            <input type="checkbox" name="has_naver" defaultChecked={current.has_naver === "1"} value="1" /> 네이버 플레이스
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-700">
            <input type="checkbox" name="has_kchan" defaultChecked={current.has_kchan === "1"} value="1" /> 카카오톡 채널
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-700">
            <input type="checkbox" name="has_insta" defaultChecked={current.has_insta === "1"} value="1" /> 인스타그램
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-700">
            <input type="checkbox" name="has_blog" defaultChecked={current.has_blog === "1"} value="1" /> 네이버 블로그
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-700">
            <input type="checkbox" name="has_hp" defaultChecked={current.has_hp === "1"} value="1" /> 홈페이지
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-700">
            <input type="checkbox" name="has_rev" defaultChecked={current.has_rev === "1"} value="1" /> 카카오 리뷰 보유
          </label>
        </div>

        {current.sort ? <input type="hidden" name="sort" value={current.sort} /> : null}

        <div className="flex gap-2">
          <button type="submit" className="flex-1 rounded-md bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-gray-700">필터 적용</button>
          <Link href="/listings" className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-center text-sm text-gray-700 hover:bg-gray-50">초기화</Link>
        </div>
      </form>

      <div className="rounded-lg border border-gray-200 bg-white p-4 text-xs text-gray-600">
        <p className="font-semibold text-gray-900 mb-1">왜 시설 필터(평수·리포머·주차)가 없죠?</p>
        <p>모든 매물이 잠재매물(주인 미등록)이라 시설·면적은 진짜 데이터로 검증되지 않았습니다. 임의 추정치 노출보다 빈 값을 두는 게 신뢰에 맞아 v2.1에서 제거했습니다.</p>
        <p className="mt-1.5 text-gray-500">v2.2: 카카오 panel3 amenity 수집 후 복귀 예정.</p>
      </div>
    </aside>
  );
}
