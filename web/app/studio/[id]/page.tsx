import { notFound } from "next/navigation";
import Link from "next/link";
import {
  competitorsAboveMe,
  competitorsWithinRadius,
  countWithinRadius,
  getStudioRanked,
  sigunguStats,
  sigunguTop1Score,
} from "@/lib/db";
import { countWaitlist } from "@/lib/waitlist";
import {
  gradeColor,
  gradeFromRank,
  scoreStudio,
  topPercent,
} from "@/lib/score";
import { ScoreRing } from "@/components/ScoreRing";
import { Roadmap } from "@/components/Roadmap";
import { CategoryBars } from "@/components/CategoryBars";
import { CompetitorCard } from "@/components/CompetitorCard";
import { LossCard } from "@/components/LossCard";
import { LockedPreview } from "@/components/LockedPreview";
import { BigCTA } from "@/components/BigCTA";
import { StudioMap } from "@/components/StudioMap";

type Params = { params: Promise<{ id: string }> };

const GRADE_THRESHOLDS = [
  { grade: "A", topPct: 0.1, label: "상위 10%" },
  { grade: "B", topPct: 0.25, label: "상위 25%" },
  { grade: "C", topPct: 0.5, label: "상위 50%" },
  { grade: "D", topPct: 0.75, label: "상위 75%" },
] as const;

function nextGradeTarget(
  currentRank: number,
  currentTotal: number
): { grade: string; label: string; rank: number } | null {
  const topPct = currentRank / currentTotal;
  for (const t of GRADE_THRESHOLDS) {
    if (topPct > t.topPct) {
      return {
        grade: t.grade,
        label: t.label,
        rank: Math.ceil(t.topPct * currentTotal),
      };
    }
  }
  return null;
}

export default async function StudioPage({ params }: Params) {
  const { id } = await params;
  const studio = getStudioRanked(id);
  if (!studio) return notFound();

  const breakdown = scoreStudio(studio);
  const grade = gradeFromRank(studio.national_rank, studio.national_total);
  const natPct = topPercent(studio.national_rank, studio.national_total);
  const localPct =
    studio.sigungu_rank && studio.sigungu_total
      ? topPercent(studio.sigungu_rank, studio.sigungu_total)
      : null;

  const stats =
    studio.sido && studio.sigungu
      ? sigunguStats(studio.sido, studio.sigungu)
      : null;
  const topScore =
    studio.sido && studio.sigungu
      ? sigunguTop1Score(studio.sido, studio.sigungu)
      : 0;
  const above =
    studio.sido && studio.sigungu && studio.sigungu_rank
      ? competitorsAboveMe(studio.sido, studio.sigungu, studio.sigungu_rank, 3)
      : [];

  const RADIUS_M = 1000;
  const nearby = competitorsWithinRadius(
    studio.lng,
    studio.lat,
    RADIUS_M,
    studio.kakao_place_id,
    50
  );
  const nearbyCount = countWithinRadius(
    studio.lng,
    studio.lat,
    RADIUS_M,
    studio.kakao_place_id
  );
  const mapMarkers = [
    {
      id: studio.kakao_place_id,
      lng: studio.lng,
      lat: studio.lat,
      title: studio.place_name,
      score: studio.score,
      grade: grade as "A" | "B" | "C" | "D" | "F",
      isMe: true,
    },
    ...nearby.slice(0, 30).map((n) => ({
      id: n.kakao_place_id,
      lng: n.lng,
      lat: n.lat,
      title: n.place_name,
      score: n.score,
      grade: gradeFromRank(n.national_rank, n.national_total) as
        | "A"
        | "B"
        | "C"
        | "D"
        | "F",
    })),
  ];
  const jsKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

  const next = nextGradeTarget(studio.national_rank, studio.national_total);

  const categoryRows = stats
    ? [
        {
          label: "📍 플랫폼 등록 (네이버·카카오·카톡채널)",
          me: breakdown.platform.total,
          top: 35,
          avg: stats.platform_avg,
          max: 35,
        },
        {
          label: "🌐 디지털 자산 (홈페이지·인스타·블로그)",
          me: breakdown.digital.total,
          top: 30,
          avg: stats.digital_avg,
          max: 30,
        },
        {
          label: "⭐ 리뷰·콘텐츠 (카카오맵·블로그·메뉴)",
          me: breakdown.content.total,
          top: 25,
          avg: stats.content_avg,
          max: 25,
        },
      ]
    : [];

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
          ← 전국 탐색으로
        </Link>
      </div>

      {/* 1. SHOCK — Hero Score */}
      <header className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">{studio.place_name}</h1>
        <p className="mt-2 text-sm text-gray-600">
          {studio.road_address_name || studio.address_name}
        </p>
        {studio.phone ? (
          <p className="mt-1 text-sm text-gray-500">{studio.phone}</p>
        ) : null}
      </header>

      <section className="mb-10 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:gap-8">
          <ScoreRing score={studio.score} grade={grade} />

          <div className="flex-1 space-y-3">
            <div>
              <div className="text-xs font-semibold text-gray-500">전국 순위</div>
              <div className="text-3xl font-extrabold text-gray-900">
                {studio.national_rank.toLocaleString()}
                <span className="ml-1 text-lg text-gray-400 font-medium">
                  / {studio.national_total.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2.5">
                <div className="text-[10px] text-amber-700 font-semibold uppercase">
                  전국 상위
                </div>
                <div className="text-xl font-bold text-amber-900">{natPct}%</div>
              </div>
              {localPct !== null ? (
                <div className="flex-1 rounded-lg bg-sky-50 border border-sky-200 px-4 py-2.5">
                  <div className="text-[10px] text-sky-700 font-semibold uppercase">
                    {studio.sigungu} 상위
                  </div>
                  <div className="text-xl font-bold text-sky-900">
                    {localPct}%
                    <span className="ml-1 text-sm font-medium text-sky-700">
                      ({studio.sigungu_rank}/{studio.sigungu_total})
                    </span>
                  </div>
                </div>
              ) : null}
            </div>

            {next ? (
              <div className="rounded-lg bg-gray-900 px-4 py-3 text-white">
                <div className="text-xs text-gray-300">
                  {next.grade}급({next.label}) 진입까지
                </div>
                <div className="mt-0.5 text-sm">
                  <strong className="text-amber-400 text-lg">
                    +{studio.national_rank - next.rank}위
                  </strong>{" "}
                  올라가야 합니다. ↓ 로드맵에 방법 있음
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* 2. PATH — Roadmap */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">
          🗺️ {next ? `${next.grade}급으로 올라가는 길` : "관리 유지"}
        </h2>
        <p className="mb-5 text-sm text-gray-600">
          각 항목을 채울 때마다 점수와 순위가 즉시 오릅니다.
        </p>
        <Roadmap studio={studio} />
      </section>

      {/* 3. CONTRAST — Category Bars */}
      {stats ? (
        <section className="mb-12 rounded-2xl bg-gray-50 p-6">
          <h2 className="mb-5 text-2xl font-bold">
            📊 {studio.sigungu} 1위 · 평균과 비교
          </h2>
          <CategoryBars rows={categoryRows} />
          <div className="mt-5 rounded-lg bg-white border border-gray-200 p-4 text-sm text-gray-700">
            <strong className="text-gray-900">
              {studio.sigungu} 1위는 {topScore}점
            </strong>
            . 당신은 <strong>{studio.score}점</strong> — 격차{" "}
            <strong className="text-rose-600">-{topScore - studio.score}점</strong>.
          </div>
        </section>
      ) : null}

      {/* 4a. 전장 지도 — 반경 1km 경쟁사 */}
      <section className="mb-12">
        <h2 className="mb-1 text-2xl font-bold">
          🗺️ 반경 1km 안에 {nearbyCount}개 경쟁
        </h2>
        <p className="mb-5 text-sm text-gray-600">
          걸어서 15분 거리 · 당신이 놓치는 고객이 가는 곳
        </p>
        <StudioMap
          center={{ lng: studio.lng, lat: studio.lat }}
          markers={mapMarkers}
          radiusM={RADIUS_M}
          jsKey={jsKey}
          height={360}
        />
        {nearby.length > 0 ? (
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {nearby.slice(0, 6).map((n) => {
              const g = gradeFromRank(n.national_rank, n.national_total);
              const diff = n.score - studio.score;
              return (
                <Link
                  key={n.kakao_place_id}
                  href={`/studio/${n.kakao_place_id}`}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm transition hover:border-gray-400"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 truncate">
                      {n.place_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.round(n.dist_m)}m · {g}급
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className={`font-bold ${gradeColor(g)}`}>{n.score}</div>
                    {diff > 0 ? (
                      <div className="text-[10px] text-rose-600 font-semibold">
                        +{diff}점 앞섬
                      </div>
                    ) : diff < 0 ? (
                      <div className="text-[10px] text-emerald-600 font-semibold">
                        {diff}점 뒤짐
                      </div>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : null}
      </section>

      {/* 4b. ENVY — Competitors Above Me (sigungu) */}
      {above.length > 0 ? (
        <section className="mb-12">
          <h2 className="mb-1 text-2xl font-bold">
            👀 당신 바로 앞에 있는 {above.length}명
          </h2>
          <p className="mb-5 text-sm text-gray-600">
            {studio.sigungu} 순위 기준 · 뭘 하고 있어서 앞서있는지
          </p>
          <div className="space-y-3">
            {above.map((c) => (
              <CompetitorCard
                key={c.kakao_place_id}
                me={studio}
                competitor={c}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* 5. LOSS — What You're Missing */}
      {breakdown.missing.length > 0 ? (
        <section className="mb-12">
          <h2 className="mb-5 text-2xl font-bold">💸 지금 새고 있는 것</h2>
          <LossCard studio={studio} />
        </section>
      ) : null}

      {/* 6. TEASE — Locked Preview */}
      <section className="mb-12">
        <h2 className="mb-5 text-2xl font-bold">🔒 인증하면 공개되는 정보</h2>
        <LockedPreview
          items={[
            { title: "월별 지역 순위 추이", sub: "최근 30/90일 순위 변동 차트" },
            { title: "경쟁사 주간 점수 변화", sub: "누가 치고 올라오는지 실시간" },
            { title: "놓친 고객 구체 추정", sub: "이번 달 예상 유실 문의 건수" },
            { title: "AI 개선 액션 플랜", sub: "내 상황에 맞춘 30일 실행 가이드" },
          ]}
        />
      </section>

      {/* 7. CTA */}
      <BigCTA
        placeName={studio.place_name}
        studioId={studio.kakao_place_id}
        waitlistTotal={await countWaitlist()}
      />
    </main>
  );
}

export async function generateMetadata({ params }: Params) {
  const { id } = await params;
  const s = getStudioRanked(id);
  if (!s) return { title: "스튜디오를 찾을 수 없습니다" };
  const grade = gradeFromRank(s.national_rank, s.national_total);
  const pct = topPercent(s.national_rank, s.national_total);
  return {
    title: `${s.place_name} · ${grade}급 · ${s.score}점 · 상위 ${pct}%`,
    description: `${s.sigungu ?? ""} ${s.place_name} — 전국 ${s.national_rank.toLocaleString()}위 · 네이버·카카오·인스타·블로그·홈페이지 등록 현황과 경쟁사 비교.`,
  };
}
