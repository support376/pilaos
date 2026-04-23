import Link from "next/link";
import { notFound } from "next/navigation";
import { allSigungu, rankedInSigungu } from "@/lib/db";
import { gradeColor, gradeFromRank } from "@/lib/score";

type Params = { params: Promise<{ slug: string }> };

function parseSlug(slug: string): { sido: string; sigungu: string } | null {
  const decoded = decodeURIComponent(slug);
  const all = allSigungu();
  const exact = all.find((x) => x.sigungu === decoded);
  if (exact) return { sido: exact.sido, sigungu: exact.sigungu };
  const pair = decoded.split("-");
  if (pair.length === 2) {
    const m = all.find((x) => x.sido === pair[0] && x.sigungu === pair[1]);
    if (m) return { sido: m.sido, sigungu: m.sigungu };
  }
  return null;
}

export default async function AreaPage({ params }: Params) {
  const { slug } = await params;
  const loc = parseSlug(slug);
  if (!loc) return notFound();

  const ranked = rankedInSigungu(loc.sido, loc.sigungu, 500);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
          ← 전국 탐색으로
        </Link>
      </div>

      <header className="mb-8">
        <h1 className="text-3xl font-bold">
          {loc.sido} {loc.sigungu} 필라테스 랭킹
        </h1>
        <p className="mt-2 text-gray-600">
          총 <strong>{ranked.length}</strong>개 스튜디오 · 디지털 준비도 점수 기준
        </p>
      </header>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left w-16">순위</th>
              <th className="px-4 py-3 text-left">상호</th>
              <th className="px-4 py-3 text-center w-16">등급</th>
              <th className="px-4 py-3 text-center w-16">점수</th>
              <th className="px-4 py-3 text-left hidden md:table-cell">보유 채널</th>
              <th className="px-4 py-3 text-right hidden md:table-cell">카카오</th>
              <th className="px-4 py-3 text-right hidden md:table-cell">블로그</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ranked.map((s) => {
              const g = gradeFromRank(s.national_rank, s.national_total);
              const channels = [
                s.naver_url && "네이버",
                s.kakao_channel_name && "카톡",
                s.homepage_url && "홈피",
                s.instagram_handle && "인스타",
                s.naver_blog_handle && "블로그",
              ].filter(Boolean);
              return (
                <tr key={s.kakao_place_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold text-gray-400">
                    {s.sigungu_rank}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/studio/${s.kakao_place_id}`}
                      className="font-medium text-gray-900 hover:underline"
                    >
                      {s.place_name}
                    </Link>
                    <div className="text-xs text-gray-500">
                      {s.road_address_name || s.address_name}
                    </div>
                  </td>
                  <td
                    className={`px-4 py-3 text-center text-2xl font-extrabold ${gradeColor(
                      g
                    )}`}
                  >
                    {g}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-700 font-semibold">
                    {s.score}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 hidden md:table-cell">
                    {channels.join(" · ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700 hidden md:table-cell">
                    {s.kakao_review_count ? (
                      <>
                        ★ {s.kakao_review_score?.toFixed(1) ?? "-"}
                        <span className="text-gray-400"> ({s.kakao_review_count})</span>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700 hidden md:table-cell">
                    {s.blog_review_count || "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const loc = parseSlug(slug);
  if (!loc) return {};
  return {
    title: `${loc.sigungu} 필라테스 랭킹 · 디지털 점수 기준`,
    description: `${loc.sido} ${loc.sigungu} 지역 필라테스 스튜디오 순위·네이버/카카오/인스타 등록 현황·리뷰수 전수 비교.`,
  };
}
