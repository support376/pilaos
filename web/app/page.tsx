import Link from "next/link";
import { redirect } from "next/navigation";
import { allSigungu, searchStudios, summaryCounts, top3InSigungu } from "@/lib/db";
import { gradeColor, gradeFromRank } from "@/lib/score";

async function handleSearch(formData: FormData) {
  "use server";
  const q = String(formData.get("q") || "").trim();
  if (!q) return;
  const hits = searchStudios(q, 1);
  if (hits.length === 1) {
    redirect(`/studio/${hits[0].kakao_place_id}`);
  }
  redirect(`/search?q=${encodeURIComponent(q)}`);
}

export default function Home() {
  const { total_pilates, sido_counts } = summaryCounts();
  const sigunguList = allSigungu();
  const topSigungu = sigunguList.slice(0, 12);

  const featuredNames = ["강남구", "서초구", "송파구", "마포구", "성남시", "수원시"];
  const featured = featuredNames
    .map((name) => {
      const m = sigunguList.find((x) => x.sigungu === name);
      if (!m) return null;
      const top3 = top3InSigungu(m.sido, m.sigungu);
      return { sido: m.sido, sigungu: m.sigungu, total: m.count, top3 };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <section className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          전국 <span className="text-amber-500">{total_pilates.toLocaleString()}</span>개
          <br />
          필라테스 스튜디오
          <br />
          <span className="text-gray-500 text-3xl md:text-4xl">디지털 성적표</span>
        </h1>
        <p className="mt-4 text-gray-600">
          내 스튜디오 점수, 동네 등수, 경쟁사까지 — 30초면 다 보입니다.
        </p>

        <form action={handleSearch} className="mt-8 flex justify-center">
          <div className="flex w-full max-w-xl">
            <input
              name="q"
              type="text"
              required
              placeholder="상호나 주소를 입력하세요 (예: 필덱스 강남점)"
              className="flex-1 rounded-l-xl border border-gray-300 px-5 py-4 text-base shadow-sm focus:border-gray-900 focus:outline-none"
            />
            <button className="rounded-r-xl bg-gray-900 px-6 py-4 text-base font-semibold text-white hover:bg-gray-700">
              조회
            </button>
          </div>
        </form>
      </section>

      <section className="mb-14">
        <h2 className="mb-4 text-xl font-bold">🔥 주요 지역 TOP 3</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {featured.map((f) => (
            <Link
              key={`${f.sido}-${f.sigungu}`}
              href={`/area/${encodeURIComponent(f.sigungu)}`}
              className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-gray-400"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-bold">{f.sigungu}</h3>
                <div className="text-xs text-gray-500">{f.total}개 · 전체보기 →</div>
              </div>
              <ol className="mt-3 space-y-1">
                {f.top3.map((t, i) => {
                  const g = gradeFromRank(t.national_rank, t.national_total);
                  return (
                    <li
                      key={t.kakao_place_id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-4 text-right font-bold text-gray-400">
                          {i + 1}
                        </span>
                        <span>{t.place_name}</span>
                      </span>
                      <span className={`font-bold ${gradeColor(g)}`}>
                        {t.score} · {g}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-14">
        <h2 className="mb-4 text-xl font-bold">📍 전국 지역별 탐색</h2>
        <div className="flex flex-wrap gap-2">
          {topSigungu.map((s) => (
            <Link
              key={`${s.sido}-${s.sigungu}`}
              href={`/area/${encodeURIComponent(s.sigungu)}`}
              className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
            >
              {s.sigungu} <span className="text-gray-400">({s.count})</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">시도별 분포</h2>
        <div className="grid gap-2 sm:grid-cols-3 md:grid-cols-4">
          {sido_counts.map((s) => (
            <div
              key={s.sido}
              className="rounded-lg bg-gray-50 px-4 py-3 text-sm flex justify-between"
            >
              <span className="font-medium">{s.sido}</span>
              <span className="text-gray-500">{s.n.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export const metadata = {
  title: "전국 필라테스 디지털 성적표",
  description:
    "전국 1만개 필라테스 스튜디오의 네이버·카카오·인스타·블로그·홈페이지 등록 현황과 디지털 준비도 점수.",
};
