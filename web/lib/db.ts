import Database from "better-sqlite3";
import path from "path";
import { Studio } from "./types";

let _db: Database.Database | null = null;

export function db(): Database.Database {
  if (_db) return _db;
  // 배포 시 web/data/pilates.db를 번들. 로컬 개발도 같은 경로 사용.
  const p = path.resolve(process.cwd(), "data", "pilates.db");
  _db = new Database(p, { fileMustExist: true, readonly: true });
  _db.pragma("busy_timeout = 5000");
  return _db;
}

export type WaitlistInput = {
  kakao_place_id: string;
  place_name: string;
  biz_number?: string;
  owner_name?: string;
  phone: string;
  message?: string;
  source_url?: string;
  user_agent?: string;
  ip?: string;
};

export function waitlistCount(): number {
  return 0;
}

export function waitlistCountForStudio(_kakaoPlaceId: string): number {
  return 0;
}

const STUDIO_COLS = `
  kakao_place_id, place_name, category_name, phone,
  road_address_name, address_name, sido, sigungu,
  lng, lat, place_url,
  naver_url,
  homepage_url, instagram_handle, naver_blog_handle,
  kakao_channel_name, kakao_channel_url,
  kakao_review_count, kakao_review_score, kakao_photo_count,
  blog_review_count, menu_count, menu_price_min, menu_price_max,
  has_coupon
`;

// SQL로 계산되는 점수 — lib/score.ts와 반드시 동일하게 유지
const SCORE_EXPR = `
  (CASE WHEN naver_url IS NOT NULL THEN 15 ELSE 0 END) +
  10 +
  (CASE WHEN kakao_channel_name IS NOT NULL THEN 10 ELSE 0 END) +
  (CASE WHEN homepage_url IS NOT NULL THEN 10 ELSE 0 END) +
  (CASE WHEN instagram_handle IS NOT NULL THEN 15 ELSE 0 END) +
  (CASE WHEN naver_blog_handle IS NOT NULL THEN 5 ELSE 0 END) +
  (CASE WHEN COALESCE(kakao_review_count,0) >= 20 THEN 10
        WHEN COALESCE(kakao_review_count,0) >=  5 THEN 6
        WHEN COALESCE(kakao_review_count,0) >=  1 THEN 3 ELSE 0 END) +
  (CASE WHEN COALESCE(blog_review_count,0) >= 20 THEN 10
        WHEN COALESCE(blog_review_count,0) >=  5 THEN 6
        WHEN COALESCE(blog_review_count,0) >=  1 THEN 3 ELSE 0 END) +
  (CASE WHEN COALESCE(menu_count,0) > 0 THEN 5 ELSE 0 END)
`;

const REVIEW_SUM_EXPR = `(COALESCE(kakao_review_count,0) + COALESCE(blog_review_count,0))`;

export function getStudio(id: string): Studio | null {
  const row = db()
    .prepare(`SELECT ${STUDIO_COLS} FROM pilates_studio WHERE kakao_place_id = ? AND is_pilates = 1`)
    .get(id) as Studio | undefined;
  return row ?? null;
}

export type StudioRanked = Studio & {
  score: number;
  national_rank: number;
  national_total: number;
  sigungu_rank: number | null;
  sigungu_total: number | null;
};

export function getStudioRanked(id: string): StudioRanked | null {
  const sql = `
    WITH scored AS (
      SELECT ${STUDIO_COLS}, ${SCORE_EXPR} AS score, ${REVIEW_SUM_EXPR} AS rsum
        FROM pilates_studio
       WHERE is_pilates = 1
    ),
    ranked AS (
      SELECT *,
             RANK()  OVER (ORDER BY score DESC, rsum DESC) AS national_rank,
             COUNT(*) OVER ()                              AS national_total,
             CASE WHEN sido IS NOT NULL AND sigungu IS NOT NULL THEN
               RANK() OVER (PARTITION BY sido, sigungu
                            ORDER BY score DESC, rsum DESC)
             END AS sigungu_rank,
             CASE WHEN sido IS NOT NULL AND sigungu IS NOT NULL THEN
               COUNT(*) OVER (PARTITION BY sido, sigungu)
             END AS sigungu_total
        FROM scored
    )
    SELECT * FROM ranked WHERE kakao_place_id = ?
  `;
  const row = db().prepare(sql).get(id) as StudioRanked | undefined;
  return row ?? null;
}

export function rankedInSigungu(
  sido: string,
  sigungu: string,
  limit = 200
): StudioRanked[] {
  const sql = `
    WITH scored AS (
      SELECT ${STUDIO_COLS}, ${SCORE_EXPR} AS score, ${REVIEW_SUM_EXPR} AS rsum
        FROM pilates_studio
       WHERE is_pilates = 1
    ),
    ranked AS (
      SELECT *,
             RANK()  OVER (ORDER BY score DESC, rsum DESC) AS national_rank,
             COUNT(*) OVER ()                              AS national_total,
             RANK()  OVER (PARTITION BY sido, sigungu
                           ORDER BY score DESC, rsum DESC) AS sigungu_rank,
             COUNT(*) OVER (PARTITION BY sido, sigungu)    AS sigungu_total
        FROM scored
    )
    SELECT * FROM ranked
     WHERE sido = ? AND sigungu = ?
     ORDER BY sigungu_rank
     LIMIT ?
  `;
  return db().prepare(sql).all(sido, sigungu, limit) as StudioRanked[];
}

export function top3InSigungu(sido: string, sigungu: string): StudioRanked[] {
  return rankedInSigungu(sido, sigungu, 3);
}

export function competitorsAboveMe(
  sido: string,
  sigungu: string,
  myRank: number,
  limit = 3
): StudioRanked[] {
  const sql = `
    WITH scored AS (
      SELECT ${STUDIO_COLS}, ${SCORE_EXPR} AS score, ${REVIEW_SUM_EXPR} AS rsum
        FROM pilates_studio WHERE is_pilates = 1
    ),
    ranked AS (
      SELECT *,
             RANK()  OVER (ORDER BY score DESC, rsum DESC) AS national_rank,
             COUNT(*) OVER ()                              AS national_total,
             RANK()  OVER (PARTITION BY sido, sigungu
                           ORDER BY score DESC, rsum DESC) AS sigungu_rank,
             COUNT(*) OVER (PARTITION BY sido, sigungu)    AS sigungu_total
        FROM scored
    )
    SELECT * FROM ranked
     WHERE sido = ? AND sigungu = ? AND sigungu_rank < ?
     ORDER BY sigungu_rank DESC
     LIMIT ?
  `;
  return db().prepare(sql).all(sido, sigungu, myRank, limit) as StudioRanked[];
}

export type SigunguStats = {
  total: number;
  avg_score: number;
  platform_avg: number;   // 네이버·카카오·카톡
  digital_avg: number;    // 홈페이지·인스타·블로그
  content_avg: number;    // 리뷰·메뉴
  has_naver_pct: number;
  has_homepage_pct: number;
  has_instagram_pct: number;
  has_channel_pct: number;
  has_blog_pct: number;
  has_menu_pct: number;
};

export function sigunguStats(sido: string, sigungu: string): SigunguStats {
  const sql = `
    SELECT
      COUNT(*) AS total,
      AVG(${SCORE_EXPR}) AS avg_score,
      AVG(
        (CASE WHEN naver_url IS NOT NULL THEN 15 ELSE 0 END) +
        10 +
        (CASE WHEN kakao_channel_name IS NOT NULL THEN 10 ELSE 0 END)
      ) AS platform_avg,
      AVG(
        (CASE WHEN homepage_url IS NOT NULL THEN 10 ELSE 0 END) +
        (CASE WHEN instagram_handle IS NOT NULL THEN 15 ELSE 0 END) +
        (CASE WHEN naver_blog_handle IS NOT NULL THEN 5 ELSE 0 END)
      ) AS digital_avg,
      AVG(
        (CASE WHEN COALESCE(kakao_review_count,0) >= 20 THEN 10
              WHEN COALESCE(kakao_review_count,0) >=  5 THEN 6
              WHEN COALESCE(kakao_review_count,0) >=  1 THEN 3 ELSE 0 END) +
        (CASE WHEN COALESCE(blog_review_count,0) >= 20 THEN 10
              WHEN COALESCE(blog_review_count,0) >=  5 THEN 6
              WHEN COALESCE(blog_review_count,0) >=  1 THEN 3 ELSE 0 END) +
        (CASE WHEN COALESCE(menu_count,0) > 0 THEN 5 ELSE 0 END)
      ) AS content_avg,
      AVG(CASE WHEN naver_url        IS NOT NULL THEN 1.0 ELSE 0 END) * 100 AS has_naver_pct,
      AVG(CASE WHEN homepage_url     IS NOT NULL THEN 1.0 ELSE 0 END) * 100 AS has_homepage_pct,
      AVG(CASE WHEN instagram_handle IS NOT NULL THEN 1.0 ELSE 0 END) * 100 AS has_instagram_pct,
      AVG(CASE WHEN kakao_channel_name IS NOT NULL THEN 1.0 ELSE 0 END) * 100 AS has_channel_pct,
      AVG(CASE WHEN naver_blog_handle IS NOT NULL THEN 1.0 ELSE 0 END) * 100 AS has_blog_pct,
      AVG(CASE WHEN COALESCE(menu_count,0) > 0 THEN 1.0 ELSE 0 END) * 100 AS has_menu_pct
    FROM pilates_studio
    WHERE is_pilates = 1 AND sido = ? AND sigungu = ?
  `;
  return db().prepare(sql).get(sido, sigungu) as SigunguStats;
}

export type StudioRankedWithDist = StudioRanked & { dist_m: number };

export function competitorsWithinRadius(
  lng: number,
  lat: number,
  radius_m: number,
  excludeId: string,
  limit = 30
): StudioRankedWithDist[] {
  const latDelta = radius_m / 111320;
  const lngDelta = radius_m / (111320 * Math.cos((lat * Math.PI) / 180));
  const sql = `
    WITH all_scored AS (
      SELECT kakao_place_id, ${SCORE_EXPR} AS s, ${REVIEW_SUM_EXPR} AS r
        FROM pilates_studio WHERE is_pilates = 1
    ),
    all_ranked AS (
      SELECT kakao_place_id,
             RANK() OVER (ORDER BY s DESC, r DESC) AS national_rank,
             COUNT(*) OVER () AS national_total
        FROM all_scored
    ),
    bbox AS (
      SELECT ${STUDIO_COLS}, ${SCORE_EXPR} AS score
        FROM pilates_studio
       WHERE is_pilates = 1
         AND lat BETWEEN ? AND ?
         AND lng BETWEEN ? AND ?
    )
    SELECT b.*,
           ar.national_rank,
           ar.national_total,
           NULL AS sigungu_rank,
           NULL AS sigungu_total,
           (6371000 * 2 * ASIN(MIN(1, SQRT(
             POWER(SIN((RADIANS(b.lat) - RADIANS(?)) / 2), 2) +
             COS(RADIANS(?)) * COS(RADIANS(b.lat)) *
             POWER(SIN((RADIANS(b.lng) - RADIANS(?)) / 2), 2)
           )))) AS dist_m
      FROM bbox b
      JOIN all_ranked ar USING (kakao_place_id)
     WHERE b.kakao_place_id != ?
       AND (6371000 * 2 * ASIN(MIN(1, SQRT(
             POWER(SIN((RADIANS(b.lat) - RADIANS(?)) / 2), 2) +
             COS(RADIANS(?)) * COS(RADIANS(b.lat)) *
             POWER(SIN((RADIANS(b.lng) - RADIANS(?)) / 2), 2)
           )))) <= ?
     ORDER BY dist_m
     LIMIT ?
  `;
  return db()
    .prepare(sql)
    .all(
      lat - latDelta,
      lat + latDelta,
      lng - lngDelta,
      lng + lngDelta,
      lat,
      lat,
      lng,
      excludeId,
      lat,
      lat,
      lng,
      radius_m,
      limit
    ) as StudioRankedWithDist[];
}

export function countWithinRadius(
  lng: number,
  lat: number,
  radius_m: number,
  excludeId: string
): number {
  const latDelta = radius_m / 111320;
  const lngDelta = radius_m / (111320 * Math.cos((lat * Math.PI) / 180));
  const sql = `
    SELECT COUNT(*) AS n
      FROM pilates_studio
     WHERE is_pilates = 1
       AND kakao_place_id != ?
       AND lat BETWEEN ? AND ?
       AND lng BETWEEN ? AND ?
       AND (6371000 * 2 * ASIN(MIN(1, SQRT(
             POWER(SIN((RADIANS(lat) - RADIANS(?)) / 2), 2) +
             COS(RADIANS(?)) * COS(RADIANS(lat)) *
             POWER(SIN((RADIANS(lng) - RADIANS(?)) / 2), 2)
           )))) <= ?
  `;
  const row = db()
    .prepare(sql)
    .get(
      excludeId,
      lat - latDelta,
      lat + latDelta,
      lng - lngDelta,
      lng + lngDelta,
      lat,
      lat,
      lng,
      radius_m
    ) as { n: number };
  return row.n;
}

export function sigunguTop1Score(sido: string, sigungu: string): number {
  const r = db()
    .prepare(
      `SELECT MAX(${SCORE_EXPR}) AS top FROM pilates_studio
        WHERE is_pilates = 1 AND sido = ? AND sigungu = ?`
    )
    .get(sido, sigungu) as { top: number | null };
  return r.top ?? 0;
}

export function studiosBySigungu(sido: string, sigungu: string, limit = 200): Studio[] {
  return db()
    .prepare(
      `SELECT ${STUDIO_COLS} FROM pilates_studio
        WHERE is_pilates = 1 AND sido = ? AND sigungu = ?`
    )
    .all(sido, sigungu) as Studio[];
}

export function allSigungu(): { sido: string; sigungu: string; count: number }[] {
  return db()
    .prepare(
      `SELECT sido, sigungu, COUNT(*) as count
         FROM pilates_studio
        WHERE is_pilates = 1 AND sigungu IS NOT NULL
        GROUP BY sido, sigungu
        ORDER BY count DESC`
    )
    .all() as { sido: string; sigungu: string; count: number }[];
}

export function searchStudios(q: string, limit = 30): Studio[] {
  const like = `%${q}%`;
  return db()
    .prepare(
      `SELECT ${STUDIO_COLS} FROM pilates_studio
        WHERE is_pilates = 1
          AND (place_name LIKE ? OR road_address_name LIKE ? OR address_name LIKE ?)
        LIMIT ?`
    )
    .all(like, like, like, limit) as Studio[];
}

export function summaryCounts(): {
  total_pilates: number;
  sido_counts: { sido: string; n: number }[];
} {
  const total = db()
    .prepare(`SELECT COUNT(*) as n FROM pilates_studio WHERE is_pilates = 1`)
    .get() as { n: number };
  const sido = db()
    .prepare(
      `SELECT sido, COUNT(*) as n FROM pilates_studio
        WHERE is_pilates = 1 AND sido IS NOT NULL
        GROUP BY sido ORDER BY n DESC`
    )
    .all() as { sido: string; n: number }[];
  return { total_pilates: total.n, sido_counts: sido };
}
