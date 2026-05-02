import Link from "next/link";
import { redirect } from "next/navigation";
import { searchListings, summary, regionTree } from "@/lib/listings";
import { ListingCard } from "@/components/listing/ListingCard";
import { RegionSelect } from "@/components/listing/RegionSelect";

async function go(formData: FormData) {
  "use server";
  const q = String(formData.get("q") || "").trim();
  const sido = String(formData.get("sido") || "").trim();
  const sigungu = String(formData.get("sigungu") || "").trim();
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (sido) params.set("sido", sido);
  if (sigungu) params.set("sigungu", sigungu);
  redirect(params.toString() ? `/listings?${params.toString()}` : "/listings");
}

export default function Home() {
  const tree = regionTree();
  const featured = searchListings({}, "yield_desc", 3).rows;
  const s = summary();

  return (
    <div className="bg-white text-black">

      {/* HERO — 슬로건 + 4 액션 */}
      <section className="mx-auto max-w-3xl px-5 pt-16 pb-10 sm:pt-24 sm:pb-16">
        <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">필라테스·요가 인수 자문 플랫폼</div>
        <h1 className="mt-5 text-[34px] sm:text-[56px] font-extrabold leading-[1.1] tracking-tight">
          필라오스와 함께라면,<br />
          <span className="text-blue-600">이 모든 과정이</span><br />
          <span className="text-blue-600">깔끔해집니다.</span>
        </h1>
        <p className="mt-7 text-[16px] sm:text-[18px] text-black/65 leading-relaxed">
          매물 찾기, 가격 분석, 매도자 컨택, 변호사 마무리, 1년 점검까지<br className="hidden sm:block" />
          처음부터 끝까지 운영팀이 사람 1명으로 함께 갑니다.
        </p>

        {/* 4 액션 버튼 */}
        <div className="mt-10 grid grid-cols-2 gap-2 sm:gap-3">
          <Action href="/listings" title="매물 보러가기" desc={`${s.total.toLocaleString()}+곳`} primary />
          <Action href="/process" title="절차 보러가기" desc="5단계 어떻게" />
          <Action href="/pricing" title="비용 보러가기" desc="매수자 / 매도자" />
          <Action href="/inquire?kind=acquire" title="상담 신청" desc="휴대폰만" highlight />
        </div>
        <p className="mt-5 text-xs text-black/50">상담은 무료. 24시간 안에 카톡 연락.</p>
      </section>

      {/* 1. 차별점 비교표 */}
      <section className="border-t border-black/10 bg-black/[.02]">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">왜 필라오스인가</div>
          <h2 className="mt-3 text-[26px] sm:text-[32px] font-extrabold leading-tight tracking-tight">
            매물만 던져주는 곳과는<br /><span className="text-blue-600">차원이 다릅니다.</span>
          </h2>
          <p className="mt-3 text-[15px] text-black/65 leading-relaxed">
            필라테스·요가 인수만 다루는 전문 운영팀이 처음부터 끝까지 함께합니다.
          </p>

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
            <Bad title="호호요가는 게시판입니다" desc="매도자가 글 한 개 올리면 끝. 매물 검증·거래 보호·분쟁 처리 인프라가 없어요." />
            <Bad title="점포라인은 일반 점포 중개" desc="필라테스·요가 도메인을 모릅니다. 회원권 부채, 강사 이탈 같은 핵심 위험을 못 봐요." />
          </div>
        </div>
      </section>

      {/* 2. 운영현황 통합 점검 - 도메인 차별점 */}
      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">우리만의 도구</div>
          <h2 className="mt-3 text-[26px] sm:text-[32px] font-extrabold leading-tight tracking-tight">
            플레이스·SNS 운영 현황을<br /><span className="text-blue-600">한 화면에서</span>
          </h2>
          <p className="mt-3 text-[15px] text-black/65 leading-relaxed">
            매수자분이 매물을 평가할 때 가장 궁금한 것 — "이 학원이 온라인을 잘 운영하고 있나?"
          </p>

          <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <Channel name="네이버 플레이스" />
            <Channel name="네이버 블로그" />
            <Channel name="카카오 플레이스" />
            <Channel name="카카오톡 채널" />
            <Channel name="인스타그램" />
            <Channel name="홈페이지·구글" />
          </div>

          <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50/50 p-5">
            <div className="text-[15px] font-bold text-blue-900">디지털 운영 점수</div>
            <p className="mt-2 text-[13px] text-blue-900/80 leading-relaxed">
              6개 채널 운영 여부 + 리뷰 수 + 게시물 수 + 응답률을 종합해 0~100점으로 표시. 매수자분이 매물 페이지에서 한 눈에.
            </p>
          </div>
        </div>
      </section>

      {/* 3. 위험 6카드 */}
      <section className="border-t border-black/10 bg-black/[.02]">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <div className="text-[11px] font-bold uppercase tracking-widest text-red-600">왜 우리가 필요한가</div>
          <h2 className="mt-3 text-[26px] sm:text-[32px] font-extrabold leading-tight tracking-tight">
            인수 후 <span className="text-red-600">실제로 일어나는 일</span>
          </h2>
          <p className="mt-3 text-[15px] text-black/65 leading-relaxed">학원 100곳 인수하면 30곳은 6개월 안에 분쟁. 우리는 이 6가지를 사전에 막아드립니다.</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Risk title="회원 환불 폭탄" hit="첫 달부터 환불 요청" detail="학원당 5천만~3억 잠재 빚. 인수자가 떠안습니다." />
            <Risk title="임대인이 갱신 거부" hit="권리금 지불 후 새 계약 X" detail="권리금 회수 어려움. 동의서 사전 체결 필수." />
            <Risk title="강사 단체 이탈" hit="인수했더니 빈 기구만" detail="강사가 인근 새 학원 오픈, 회원 그룹챗 이전." />
            <Risk title="실제 매출이 다름" hit='"월 8천"이 실제 4천' detail="카톡 캡처는 누구나. POS·카드사 검증 필수." />
            <Risk title="세금 추징" hit="부가세 10% 폭탄" detail="포괄양수도 신고 누락 시 매매가 10% 추징." />
            <Risk title="기구 노후 발견" hit="추가 비용 3천만" detail="리포머·캐딜락 노후. 인수 후 발견 시 전체 교체." />
          </div>
        </div>
      </section>

      {/* 4. 가로 5단계 */}
      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">우리는 이렇게 해드립니다</div>
          <h2 className="mt-3 text-[26px] sm:text-[32px] font-extrabold leading-tight tracking-tight">
            5단계로 <span className="text-blue-600">차근차근</span>
          </h2>
          <p className="mt-3 text-[15px] text-black/65 leading-relaxed">각 단계마다 결과물이 있고, 그만 두실 수 있습니다.</p>

          <div className="mt-8 -mx-5 overflow-x-auto px-5 sm:mx-0 sm:overflow-visible sm:px-0">
            <div className="flex gap-2 min-w-max sm:min-w-0 sm:grid sm:grid-cols-5">
              <Step n={0} name="매물 찾기" desc="상담 신청" />
              <StepArrow />
              <Step n={1} name="가격 분석" desc="권리금 계산서" />
              <StepArrow />
              <Step n={2} name="실사 검토" desc="진짜 자료 확인" />
              <StepArrow />
              <Step n={3} name="계약·잔금" desc="변호사 마무리" />
              <StepArrow />
              <Step n={4} name="1년 점검" desc="사후 운영 챙김" />
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/process" className="inline-block rounded-lg bg-black/5 px-5 py-2.5 text-sm font-bold text-black hover:bg-black/10">
              5단계 자세히 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* 5. 결과물 */}
      <section className="border-t border-black/10 bg-black/[.02]">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">받게 되는 것</div>
          <h2 className="mt-3 text-[26px] sm:text-[32px] font-extrabold leading-tight tracking-tight">
            의뢰하시면 <span className="text-blue-600">이런 게</span> 손에.
          </h2>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Result n="01" title="진짜 매출 권리금 계산서" against="매도자 자랑이 진짜인지 모름" />
            <Result n="02" title="회원 환불 폭탄 방어 조항" against="첫 달 환불 5천만~3억" />
            <Result n="03" title="임대인 동의서 동시 체결" against="권리금 줬는데 임대 거부" />
            <Result n="04" title="강사 잔류·경업금지 약정" against="인수 후 강사 단체 이탈" />
            <Result n="05" title="포괄양수도 세무 처리" against="부가세 10% 추징" />
            <Result n="06" title="1년간 사후 점검 카톡" against="인수 후에도 모르는 분쟁" />
          </div>
        </div>
      </section>

      {/* 6. 사회적 증거 */}
      <section className="border-t border-black/10 bg-black text-white">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-16 text-center">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-400">이미 함께하는 분들</div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <Stat n={s.total.toLocaleString() + "+"} label="자동 발굴 매물" />
            <Stat n="1,200+" label="누적 상담 신청" />
            <Stat n="180+" label="권리금 분석" />
          </div>
          <p className="mt-8 text-sm text-white/65 leading-relaxed">
            전국 필라테스·요가 학원을 매일 자동 업데이트.<br />
            카카오·네이버·점포라인·호호요가 매물까지 한 화면에.
          </p>
        </div>
      </section>

      {/* 7. 매물 요약 */}
      <section className="border-t border-black/10 bg-white">
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

      {/* CTA */}
      <section className="border-t border-black/10 bg-blue-50">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20 text-center">
          <h2 className="text-[26px] sm:text-[32px] font-extrabold leading-tight tracking-tight">
            지금 시작하세요.
          </h2>
          <p className="mt-3 text-[15px] text-black/65">매수·매도·창업·폐업 어떤 상황이든 휴대폰 한 줄로 시작.</p>

          <Link href="/inquire?kind=acquire" className="mt-8 inline-block rounded-lg bg-black px-10 py-4 text-base font-bold text-white hover:bg-black/85">
            상담 신청 →
          </Link>
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
function Channel({ name }: { name: string }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white px-4 py-3 text-center text-[13px] font-bold">{name}</div>
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
function Step({ n, name, desc }: { n: number; name: string; desc: string }) {
  return (
    <div className="flex flex-col items-center text-center w-[110px] sm:w-auto">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-base font-extrabold text-white">{n}</div>
      <div className="mt-2 text-[13px] font-extrabold text-black">{name}</div>
      <div className="mt-1 text-[11px] text-black/55 leading-tight">{desc}</div>
    </div>
  );
}
function StepArrow() {
  return (
    <div className="flex items-center justify-center pt-5 text-black/30">
      <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
        <path d="M1 7H18M18 7L12 1M18 7L12 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
function Result({ n, title, against }: { n: string; title: string; against: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-[11px] font-extrabold text-blue-600">{n}</div>
      <h3 className="mt-2 text-[15px] font-extrabold text-black">{title}</h3>
      <div className="mt-3 flex gap-2 items-baseline">
        <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-700 whitespace-nowrap">막아주는 위험</span>
        <span className="text-[12px] text-black/55">{against}</span>
      </div>
    </div>
  );
}
function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="text-[26px] sm:text-[36px] font-extrabold text-blue-400">{n}</div>
      <div className="mt-1 text-[11px] text-white/65 leading-tight">{label}</div>
    </div>
  );
}
