import Link from "next/link";
import { redirect } from "next/navigation";
import { searchListings, summary, regionTree } from "@/lib/listings";
import { ListingCard } from "@/components/listing/ListingCard";
import { HeroIllustration } from "@/components/landing/HeroIllustration";
import { DisputeDonut } from "@/components/info/DonutChart";
import { RevenueBar } from "@/components/info/BarCompare";
import { DigitalRadar } from "@/components/info/RadarChart";
import { ProcessTimeline } from "@/components/info/Timeline";
import { CaseStudySection } from "@/components/landing/CaseStudy";
import { ExpertSection } from "@/components/landing/ExpertCard";
import { TestimonialSection } from "@/components/landing/Testimonial";

async function go(formData: FormData) {
  "use server";
  const q = String(formData.get("q") || "").trim();
  const sido = String(formData.get("sido") || "").trim();
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (sido) params.set("sido", sido);
  redirect(params.toString() ? `/listings?${params.toString()}` : "/listings");
}

export default function Home() {
  const featured = searchListings({}, "yield_desc", 3).rows;
  const s = summary();

  return (
    <div className="bg-white text-black">

      {/* 1. HERO */}
      <section className="mx-auto max-w-3xl px-5 pt-16 pb-10 sm:pt-24 sm:pb-12">
        <div className="mb-8 mx-auto max-w-md"><HeroIllustration /></div>
        <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">필라테스·요가 인수 자문 플랫폼</div>
        <h1 className="mt-5 text-[34px] sm:text-[56px] font-extrabold leading-[1.1] tracking-tight">
          필라오스와 함께라면,<br />
          <span className="text-blue-600">이 모든 과정이</span><br />
          <span className="text-blue-600">깔끔해집니다.</span>
        </h1>
        <p className="mt-7 text-[16px] sm:text-[18px] text-black/65 leading-relaxed">
          매물 찾기 · 가격 분석 · 매도자 컨택 · 변호사 마무리 · 1년 점검까지<br className="hidden sm:block" />
          처음부터 끝까지 운영팀 1명이 카톡 한 채널로 함께 갑니다.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-2 sm:gap-3">
          <Action href="/listings" title="매물 보러가기" desc={`${s.total.toLocaleString()}+곳`} primary />
          <Action href="/process" title="절차 보러가기" desc="5단계 어떻게" />
          <Action href="/pricing" title="비용 보러가기" desc="매수자 / 매도자" />
          <Action href="/inquire?kind=acquire" title="상담 신청" desc="휴대폰만" highlight />
        </div>
      </section>

      {/* 2. 신뢰 통계 */}
      <section className="border-t border-black/10 bg-black text-white">
        <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
          <div className="text-center">
            <div className="text-[11px] font-bold uppercase tracking-widest text-blue-400">이미 함께하는 분들</div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <Stat n={s.total.toLocaleString() + "+"} label="자동 발굴 매물" />
            <Stat n="1,200+" label="누적 상담 신청" />
            <Stat n="180+" label="권리금 분석 의뢰" />
          </div>
          <p className="mt-7 text-center text-[12px] text-white/60 leading-relaxed">
            카카오·네이버·점포라인·호호요가까지 매일 자동 동기화 · 상담 24시간 안 회신
          </p>
        </div>
      </section>

      {/* 3. 분쟁 도넛 (인포그래픽) */}
      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <div className="text-[11px] font-bold uppercase tracking-widest text-red-600">왜 우리가 필요한가</div>
          <h2 className="mt-3 text-[26px] sm:text-[32px] font-extrabold leading-tight tracking-tight">
            인수 후 <span className="text-red-600">실제로 일어나는 일</span>
          </h2>
          <div className="mt-8">
            <DisputeDonut />
          </div>
        </div>
      </section>

      {/* 4. 위험 6카드 */}
      <section className="border-t border-black/10 bg-black/[.02]">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <div className="text-[11px] font-bold uppercase tracking-widest text-red-600">분쟁 6 패턴</div>
          <h2 className="mt-3 text-[26px] sm:text-[32px] font-extrabold leading-tight tracking-tight">
            매수자가 <span className="text-red-600">미리 알 수 없는</span> 6가지
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Risk title="회원 환불 폭탄" hit="첫 달부터 환불 요청" detail="학원당 5천만~3억 잠재 빚을 인수자가 떠안습니다." />
            <Risk title="임대인이 갱신 거부" hit="권리금 줬는데 새 계약 X" detail="권리금 회수가 어려워집니다. 동의서 사전 체결 필수." />
            <Risk title="강사 단체 이탈" hit="인수했더니 빈 기구만" detail="강사가 인근 새 학원 오픈, 회원 그룹챗 이전." />
            <Risk title="실제 매출이 다름" hit='"월 8천"이 실제 4천' detail="POS·카드사 검증으로 진짜 매출 확인 필수." />
            <Risk title="세금 추징" hit="부가세 10% 폭탄" detail="포괄양수도 신고 누락 시 매매가 10% 추징." />
            <Risk title="기구 노후 발견" hit="추가 비용 3천만" detail="리포머·캐딜락 노후. 인수 후 발견 시 전체 교체." />
          </div>
        </div>
      </section>

      {/* 5. 매출 검증 막대 (인포그래픽) */}
      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">우리가 하는 일 ①</div>
          <h2 className="mt-3 text-[26px] sm:text-[32px] font-extrabold leading-tight tracking-tight">
            진짜 매출, <span className="text-blue-600">숫자로</span> 확인.
          </h2>
          <p className="mt-3 text-[15px] text-black/65 leading-relaxed">
            매도자가 보여주는 카톡 캡처는 누구나 만들 수 있습니다. 우리는 매도자가 받은 진짜 자료로 검증합니다.
          </p>
          <div className="mt-8">
            <RevenueBar />
          </div>
        </div>
      </section>

      {/* 6. 디지털 운영 점수 + 채널 */}
      <section className="border-t border-black/10 bg-black/[.02]">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">우리가 하는 일 ②</div>
          <h2 className="mt-3 text-[26px] sm:text-[32px] font-extrabold leading-tight tracking-tight">
            플레이스·SNS 운영을 <span className="text-blue-600">한 화면에서</span>
          </h2>
          <p className="mt-3 text-[15px] text-black/65 leading-relaxed">
            "이 학원이 온라인을 잘 운영하고 있나?" — 매수자가 가장 궁금한 항목을 한 점수로.
          </p>
          <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6">
            <DigitalRadar />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {["네이버 플레이스", "네이버 블로그", "카카오 플레이스", "카카오톡 채널", "인스타그램", "홈페이지·구글"].map((c) => (
              <div key={c} className="rounded-xl border border-black/10 bg-white px-3 py-2 text-center text-[12px] font-bold">{c}</div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. 5단계 + 타임라인 */}
      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">우리가 하는 일 ③</div>
          <h2 className="mt-3 text-[26px] sm:text-[32px] font-extrabold leading-tight tracking-tight">
            5단계로 <span className="text-blue-600">차근차근</span>
          </h2>
          <p className="mt-3 text-[15px] text-black/65 leading-relaxed">
            상담 → 가격 분석 → 실사 → 계약 → 1년 점검. 표준 6주 + 사후 1년.
          </p>
          <div className="mt-8 rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
            <ProcessTimeline />
          </div>
          <div className="mt-5 text-center">
            <Link href="/process" className="inline-block rounded-lg bg-black/5 px-5 py-2.5 text-sm font-bold text-black hover:bg-black/10">
              5단계 자세히 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* 8. 결과물 */}
      <section className="border-t border-black/10 bg-black/[.02]">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">받게 되는 것</div>
          <h2 className="mt-3 text-[26px] sm:text-[32px] font-extrabold leading-tight tracking-tight">
            의뢰하시면 <span className="text-blue-600">이런 게</span> 손에.
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Result n="01" title="진짜 매출 권리금 계산서" against="매도자 자랑이 진짜인지 모름" icon="doc" />
            <Result n="02" title="회원 환불 폭탄 방어 조항" against="첫 달 환불 5천만~3억" icon="shield" />
            <Result n="03" title="임대인 동의서 동시 체결" against="권리금 줬는데 임대 거부" icon="key" />
            <Result n="04" title="강사 잔류·경업금지 약정" against="인수 후 강사 단체 이탈" icon="users" />
            <Result n="05" title="포괄양수도 세무 처리" against="부가세 10% 추징" icon="tax" />
            <Result n="06" title="1년간 사후 점검 카톡" against="인수 후에도 모르는 분쟁" icon="bell" />
          </div>
        </div>
      </section>

      {/* 9. 케이스 스터디 */}
      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">실제 사례</div>
          <h2 className="mt-3 text-[26px] sm:text-[32px] font-extrabold leading-tight tracking-tight">
            먼저 인수하신 <span className="text-blue-600">분들의 이야기</span>
          </h2>
          <p className="mt-3 text-[15px] text-black/65 leading-relaxed">
            개인정보 보호를 위해 이름은 익명, 지역과 사실은 그대로.
          </p>
          <div className="mt-8">
            <CaseStudySection />
          </div>
        </div>
      </section>

      {/* 10. 변호사·세무사 */}
      <section className="border-t border-black/10 bg-black/[.02]">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">제휴 전문가</div>
          <h2 className="mt-3 text-[26px] sm:text-[32px] font-extrabold leading-tight tracking-tight">
            함께 하는 <span className="text-blue-600">법률·세무 전문가</span>
          </h2>
          <p className="mt-3 text-[15px] text-black/65 leading-relaxed">
            영업양수도·임대차·세무 전문 경력 5년 이상 검증된 분만 등재합니다.
          </p>
          <div className="mt-8">
            <ExpertSection />
          </div>
          <p className="mt-4 text-[11px] text-black/45 text-center">
            ※ 법률·세무 자문료는 의뢰인이 변호사·세무사에게 직접 결제합니다 (변호사법 제109조 준수). <Link href="/pricing/legal" className="text-blue-600 underline">자세히</Link>
          </p>
        </div>
      </section>

      {/* 11. 차별점 비교표 */}
      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">왜 다른가</div>
          <h2 className="mt-3 text-[26px] sm:text-[32px] font-extrabold leading-tight tracking-tight">
            매물만 던져주는 곳과는<br /><span className="text-blue-600">차원이 다릅니다.</span>
          </h2>
          <div className="mt-8 overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="text-left px-2 py-3 text-[12px] font-bold text-black/55">항목</th>
                  <th className="text-center px-2 py-3 text-[12px] font-bold text-black/55">호호요가</th>
                  <th className="text-center px-2 py-3 text-[12px] font-bold text-black/55">점포라인</th>
                  <th className="text-center px-2 py-3 text-[12px] font-bold text-blue-600">필라오스</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <CmpRow label="매출·POS 진성 검증" a="×" b="△" c="✓" />
                <CmpRow label="회원권 잠재 부채 산정" a="×" b="×" c="✓" />
                <CmpRow label="플레이스·SNS 운영 점검" a="×" b="×" c="✓" />
                <CmpRow label="강사 단체 이탈 방어" a="×" b="×" c="✓" />
                <CmpRow label="임대인 동의서 동시 체결" a="×" b="△" c="✓" />
                <CmpRow label="변호사·세무사 매칭" a="×" b="△" c="✓" />
                <CmpRow label="포괄양수도 세무 처리" a="×" b="×" c="✓" />
                <CmpRow label="인수 후 1년 점검" a="×" b="×" c="✓" />
              </tbody>
            </table>
          </div>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <Bad title="호호요가는 게시판입니다" desc="매도자가 글 한 개 올리면 끝. 매물 검증·거래 보호·분쟁 처리 인프라 없음." />
            <Bad title="점포라인은 일반 점포 중개" desc="필라테스·요가 도메인을 모릅니다. 회원권 부채·강사 이탈 같은 핵심 위험을 못 봐요." />
          </div>
        </div>
      </section>

      {/* 12. 매물 미리보기 */}
      <section className="border-t border-black/10 bg-black/[.02]">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <div className="text-[11px] font-bold uppercase tracking-widest text-black/55">미리보기</div>
          <h2 className="mt-3 text-[26px] sm:text-[32px] font-extrabold leading-tight tracking-tight">
            지금 등록된 매물 <span className="text-blue-600">일부</span>
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {featured.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
          <div className="mt-5 text-center">
            <Link href="/listings" className="inline-block rounded-lg bg-black px-7 py-3 text-sm font-bold text-white hover:bg-black/85">
              전체 {s.total.toLocaleString()}+곳 보러가기 →
            </Link>
          </div>
        </div>
      </section>

      {/* 13. 후기 */}
      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">한 줄 후기</div>
          <h2 className="mt-3 text-[26px] sm:text-[32px] font-extrabold leading-tight tracking-tight">
            짧게 <span className="text-blue-600">남기신 말씀들</span>
          </h2>
          <div className="mt-8">
            <TestimonialSection />
          </div>
        </div>
      </section>

      {/* 14. CTA */}
      <section className="border-t border-black/10 bg-blue-50">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20 text-center">
          <h2 className="text-[26px] sm:text-[32px] font-extrabold leading-tight tracking-tight">
            지금 시작하세요.
          </h2>
          <p className="mt-3 text-[15px] text-black/65">매수·매도·창업·폐업 어떤 상황이든 휴대폰 한 줄로 시작.</p>
          <Link href="/inquire" className="mt-8 inline-block rounded-lg bg-black px-10 py-4 text-base font-bold text-white hover:bg-black/85">
            상담 신청 →
          </Link>
          <p className="mt-5 text-[11px] text-black/45">매도자세요? <Link href="/inquire?kind=sell" className="underline underline-offset-2 hover:text-black">매물 등록도 무료</Link></p>
        </div>
      </section>
    </div>
  );
}

/* ── helpers ── */
function Action({ href, title, desc, primary, highlight }: { href: string; title: string; desc: string; primary?: boolean; highlight?: boolean }) {
  const cls = highlight
    ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
    : primary
      ? "bg-black text-white border-black hover:bg-black/85"
      : "bg-white text-black border-black/15 hover:bg-black/5";
  return (
    <Link href={href} className={`rounded-2xl border-2 px-5 py-5 sm:py-6 text-left transition ${cls}`}>
      <div className="text-[16px] sm:text-[18px] font-extrabold">{title}</div>
      <div className={`mt-1 text-[12px] sm:text-[13px] ${highlight ? "text-white/80" : primary ? "text-white/70" : "text-black/55"}`}>{desc}</div>
    </Link>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="text-[28px] sm:text-[40px] font-extrabold text-blue-400 leading-none">{n}</div>
      <div className="mt-1 text-[11px] text-white/65 leading-tight">{label}</div>
    </div>
  );
}

function Risk({ title, hit, detail }: { title: string; hit: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50/50 p-5">
      <div className="text-[15px] font-extrabold text-black">{title}</div>
      <div className="mt-1.5 text-[13px] font-bold text-red-700">{hit}</div>
      <p className="mt-2.5 text-[13px] text-black/70 leading-relaxed">{detail}</p>
    </div>
  );
}

function Result({ n, title, against, icon }: { n: string; title: string; against: string; icon: "doc" | "shield" | "key" | "users" | "tax" | "bell" }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <ResultIcon name={icon} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-extrabold text-blue-600">{n}</div>
          <h3 className="mt-1 text-[15px] font-extrabold text-black leading-snug">{title}</h3>
        </div>
      </div>
      <div className="mt-3 flex gap-2 items-baseline">
        <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-700 whitespace-nowrap">막아주는 위험</span>
        <span className="text-[12px] text-black/55">{against}</span>
      </div>
    </div>
  );
}

function ResultIcon({ name }: { name: "doc" | "shield" | "key" | "users" | "tax" | "bell" }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "doc": return <svg {...common}><path d="M14 2v6h6"/><path d="M20 22H4V2h10l6 6v14z"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="14" y2="17"/></svg>;
    case "shield": return <svg {...common}><path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z"/><path d="M9 12l2 2 4-4"/></svg>;
    case "key": return <svg {...common}><circle cx="8" cy="15" r="4"/><path d="M11 12l9-9"/><path d="M16 7l3 3"/></svg>;
    case "users": return <svg {...common}><circle cx="9" cy="9" r="3"/><path d="M3 19c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="11" r="2.5"/><path d="M14 19c0-2.5 1.5-4 3-4 2 0 4 1.5 4 4"/></svg>;
    case "tax": return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/></svg>;
    case "bell": return <svg {...common}><path d="M6 8a6 6 0 0112 0v5l2 3H4l2-3V8z"/><path d="M10 19a2 2 0 004 0"/></svg>;
  }
}

function CmpRow({ label, a, b, c }: { label: string; a: string; b: string; c: string }) {
  const cell = (v: string) => v === "✓" ? "text-blue-600 font-extrabold" : v === "△" ? "text-amber-600 font-bold" : "text-black/30";
  return (
    <tr className="border-b border-black/10">
      <td className="px-2 py-3 text-[13px] sm:text-[14px] text-black/85">{label}</td>
      <td className={`px-2 py-3 text-center text-base ${cell(a)}`}>{a}</td>
      <td className={`px-2 py-3 text-center text-base ${cell(b)}`}>{b}</td>
      <td className={`px-2 py-3 text-center text-base bg-blue-50/40 ${cell(c)}`}>{c}</td>
    </tr>
  );
}

function Bad({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50/40 p-4">
      <div className="text-[14px] font-extrabold text-red-700">{title}</div>
      <p className="mt-1.5 text-[12px] text-black/65 leading-relaxed">{desc}</p>
    </div>
  );
}
