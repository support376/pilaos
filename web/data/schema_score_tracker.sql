-- ===========================================================
-- PilaOS Score Tracker — Supabase 스키마
-- 5채널 마케팅 점수 트래킹 + 권리금 영향
-- ===========================================================

-- 매장 기본 정보 (사장님 인증된 매장)
create table if not exists studios (
  id              bigserial primary key,
  user_id         uuid references auth.users(id) on delete cascade,
  kakao_place_id  text unique,
  name            text not null,
  sido            text,
  sigungu         text,
  area_pyeong     int,            -- 평수
  active_members  int,            -- 활성 회원수
  reformer_count  int,
  opened_at       date,           -- 개업일
  -- 인증 상태
  verified        boolean default false,
  verified_at     timestamptz,
  verify_method   text,           -- 'phone' | 'business_no' | 'place_owner'
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index on studios (user_id);
create index on studios (kakao_place_id);

-- 채널 연동 상태
create table if not exists channel_links (
  id              bigserial primary key,
  studio_id       bigint references studios(id) on delete cascade,
  channel         text not null,  -- 'naver_place' | 'danggn' | 'instagram' | 'naver_blog' | 'kakao_channel' | 'google_place'
  external_id     text,           -- 채널별 고유 ID (인스타 user_id, 플레이스 id 등)
  link_method     text,           -- 'oauth' | 'ocr' | 'scrape' | 'manual'
  oauth_token     text,           -- OAuth 토큰 (암호화)
  oauth_refresh   text,
  oauth_expires_at timestamptz,
  last_synced_at  timestamptz,
  status          text default 'pending',  -- 'pending' | 'active' | 'failed' | 'disabled'
  created_at      timestamptz default now(),
  unique (studio_id, channel)
);

create index on channel_links (studio_id);
create index on channel_links (channel, status);

-- 채널별 점수 / 메트릭 스냅샷 (매주 갱신)
create table if not exists channel_metrics (
  id              bigserial primary key,
  studio_id       bigint references studios(id) on delete cascade,
  channel         text not null,
  snapshot_date   date not null,           -- 월요일 09:00 갱신
  -- 공통 점수
  score           numeric(5,2),            -- 0~100
  score_delta     numeric(5,2),            -- 지난주 대비
  -- raw KPI (JSON으로 채널별 다른 형태 저장)
  metrics         jsonb,
  /* metrics 예시:
  naver_place: { rank: 12, total_in_area: 200, reviews: 86, avg_rating: 4.6, new_30d: 8, response_rate: 0.6 }
  danggn: { profile_views: 240, posts: 4, last_ad_days_ago: 60, reviews: 18 }
  instagram: { followers: 1840, posts: 132, last_post_days_ago: 12, avg_likes: 145, reach_30d: 5200 }
  naver_blog: { post_freq_per_week: 2.0, monthly_visitors: 1820, comments_30d: 24 }
  kakao_channel: { friends: 320, msg_sent_30d: 6, response_rate: 0.85 }
  google_place: { rating: 4.4, reviews: 32, new_30d: 3 }
  */
  data_source     text,                    -- 'oauth' | 'ocr' | 'scrape' | 'manual'
  raw_url         text,                    -- 원본 스크린샷 URL (Supabase Storage)
  created_at      timestamptz default now(),
  unique (studio_id, channel, snapshot_date)
);

create index on channel_metrics (studio_id, snapshot_date desc);
create index on channel_metrics (channel, snapshot_date desc);

-- 종합 마케팅 점수 (5채널 가중 평균) — 매주 LIVE 위젯 데이터
create table if not exists marketing_score (
  id              bigserial primary key,
  studio_id       bigint references studios(id) on delete cascade,
  snapshot_date   date not null,
  total_score     numeric(5,2) not null,   -- 0~100
  score_delta     numeric(5,2),            -- 지난주 대비
  area_avg_score  numeric(5,2),            -- 동네 평균 (자체 매물 DB 비교)
  -- 채널별 점수 분해
  scores          jsonb,
  /* { naver_place: 75, danggn: 32, instagram: 58, naver_blog: 85, google_place: 62 } */
  -- 권리금 영향 (회귀 모델)
  estimated_keymoney_delta_won  bigint,    -- 점수 변화 → 권리금 변화 (만원 단위)
  notes           text,
  created_at      timestamptz default now(),
  unique (studio_id, snapshot_date)
);

create index on marketing_score (studio_id, snapshot_date desc);

-- 대행 요청 (수익원)
create table if not exists agency_requests (
  id              bigserial primary key,
  studio_id       bigint references studios(id) on delete cascade,
  user_id         uuid references auth.users(id),
  channel         text not null,
  service_type    text not null,           -- 'place_management' | 'danggn_ad' | 'instagram_posting' | ...
  monthly_price   int not null,            -- 만원
  status          text default 'inquired', -- 'inquired' | 'contracted' | 'active' | 'cancelled'
  start_date      date,
  end_date        date,
  notes           text,
  created_at      timestamptz default now()
);

create index on agency_requests (studio_id, status);
create index on agency_requests (channel, status);

-- 카톡 알림 발송 로그 (락인 트래킹)
create table if not exists notifications (
  id              bigserial primary key,
  studio_id       bigint references studios(id) on delete cascade,
  notif_type      text not null,           -- 'weekly_score' | 'score_drop' | 'support_program_match' | 'refund_risk'
  payload         jsonb,
  sent_via        text,                    -- 'kakao_alimtalk' | 'kakao_friend_chat' | 'sms' | 'email'
  sent_at         timestamptz,
  opened_at       timestamptz,
  clicked_at      timestamptz,
  created_at      timestamptz default now()
);

create index on notifications (studio_id, sent_at desc);

-- 진단 결과 (간이/프로) — 권리금 산정 기록
create table if not exists diagnostics (
  id              bigserial primary key,
  studio_id       bigint references studios(id) on delete cascade,
  diag_type       text not null,           -- 'lite' | 'pro'
  inputs          jsonb,                   -- 진단기에 입력된 모든 값
  result          jsonb,                   -- 권리금/시나리오/지원사업 매칭 결과
  estimated_keymoney_won  bigint,          -- 만원
  scenario_a_net  bigint,                  -- 즉시 매각
  scenario_b_net  bigint,                  -- 즉시 폐업
  scenario_c_net  bigint,                  -- 6개월후 폐업
  created_at      timestamptz default now()
);

create index on diagnostics (studio_id, created_at desc);

-- ===========================================================
-- 시드 데이터 (개발용)
-- ===========================================================

-- 채널별 가중치 (마케팅 점수 산정용)
create table if not exists channel_weights (
  channel         text primary key,
  weight          numeric(3,2) not null,   -- 0.0 ~ 1.0
  notes           text
);

insert into channel_weights (channel, weight, notes) values
  ('naver_place',   0.35, '신규 회원 유입 60-70% 기여'),
  ('instagram',     0.20, '20-30대 인지도'),
  ('naver_blog',    0.15, '네이버 검색 SEO'),
  ('danggn',        0.15, '동네 인지도'),
  ('google_place',  0.10, '외국인/프리미엄 매장'),
  ('kakao_channel', 0.05, '재방문 retention')
on conflict (channel) do update set weight = excluded.weight, notes = excluded.notes;

-- 대행 서비스 기본 가격
create table if not exists agency_pricing (
  service_type    text primary key,
  channel         text not null,
  monthly_price   int not null,
  description     text
);

insert into agency_pricing (service_type, channel, monthly_price, description) values
  ('place_management',    'naver_place', 19, '리뷰 답변·사진·메뉴 갱신·영업시간 관리'),
  ('danggn_ad',           'danggn',      29, '동네광고 + 동네소식 게시글 운영'),
  ('instagram_posting',   'instagram',   49, '주 2회 정기 포스팅 + 월 4개 릴스 제작'),
  ('blog_writing',        'naver_blog',  39, '주 2회 블로그 포스팅 (필라테스 컨텐츠)'),
  ('all_in_one',          'all',         99, '전 채널 통합 운영 + 월간 보고서')
on conflict (service_type) do update set monthly_price = excluded.monthly_price;

-- ===========================================================
-- 점수 산정 함수 (예시)
-- ===========================================================

create or replace function calc_marketing_score(p_studio_id bigint, p_date date)
returns numeric as $$
declare
  total numeric := 0;
  total_weight numeric := 0;
  rec record;
begin
  for rec in
    select cm.channel, cm.score, cw.weight
    from channel_metrics cm
    join channel_weights cw on cm.channel = cw.channel
    where cm.studio_id = p_studio_id
      and cm.snapshot_date = p_date
      and cm.score is not null
  loop
    total := total + (rec.score * rec.weight);
    total_weight := total_weight + rec.weight;
  end loop;

  if total_weight = 0 then return null; end if;
  return round(total / total_weight, 2);
end;
$$ language plpgsql;

-- ===========================================================
-- RLS (Row Level Security) — 사장님 본인 매장만 접근
-- ===========================================================

alter table studios enable row level security;
create policy "studios_owner_select" on studios for select using (auth.uid() = user_id);
create policy "studios_owner_update" on studios for update using (auth.uid() = user_id);

alter table channel_links enable row level security;
create policy "channel_links_owner" on channel_links
  using (exists (select 1 from studios where studios.id = channel_links.studio_id and studios.user_id = auth.uid()));

alter table channel_metrics enable row level security;
create policy "metrics_owner" on channel_metrics for select
  using (exists (select 1 from studios where studios.id = channel_metrics.studio_id and studios.user_id = auth.uid()));

alter table marketing_score enable row level security;
create policy "score_owner" on marketing_score for select
  using (exists (select 1 from studios where studios.id = marketing_score.studio_id and studios.user_id = auth.uid()));

alter table diagnostics enable row level security;
create policy "diag_owner" on diagnostics
  using (exists (select 1 from studios where studios.id = diagnostics.studio_id and studios.user_id = auth.uid()));

alter table agency_requests enable row level security;
create policy "agency_owner" on agency_requests for select using (auth.uid() = user_id);
create policy "agency_insert_self" on agency_requests for insert with check (auth.uid() = user_id);

alter table notifications enable row level security;
create policy "notif_owner" on notifications for select
  using (exists (select 1 from studios where studios.id = notifications.studio_id and studios.user_id = auth.uid()));
