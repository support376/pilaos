import Link from "next/link";
import { notFound } from "next/navigation";
import { getListing, sigunguMarketStats, similarListings } from "@/lib/listings";
import { fmtMan, confidenceLabel, confidenceColor } from "@/lib/estimate";
import { brandBySlug } from "@/lib/brands";
import { BadgeStack } from "@/components/listing/BadgeStack";
import { ListingCard } from "@/components/listing/ListingCard";
import { ConfidencePill } from "@/components/listing/ConfidencePill";
import { NDAGate } from "@/components/listing/NDAGate";

type Params = { params: Promise<{ id: string }> };

export default async function ListingPage({ params }: Params) {
  const { id } = await params;
  const l = getListing(id);
  if (!l) return notFound();
  const e = l.estimate;
  const s = l.studio;
  const brand = l.brand_slug ? brandBySlug(l.brand_slug) : null;
  const market = (l.sido && l.sigungu) ? sigunguMarketStats(l.sido, l.sigungu) : null;
  const similar = similarListings(l, 4);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-4 flex items-center gap-2 text-xs text-gray-500">
        <Link href="/listings" className="hover:text-gray-900">매물</Link>
        <span>/</span>
        {l.sigungu ? <Link href={`/listings?sigungu=${encodeURIComponent(l.sigungu)}`} className="hover:text-gray-900">{l.sigungu}</Link> : null}
        <span>/</span>
        <span className="text-gray-700">{l.id}</span>
      </div>

      {/* HERO */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-2 flex items-center gap-2">
          <BadgeStack badges={l.badges} />
          <span className="text-[11px] text-gray-400 font-mono">{l.id}</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{s.place_name}</h1>
        <p className="mt-1 text-sm text-gray-700">{l.title}</p>
        <p className="mt-1 text-xs text-gray-500">{l.dong ?? l.sigungu} · {l.floor} · 디지털 {l.digital_grade}급 ({l.digital_score}점) · 브랜드 {brand?.name ?? "—"}</p>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { label: "권리금", v: fmtMan(e.key_money.mid), s: `${fmtMan(e.key_money.low)}~${fmtMan(e.key_money.high)}` },
            { label: "월매출", v: fmtMan(e.monthly_revenue.mid), s: `${fmtMan(e.monthly_revenue.low)}~${fmtMan(e.monthly_revenue.high)}` },
            { label: "월순익", v: fmtMan(e.monthly_profit.mid), s: `${fmtMan(e.monthly_profit.low)}~${fmtMan(e.monthly_profit.high)}` },
            { label: "월수익률", v: `${e.monthly_yield_pct}%`, s: `연 ROI ${e.annual_roi_pct}%` },
            { label: "회수기간", v: e.payback_months_keyMoney >= 999 ? "—" : `${e.payback_months_keyMoney}개월`, s: `총투자 ${e.payback_months_total >= 999 ? "—" : e.payback_months_total + "개월"}` },
          ].map((it) => (
            <div key={it.label} className="rounded-lg bg-gray-50 px-3 py-2">
              <div className="text-[10px] uppercase text-gray-500">{it.label}</div>
              <div className="mt-0.5 text-lg font-bold text-gray-900">{it.v}</div>
              <div className="text-[10px] text-gray-400">{it.s}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <ConfidencePill level={e.confidence} />
          <span className="text-[11px] text-gray-500">신뢰도 {Math.round(e.confidence_score * 100)}%</span>
          <span className="text-[11px] text-gray-400">·</span>
          <span className="text-[11px] text-gray-500">멀티플 {e.multiple_used}x</span>
          <span className="text-[11px] text-gray-400">·</span>
          <span className="text-[11px] text-gray-500">매도 시그널 {e.sell_signal_score}/100</span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link href={`/buy/intent?listing=${encodeURIComponent(l.id)}`} className="rounded-md bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-gray-700">매수 의향 등록</Link>
          <Link href={`/sell/new?listing=${encodeURIComponent(l.id)}`} className="rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-900 hover:bg-amber-100">이 매물 주인입니다</Link>
          <Link href={`/calc?listing=${encodeURIComponent(l.id)}`} className="rounded-md border px-4 py-2 text-sm font-bold text-gray-800 hover:bg-gray-50">수익률 계산기</Link>
          <Link href={`/compare?ids=${encodeURIComponent(l.id)}`} className="rounded-md border px-4 py-2 text-sm font-bold text-gray-800 hover:bg-gray-50">비교 추가</Link>
        </div>

        <div className="mt-3 text-[11px] text-gray-500">조회 {l.view_count.toLocaleString()} · 찜 {l.fav_count} · 매수자 대기 <strong className="text-rose-600">{l.buyer_intent_count}명</strong></div>
      </section>

      {/* 위치 & 상권 */}
      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-bold">위치 & 상권</h2>
        <p className="mt-1 text-xs text-gray-500">정확 주소는 NDA 후 공개. 동까지만 노출.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-gray-50 p-4 text-sm">
            <div className="text-xs text-gray-500">지역</div>
            <div className="mt-1 font-medium">{l.sido} {l.sigungu} {l.dong ?? ""}</div>
            <div className="mt-2 text-xs text-gray-500">좌표 {l.lat.toFixed(4)}, {l.lng.toFixed(4)}</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 text-sm">
            <div className="text-xs text-gray-500">시설</div>
            <div className="mt-1 font-medium">{l.area_pyeong}평 · {l.floor}</div>
            <div className="mt-2 flex flex-wrap gap-1 text-xs text-gray-700">
              {l.has_shower ? <span className="rounded bg-white px-2 py-0.5">샤워</span> : null}
              {l.has_parking ? <span className="rounded bg-white px-2 py-0.5">주차</span> : null}
              {l.has_sauna ? <span className="rounded bg-white px-2 py-0.5">사우나</span> : null}
              {l.has_flying ? <span className="rounded bg-white px-2 py-0.5">플라잉</span> : null}
              {l.has_barre ? <span className="rounded bg-white px-2 py-0.5">바레</span> : null}
            </div>
          </div>
        </div>
      </section>

      {/* 시설 & 장비 */}
      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-bold">시설 & 장비</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="리포머" v={`${l.reformer_count}대`} />
          <Stat label="그룹룸" v={`${l.group_room}개`} />
          <Stat label="개인룸" v={`${l.private_room}개`} />
          <Stat label="브랜드" v={brand?.name ?? "—"} />
        </div>
      </section>

      {/* 숫자 검증 */}
      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-bold">숫자 검증</h2>
        <p className="mt-1 text-xs text-gray-500">pilaos 추정 vs 매도자 신고 vs 검증 결과를 함께 노출. 차이가 클수록 실사 우선순위.</p>
        <table className="mt-4 w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>
              <th className="px-3 py-2 text-left">지표</th>
              <th className="px-3 py-2 text-right">low</th>
              <th className="px-3 py-2 text-right">mid</th>
              <th className="px-3 py-2 text-right">high</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              ["월매출", e.monthly_revenue],
              ["월순익", e.monthly_profit],
              ["권리금", e.key_money],
              ["보증금", e.deposit],
              ["월세", e.monthly_rent],
              ["활성 회원수(명)", e.member_count],
              ["총 인수가", e.total_acquisition],
            ].map(([k, r]) => {
              const range = r as typeof e.key_money;
              const isMember = (k as string).includes("회원");
              const f = (n: number) => isMember ? `${n.toLocaleString()}명` : fmtMan(n);
              return (
                <tr key={k as string}>
                  <td className="px-3 py-2 font-medium text-gray-700">{k as string}</td>
                  <td className="px-3 py-2 text-right text-gray-500">{f(range.low)}</td>
                  <td className="px-3 py-2 text-right font-bold text-gray-900">{f(range.mid)}</td>
                  <td className="px-3 py-2 text-right text-gray-500">{f(range.high)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="mt-4">
          <NDAGate listingId={l.id}>
            매출장·임대차계약·회원명단·재등록률 그래프는 NDA 서명 후 매수자에게만 공개.
          </NDAGate>
        </div>
      </section>

      {/* 디지털 자산 */}
      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-bold">디지털 자산</h2>
        <p className="mt-1 text-xs text-gray-500">현재 노출 점수 {l.digital_score}/90 · 등급 {l.digital_grade}</p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
          <Asset label="네이버 플레이스" url={s.naver_url} />
          <Asset label="홈페이지" url={s.homepage_url} />
          <Asset label="인스타그램" url={s.instagram_handle ? `https://instagram.com/${s.instagram_handle}` : null} text={s.instagram_handle ? `@${s.instagram_handle}` : null} />
          <Asset label="네이버 블로그" url={s.naver_blog_handle ? `https://blog.naver.com/${s.naver_blog_handle}` : null} text={s.naver_blog_handle ?? null} />
          <Asset label="카카오톡 채널" url={s.kakao_channel_url} text={s.kakao_channel_name} />
          <Asset label="카카오 플레이스" url={s.place_url} />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
          <Mini label="카카오 리뷰" v={s.kakao_review_count ?? 0} sub={s.kakao_review_score?.toFixed(1) ?? "—"} />
          <Mini label="블로그 리뷰" v={s.blog_review_count ?? 0} />
          <Mini label="메뉴 등록" v={s.menu_count ?? 0} />
        </div>
      </section>

      {/* 시군구 시세 */}
      {market ? (
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-bold">{l.sigungu} 시세 비교</h2>
          <p className="mt-1 text-xs text-gray-500">동일 시군구 {market.n}개 매물 분포 (p25 / p50 / p75)</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Compare label="권리금" mid={e.key_money.mid} p25={market.key_p25} p50={market.key_p50} p75={market.key_p75} fmt={fmtMan} />
            <Compare label="월매출" mid={e.monthly_revenue.mid} p25={market.rev_p25} p50={market.rev_p50} p75={market.rev_p75} fmt={fmtMan} />
            <Compare label="월수익률" mid={e.monthly_yield_pct} p25={market.yield_p25} p50={market.yield_p50} p75={market.yield_p75} fmt={(n) => `${n}%`} />
          </div>
        </section>
      ) : null}

      {/* 실사 워크룸 placeholder */}
      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-bold">실사 · 인증 상태</h2>
        <ul className="mt-3 space-y-1.5 text-sm">
          <Check label="원장 본인확인" done={l.status !== "cold"} />
          <Check label="휴대폰·사업자번호 매칭" done={false} />
          <Check label="현장 실사 완료" done={l.badges.includes("verified")} />
          <Check label="변호사 1차 법률검토" done={false} />
        </ul>
        <p className="mt-3 text-[11px] text-gray-500">실사 패키지 의뢰 시 변호사 동반 1회 방문 + 매출장·계약·회원명단 검증 진행.</p>
      </section>

      {/* 유사 매물 */}
      {similar.length > 0 ? (
        <section className="mt-6">
          <h2 className="mb-3 text-lg font-bold">비슷한 매물</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {similar.map((x) => <ListingCard key={x.id} listing={x} />)}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function Stat({ label, v }: { label: string; v: string }) {
  return (
    <div className="rounded-lg bg-gray-50 px-3 py-2">
      <div className="text-[10px] uppercase text-gray-500">{label}</div>
      <div className="mt-0.5 text-base font-bold text-gray-900">{v}</div>
    </div>
  );
}

function Asset({ label, url, text }: { label: string; url: string | null; text?: string | null }) {
  if (!url) return (
    <div className="rounded-lg bg-gray-50 px-3 py-2">
      <div className="text-[10px] uppercase text-gray-500">{label}</div>
      <div className="mt-0.5 text-xs text-gray-400">미등록</div>
    </div>
  );
  return (
    <a href={url} target="_blank" rel="noreferrer" className="rounded-lg bg-emerald-50 px-3 py-2 hover:bg-emerald-100">
      <div className="text-[10px] uppercase text-emerald-700">{label}</div>
      <div className="mt-0.5 truncate text-xs text-emerald-900 underline">{text ?? "열기 →"}</div>
    </a>
  );
}

function Mini({ label, v, sub }: { label: string; v: number; sub?: string }) {
  return (
    <div className="rounded bg-gray-50 px-3 py-2">
      <div className="text-[10px] text-gray-500">{label}</div>
      <div className="mt-0.5 text-sm font-bold text-gray-900">{v.toLocaleString()} {sub ? <span className="text-[10px] text-gray-400">★ {sub}</span> : null}</div>
    </div>
  );
}

function Compare({ label, mid, p25, p50, p75, fmt }: { label: string; mid: number; p25: number; p50: number; p75: number; fmt: (n: number) => string }) {
  const cmp = mid >= p75 ? "상위" : mid >= p50 ? "중상" : mid >= p25 ? "중하" : "하위";
  return (
    <div className="rounded-lg bg-gray-50 p-3 text-sm">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 font-bold">{fmt(mid)} <span className="ml-1 text-[10px] font-medium text-gray-500">{cmp}</span></div>
      <div className="mt-2 text-[11px] text-gray-500">p25 {fmt(p25)} · p50 {fmt(p50)} · p75 {fmt(p75)}</div>
    </div>
  );
}

function Check({ label, done }: { label: string; done: boolean }) {
  return (
    <li className="flex items-center gap-2">
      <span className={`flex h-5 w-5 items-center justify-center rounded-full ${done ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-500"} text-[10px]`}>{done ? "✓" : ""}</span>
      <span className={done ? "text-gray-900" : "text-gray-500"}>{label}</span>
    </li>
  );
}

export async function generateMetadata({ params }: Params) {
  const { id } = await params;
  const l = getListing(id);
  if (!l) return { title: "매물을 찾을 수 없습니다" };
  return {
    title: `${l.studio.place_name} · ${l.sigungu ?? ""} · 권리금 ${fmtMan(l.estimate.key_money.mid)}`,
    description: `${l.title} · 월수익률 ${l.estimate.monthly_yield_pct}% · 회수 ${l.estimate.payback_months_keyMoney}개월 · 디지털 ${l.digital_grade}급`,
  };
}
