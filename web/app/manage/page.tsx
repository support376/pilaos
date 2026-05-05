import Link from "next/link";

export const metadata = {
  title: "매장 점수 — 마케팅 트래커 + 대행",
  description: "기존 회원관리 툴이 안 보는 외부 노출 (네이버 플레이스·당근·SNS·리뷰) 종합 점수. 점수 낮으면 PilaOS가 대행 운영.",
};

export default function Manage() {
  return (
    <div className="bg-white text-black">

      {/* HERO */}
      <section className="mx-auto max-w-3xl px-5 pt-14 pb-8 sm:pt-20">
        <div className="flex items-center gap-2">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">매장 점수 · LIVE</div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black text-white">BETA</span>
        </div>
        <h1 className="mt-3 text-[34px] sm:text-[52px] font-extrabold leading-[1.05] tracking-tight">
          내 매장이<br />
          <span className="text-blue-600">잘 될지 안 될지.</span>
        </h1>
        <p className="mt-5 text-[16px] sm:text-[18px] text-black/65 leading-relaxed">
          회원관리 툴은 이미 많아요. 우리는 그게 안 보는 것만 — 네이버 플레이스, 당근, 인스타, 블로그, 리뷰. 매장 가치를 진짜로 결정하는 외부 노출 점수.
        </p>
      </section>

      {/* 종합 마케팅 점수 (HERO 아래 메인 위젯) */}
      <section className="mx-auto max-w-3xl px-5 pb-12">
        <div className="rounded-2xl border-2 border-black bg-white p-6 sm:p-7">
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">매장 마케팅 점수</div>
              <div className="mt-1 text-[10px] text-black/45">예시 · 강남 30평 필라테스 · 매주 갱신</div>
            </div>
            <div className="text-[10px] text-black/45">매주 월요일 09:00</div>
          </div>

          <div className="mt-4 flex items-baseline gap-3 flex-wrap">
            <div className="text-[44px] sm:text-[56px] font-extrabold leading-none tracking-tight">62<span className="text-[22px] sm:text-[26px] text-black/55">/ 100</span></div>
            <div className="rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[12px] font-bold px-2 py-1">▼ 5점 (지난주)</div>
          </div>
          <div className="mt-2 text-[13px] text-black/65 leading-relaxed">
            마케팅 점수가 5점 떨어지면 권리금 약 <strong className="text-red-600">−1,200만</strong>. 동네 평균 68점 대비 −6점.
          </div>

          {/* 점수 막대 */}
          <div className="mt-4">
            <div className="h-2 bg-black/8 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: "62%" }} />
            </div>
            <div className="flex justify-between text-[10px] text-black/40 mt-1.5">
              <span>0</span><span>50</span><span>100</span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="rounded-lg border border-black/10 p-2.5 text-center">
              <div className="text-[10px] text-black/45">동네 평균</div>
              <div className="mt-1 text-[14px] font-extrabold text-black">68점</div>
            </div>
            <div className="rounded-lg border border-red-300 bg-red-50/40 p-2.5 text-center">
              <div className="text-[10px] text-red-700">하락 추세 ⚠</div>
              <div className="mt-1 text-[14px] font-extrabold text-red-600">−5 / 30일</div>
            </div>
            <div className="rounded-lg border border-black/10 p-2.5 text-center">
              <div className="text-[10px] text-black/45">권리금 영향</div>
              <div className="mt-1 text-[14px] font-extrabold text-red-600">−1,200만</div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/diagnostic/#stage1" className="inline-block rounded-md bg-black px-4 py-2 text-xs font-bold text-white hover:bg-black/85">내 매장 점수 시작 (60초) →</Link>
            <Link href="/inquire?kind=manage&src=manage_score" className="inline-block rounded-md border border-black/20 bg-white px-4 py-2 text-xs font-bold text-black hover:border-black/40">베타 사전 신청</Link>
          </div>

          <div className="mt-4 text-[11px] text-black/45 leading-relaxed">
            * 위 점수는 예시. 진단 1회 + 매장 인증 후 사장님 매장 실제 점수 매주 갱신 + 권리금 영향 자동 계산.
          </div>
        </div>
      </section>

      {/* 데이터 연동 — 5채널 인증 방법 */}
      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">데이터 연동</div>
          <h2 className="mt-3 text-[24px] sm:text-[28px] font-extrabold leading-tight tracking-tight">
            점수 자동 갱신, <span className="text-blue-600">3가지 방법</span>
          </h2>
          <p className="mt-3 text-[14px] text-black/65 leading-relaxed">
            채널마다 데이터 가져오는 방식이 다릅니다. 가장 간편한 방법부터 시작 → 점차 OAuth/스크래핑으로 자동화 확장.
          </p>

          <div className="mt-8 space-y-3">
            <LinkMethod
              method="OAuth 자동"
              difficulty="가장 쉬움"
              channels={["인스타그램"]}
              detail="비즈니스 계정 + 페이스북 페이지 연결 후 OAuth 한 번 → 매주 자동 데이터 수집"
              setupTime="3분"
            />
            <LinkMethod
              method="스크린샷 OCR"
              difficulty="중간"
              channels={["네이버 플레이스", "당근", "네이버 블로그", "카카오 채널"]}
              detail="사장님이 운영자 통계 화면 캡처 업로드 → AI가 점수/지표 자동 추출 (Claude Vision)"
              setupTime="채널당 1분"
            />
            <LinkMethod
              method="공개 데이터 자동"
              difficulty="자동"
              channels={["네이버 플레이스 검색결과", "구글 비즈니스", "카카오맵 리뷰"]}
              detail="공개 정보는 PilaOS가 자동 스크래핑 — 사장님은 매장 인증만 하면 됨"
              setupTime="0분 (자동)"
            />
          </div>

          <div className="mt-6 rounded-lg bg-blue-50 p-4 text-[13px] text-blue-900 leading-relaxed">
            <strong>왜 자체 API 안 쓰나요?</strong> 네이버 플레이스/당근은 공식 API가 없습니다. 그래서 OCR + 공개 스크래핑이 현실적인 유일한 방법. 인스타그램만 공식 OAuth (Meta Graph API) 사용.
          </div>
        </div>
      </section>

      {/* 4개 채널 KPI + 각 채널 대행 요청 */}
      <section className="border-t border-black/10 bg-black/[.02]">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">채널별 점수 + 대행</div>
          <h2 className="mt-3 text-[24px] sm:text-[28px] font-extrabold leading-tight tracking-tight">
            점수 낮은 채널은 <span className="text-blue-600">대행 요청.</span>
          </h2>
          <p className="mt-3 text-[14px] text-black/65 leading-relaxed">
            사장님이 직접 운영하기 힘드시면 PilaOS가 대행. 월 정액 · 결과 데이터 매주 보고.
          </p>

          <div className="mt-8 space-y-3">
            <ChannelCard
              name="네이버 플레이스"
              score={75}
              metrics={[
                { label: "지역 랭킹", value: "12위" },
                { label: "리뷰 평점", value: "4.6" },
                { label: "새 리뷰 (30일)", value: "8개" },
              ]}
              status="ok"
              note="동네 평균 대비 양호. 리뷰 답변율 60% — 80%까지 끌어올리면 +3점."
              service="플레이스 운영 대행 (리뷰 답변·사진·메뉴 갱신)"
              price="월 19만"
            />
            <ChannelCard
              name="당근"
              score={32}
              metrics={[
                { label: "동네 노출", value: "약함" },
                { label: "최근 광고", value: "60일 전" },
                { label: "조회수 (30일)", value: "240" },
              ]}
              status="bad"
              note="당근 미운영 상태. 동네 광고 1주 돌리면 +15점, 권리금 +800만 예상."
              service="당근 동네광고 + 게시글 운영"
              price="월 29만"
            />
            <ChannelCard
              name="인스타그램"
              score={58}
              metrics={[
                { label: "팔로워", value: "1,840" },
                { label: "최근 게시물", value: "12일 전" },
                { label: "도달 (30일)", value: "5,200" },
              ]}
              status="warn"
              note="2주 이상 게시 없음. 주 2회 정기 포스팅 시 +8점."
              service="인스타 정기 포스팅 + 릴스 제작"
              price="월 49만"
            />
            <ChannelCard
              name="블로그·카카오 채널"
              score={85}
              metrics={[
                { label: "블로그 포스팅", value: "주 2회" },
                { label: "카톡 채널 친구", value: "320명" },
                { label: "방문자 (30일)", value: "1,820" },
              ]}
              status="ok"
              note="잘 운영 중. 유지만 하면 됨."
              service="유지 모드 (대행 X)"
              price="해당 없음"
            />
          </div>
        </div>
      </section>

      {/* 무엇이 들어가나 */}
      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">왜 이거만 보나</div>
          <h2 className="mt-3 text-[24px] sm:text-[28px] font-extrabold leading-tight tracking-tight">
            기존 회원관리 툴이 <span className="text-blue-600">못 보는 것.</span>
          </h2>
          <p className="mt-3 text-[14px] text-black/65 leading-relaxed">
            헤이비·페어·OK캐쉬백은 회원·결제·출석을 잘 합니다. 우리는 안 합니다. 대신 그들이 못 보는 외부 노출만 — 그게 매장 가치를 결정.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Compare them="회원·결제·출석 관리" us="외부 노출 (플레이스·당근·SNS) 점수" />
            <Compare them="강사 정산" us="권리금 LIVE (점수 변화 → 가치 변동)" />
            <Compare them="회원권 환불" us="채널 대행 (낮은 점수 채널 우리가 운영)" />
            <Compare them="POS 매출 입력" us="진단 → 매각/폐업 원큐 funnel" />
          </div>
        </div>
      </section>

      {/* 베타 신청 */}
      <section className="border-t border-black/10 bg-black/[.02]">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">베타 사전 신청</div>
          <h2 className="mt-3 text-[26px] sm:text-[32px] font-extrabold leading-tight tracking-tight">
            첫 100명 <span className="text-blue-600">점수 트래킹 평생 무료</span>
          </h2>
          <p className="mt-4 text-[14px] text-black/65 leading-relaxed">
            점수만 무료. 대행 서비스는 별도 — 필요한 채널만 골라서 신청.
          </p>

          <div className="mt-7 rounded-2xl border-2 border-black bg-white p-7">
            <div className="text-[14px] font-bold">출시 알림 받기</div>
            <p className="mt-2 text-[13px] text-black/60">
              지금은 사전 신청만 — 출시 시 카톡으로 안내. 진단 1회만 하면 다음 주 월요일부터 점수 자동 갱신.
            </p>
            <Link
              href="/inquire?kind=manage&src=manage_landing"
              className="mt-5 inline-block rounded-md bg-black px-6 py-3 text-sm font-bold text-white hover:bg-black/85"
            >
              사전 신청 (휴대폰만) →
            </Link>
          </div>
        </div>
      </section>

      {/* 매각 동선 */}
      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <h2 className="text-[22px] sm:text-[26px] font-extrabold leading-tight tracking-tight">
            점수가 너무 낮으면 <span className="text-red-600">매각/폐업</span>이 답일 수도.
          </h2>
          <p className="mt-3 text-[14px] text-black/65 leading-relaxed">
            대행으로 끌어올려도 손익분기 못 맞추면 — 진단 → 매각/폐업 한 흐름으로.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/diagnostic/#stage1" className="inline-block rounded-md bg-black px-5 py-2.5 text-sm font-bold text-white hover:bg-black/85">권리금 진단 →</Link>
            <Link href="/sell" className="inline-block rounded-md border border-black/20 bg-white px-5 py-2.5 text-sm font-bold text-black hover:border-black/40">매각 절차 보기</Link>
          </div>
        </div>
      </section>

    </div>
  );
}

function LinkMethod({ method, difficulty, channels, detail, setupTime }: { method: string; difficulty: string; channels: string[]; detail: string; setupTime: string }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-5">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <div className="flex items-baseline gap-3">
          <div className="text-[15px] font-extrabold">{method}</div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">{difficulty}</span>
        </div>
        <span className="text-[11px] text-black/45">초기 설정 {setupTime}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {channels.map((c) => (
          <span key={c} className="text-[11px] font-medium px-2 py-0.5 rounded bg-black/5 text-black/70">{c}</span>
        ))}
      </div>
      <div className="mt-3 text-[12.5px] text-black/65 leading-relaxed">{detail}</div>
    </div>
  );
}

function ChannelCard({ name, score, metrics, status, note, service, price }: {
  name: string;
  score: number;
  metrics: { label: string; value: string }[];
  status: "ok" | "warn" | "bad";
  note: string;
  service: string;
  price: string;
}) {
  const scoreColor = status === "ok" ? "text-blue-600" : status === "warn" ? "text-amber-700" : "text-red-600";
  const barColor = status === "ok" ? "bg-blue-600" : status === "warn" ? "bg-amber-500" : "bg-red-500";
  const ctaShow = status !== "ok";

  return (
    <div className="rounded-xl border border-black/10 bg-white p-5">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <div className="flex items-baseline gap-3">
          <div className="text-[15px] font-extrabold">{name}</div>
          <div className={`text-[20px] font-extrabold ${scoreColor}`}>{score}<span className="text-[12px] text-black/45 font-medium">/100</span></div>
        </div>
        <div className="flex-1 min-w-[120px] max-w-[200px]">
          <div className="h-1.5 bg-black/8 rounded-full overflow-hidden">
            <div className={`h-full ${barColor} rounded-full`} style={{ width: `${score}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {metrics.map((m) => (
          <div key={m.label} className="rounded bg-black/[.03] px-2 py-1.5">
            <div className="text-[10px] text-black/50">{m.label}</div>
            <div className="text-[12px] font-bold mt-0.5">{m.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 text-[12.5px] text-black/65 leading-relaxed">{note}</div>

      {ctaShow && (
        <div className="mt-4 flex items-baseline justify-between gap-3 flex-wrap rounded-lg bg-blue-50 border border-blue-200 px-4 py-3">
          <div>
            <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wide">PilaOS 대행</div>
            <div className="mt-1 text-[13px] font-bold text-black">{service}</div>
            <div className="text-[11px] text-black/60 mt-0.5">{price} · 결과 데이터 매주 보고</div>
          </div>
          <Link
            href={`/inquire?kind=manage_agency&channel=${encodeURIComponent(name)}&src=manage`}
            className="rounded-md bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white"
          >
            대행 요청 →
          </Link>
        </div>
      )}
    </div>
  );
}

function Compare({ them, us }: { them: string; us: string }) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-4">
      <div className="text-[11px] text-black/45 line-through">기존 SaaS — {them}</div>
      <div className="mt-1 text-[13px] font-extrabold text-black">PilaOS — {us}</div>
    </div>
  );
}
