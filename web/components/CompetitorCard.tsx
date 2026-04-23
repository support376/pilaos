import Link from "next/link";
import { StudioRanked } from "@/lib/db";
import { gradeColor, gradeFromRank } from "@/lib/score";

type Props = {
  me: StudioRanked;
  competitor: StudioRanked;
};

const CHANNELS: {
  key: keyof StudioRanked;
  label: string;
  check: (s: StudioRanked) => boolean;
}[] = [
  { key: "naver_url", label: "네이버", check: (s) => !!s.naver_url },
  { key: "kakao_channel_name", label: "카톡채널", check: (s) => !!s.kakao_channel_name },
  { key: "homepage_url", label: "홈페이지", check: (s) => !!s.homepage_url },
  { key: "instagram_handle", label: "인스타", check: (s) => !!s.instagram_handle },
  { key: "naver_blog_handle", label: "블로그", check: (s) => !!s.naver_blog_handle },
  { key: "menu_count", label: "메뉴등록", check: (s) => (s.menu_count ?? 0) > 0 },
];

export function CompetitorCard({ me, competitor }: Props) {
  const grade = gradeFromRank(competitor.national_rank, competitor.national_total);
  const diff = competitor.score - me.score;

  const theyHave = CHANNELS.filter((c) => c.check(competitor) && !c.check(me));
  const bothHave = CHANNELS.filter((c) => c.check(competitor) && c.check(me));

  return (
    <Link
      href={`/studio/${competitor.kakao_place_id}`}
      className="block rounded-xl border border-gray-200 bg-white p-5 transition hover:border-gray-400"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400">
              {competitor.sigungu} {competitor.sigungu_rank}위
            </span>
            <span className={`text-xs font-bold ${gradeColor(grade)}`}>{grade}급</span>
          </div>
          <div className="mt-1 font-bold text-gray-900 truncate">
            {competitor.place_name}
          </div>
          <div className="mt-0.5 text-xs text-gray-500 truncate">
            {competitor.road_address_name || competitor.address_name}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className={`text-2xl font-extrabold ${gradeColor(grade)}`}>
            {competitor.score}
          </div>
          <div className="text-xs text-rose-600 font-semibold">
            +{diff}점 앞섬
          </div>
        </div>
      </div>

      {theyHave.length > 0 ? (
        <div className="mt-4 rounded-lg bg-rose-50 border border-rose-200 p-3">
          <div className="text-xs font-semibold text-rose-800 mb-1.5">
            이 업체가 하고 있지만 당신이 안 하고 있는 것
          </div>
          <div className="flex flex-wrap gap-1.5">
            {theyHave.map((c) => (
              <span
                key={c.label}
                className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-rose-700 ring-1 ring-rose-200"
              >
                {c.label}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {(competitor.kakao_review_count ?? 0) > (me.kakao_review_count ?? 0) ||
      (competitor.blog_review_count ?? 0) > (me.blog_review_count ?? 0) ? (
        <div className="mt-2 flex gap-3 text-xs text-gray-600">
          {(competitor.kakao_review_count ?? 0) > 0 ? (
            <span>
              카카오맵 ★ {competitor.kakao_review_score?.toFixed(1) ?? "-"}{" "}
              <strong className="text-gray-900">({competitor.kakao_review_count})</strong>
            </span>
          ) : null}
          {(competitor.blog_review_count ?? 0) > 0 ? (
            <span>
              블로그 리뷰{" "}
              <strong className="text-gray-900">{competitor.blog_review_count}</strong>
            </span>
          ) : null}
        </div>
      ) : null}
    </Link>
  );
}
