import Link from "next/link";
import { searchStudios, getStudioRanked } from "@/lib/db";
import { gradeColor, gradeFromRank } from "@/lib/score";

type Params = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Params) {
  const { q = "" } = await searchParams;
  const hits = q ? searchStudios(q, 100) : [];

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
        ← 홈으로
      </Link>

      <h1 className="mt-4 text-2xl font-bold">
        “{q}” 검색 결과 {hits.length}건
      </h1>

      {hits.length === 0 ? (
        <p className="mt-6 text-gray-500">결과가 없습니다. 다른 검색어로 시도해보세요.</p>
      ) : (
        <div className="mt-6 space-y-2">
          {hits.map((s) => {
            const ranked = getStudioRanked(s.kakao_place_id);
            const g = ranked
              ? gradeFromRank(ranked.national_rank, ranked.national_total)
              : "F";
            const score = ranked?.score ?? 0;
            return (
              <Link
                key={s.kakao_place_id}
                href={`/studio/${s.kakao_place_id}`}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 transition hover:border-gray-400"
              >
                <div>
                  <div className="font-semibold">{s.place_name}</div>
                  <div className="mt-0.5 text-xs text-gray-500">
                    {s.road_address_name || s.address_name}
                  </div>
                </div>
                <div className={`text-xl font-bold ${gradeColor(g)}`}>
                  {score} · {g}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
