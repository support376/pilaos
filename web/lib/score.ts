import { ScoreBreakdown, Studio } from "./types";

function reviewTier(n: number | null, thresholds = [1, 5, 20]): number {
  const v = n ?? 0;
  if (v >= thresholds[2]) return 10;
  if (v >= thresholds[1]) return 6;
  if (v >= thresholds[0]) return 3;
  return 0;
}

export function scoreStudio(s: Studio): ScoreBreakdown {
  const naver = s.naver_url ? 15 : 0;
  const kakao = 10; // Kakao에 수집된 것 기본
  const kchan = s.kakao_channel_name ? 10 : 0;

  const hp = s.homepage_url ? 10 : 0;
  const insta = s.instagram_handle ? 15 : 0;
  const blog = s.naver_blog_handle ? 5 : 0;

  const kReview = reviewTier(s.kakao_review_count);
  const bReview = reviewTier(s.blog_review_count);
  const menu = (s.menu_count ?? 0) > 0 ? 5 : 0;

  const platformTotal = naver + kakao + kchan;
  const digitalTotal = hp + insta + blog;
  const contentTotal = kReview + bReview + menu;
  const total = platformTotal + digitalTotal + contentTotal;

  const grade: ScoreBreakdown["grade"] =
    total >= 90 ? "A" : total >= 75 ? "B" : total >= 60 ? "C" : total >= 40 ? "D" : "F";

  const missing: string[] = [];
  const strong: string[] = [];

  if (!s.naver_url) missing.push("네이버 플레이스 미등록");
  else strong.push("네이버 플레이스 등록됨");
  if (!s.kakao_channel_name) missing.push("카카오톡 채널 없음");
  else strong.push("카카오톡 채널 운영 중");
  if (!s.homepage_url) missing.push("홈페이지 없음");
  else strong.push("홈페이지 운영");
  if (!s.instagram_handle) missing.push("인스타그램 계정 없음");
  else strong.push("인스타그램 연동");
  if (!s.naver_blog_handle) missing.push("네이버 블로그 없음");
  if ((s.kakao_review_count ?? 0) === 0) missing.push("카카오맵 리뷰 0개");
  else if ((s.kakao_review_count ?? 0) >= 20) strong.push(`카카오맵 리뷰 ${s.kakao_review_count}개`);
  if ((s.blog_review_count ?? 0) === 0) missing.push("블로그 체험단 리뷰 0개");
  else if ((s.blog_review_count ?? 0) >= 20) strong.push(`블로그 리뷰 ${s.blog_review_count}개`);
  if ((s.menu_count ?? 0) === 0) missing.push("메뉴/가격 미등록");
  else strong.push("메뉴/가격 등록됨");

  return {
    total,
    grade,
    platform: { naver, kakao, kakao_channel: kchan, total: platformTotal },
    digital: { homepage: hp, instagram: insta, naver_blog: blog, total: digitalTotal },
    content: { kakao_review: kReview, blog_review: bReview, menu, total: contentTotal },
    missing,
    strong,
  };
}

export function rankInSigungu(
  target: Studio,
  peers: Studio[]
): { rank: number; total: number; top3: { studio: Studio; score: number }[] } {
  const withScores = peers.map((s) => ({
    studio: s,
    score: scoreStudio(s).total,
    reviewSum: (s.kakao_review_count ?? 0) + (s.blog_review_count ?? 0),
  }));
  withScores.sort((a, b) => b.score - a.score || b.reviewSum - a.reviewSum);

  const idx = withScores.findIndex((x) => x.studio.kakao_place_id === target.kakao_place_id);
  return {
    rank: idx >= 0 ? idx + 1 : peers.length,
    total: peers.length,
    top3: withScores.slice(0, 3).map((x) => ({ studio: x.studio, score: x.score })),
  };
}

export function gradeColor(grade: ScoreBreakdown["grade"]): string {
  switch (grade) {
    case "A":
      return "text-emerald-500";
    case "B":
      return "text-sky-500";
    case "C":
      return "text-amber-500";
    case "D":
      return "text-orange-500";
    case "F":
      return "text-rose-500";
  }
}

// 10,424건 실제 분포 기반 퍼센타일 등급
// 전국 rank, total로 계산: 상위 10%=A / 25%=B / 50%=C / 75%=D / 나머지=F
export function gradeFromRank(
  rank: number,
  total: number
): ScoreBreakdown["grade"] {
  if (total <= 0) return "F";
  const topPct = rank / total;
  if (topPct <= 0.1) return "A";
  if (topPct <= 0.25) return "B";
  if (topPct <= 0.5) return "C";
  if (topPct <= 0.75) return "D";
  return "F";
}

export function topPercent(rank: number, total: number): number {
  if (total <= 0) return 100;
  return Math.max(0.1, Math.round((rank / total) * 1000) / 10);
}
