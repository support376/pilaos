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
  const featured = searchListings({}, "yield_desc", 4).rows;
  const s = summary();

  return (
    <div className="bg-white text-black">

      {/* HERO — 슬로건 */}
      <section className="mx-auto max-w-2xl px-5 pt-14 pb-12 sm:pt-24 sm:pb-16">
        <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">필라테스·요가 인수 자문</div>
        <h1 className="mt-4 text-[32px] sm:text-[48px] font-extrabold leading-[1.15] tracking-tight">
          필라오스와 함께라면,<br />
          <span className="text-blue-600">이 모든 과정이 깔끔해집니다.</span>
        </h1>
        <p className="mt-6 text-[16px] sm:text-[18px] text-black/65 leading-relaxed">
          매물 찾기, 권리금 산정, 매도자 컨택, 변호사 마무리까지 — <br className="hidden sm:block" />
          처음부터 끝까지 운영팀이 옆에서 함께 갑니다.
        </p>
        <div className="mt-8 flex flex-col gap-2 sm:flex-row">
          <Link href="/listings" className="rounded-lg bg-black px-7 py-4 text-center text-[16px] font-bold text-white hover:bg-black/85">
            매물 보러가기 →
          </Link>
          <Link href="/inquire?kind=acquire" className="rounded-lg border-2 border-black bg-white px-7 py-4 text-center text-[16px] font-bold text-black hover:bg-black hover:text-white">
            의뢰하기 →
          </Link>
        </div>
        <p className="mt-4 text-xs text-black/50">상담은 무료, 휴대폰만 남기시면 24시간 안에 카톡.</p>
      </section>

      {/* 1. 위험 6카드 + 해석 */}
      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-2xl px-5 py-14 sm:py-20">
          <div className="text-[11px] font-bold uppercase tracking-widest text-red-600">혼자 사면 위험합니다</div>
          <h2 className="mt-3 text-[26px] sm:text-[32px] font-extrabold leading-tight tracking-tight">
            인수 후 <span className="text-red-600">실제로 일어나는 일</span>
          </h2>
          <p className="mt-3 text-[15px] text-black/65 leading-relaxed">학원 100곳을 사면 30곳은 6개월 안에 분쟁이 생깁니다.</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Risk
              title="회원 환불 폭탄"
              hit="인수 첫 달부터 환불 요청"
              detail="기존 회원이 미사용 회원권 환불을 요구합니다. 학원당 5천만~3억 빚을 인수자가 떠안습니다."
            />
            <Risk
              title="임대인이 갱신 거부"
              hit="권리금 줬는데 새 계약 안 해줌"
              detail="권리금 1억을 지불했지만 임대인이 보증금 인상이나 신규 계약을 거부하면 회수가 어렵습니다."
            />
            <Risk
              title="강사가 단체로 그만둠"
              hit="인수했더니 빈 기구만"
              detail="인수 즉시 강사들이 인근에 새 학원을 열고, 회원을 그룹챗으로 데려갑니다."
            />
            <Risk
              title="실제 매출이 다름"
              hit='"월 8천"이 실제 4천'
              detail="매도자가 보여주는 카톡 캡처는 누구나 만들 수 있습니다. 진짜 매출 검증이 필수입니다."
            />
            <Risk
              title="세금 추징"
              hit="부가세 10% 폭탄"
              detail="포괄양수도 신고를 빠뜨리면 매매가의 10%를 부가세로 추징당합니다."
            />
            <Risk
              title="기구 노후"
              hit="추가 비용 3천만"
              detail="리포머 스프링·프레임 노후가 인수 후 발견되면 전체 교체가 필요합니다."
            />
          </div>

          <div className="mt-6 rounded-2xl bg-red-50 border border-red-200 p-5">
            <p className="text-sm text-red-900 leading-relaxed">
              <strong>이 6가지 중 4가지는</strong> 매수자가 인수 전에 절대 알 수 없는 항목입니다.
              그래서 우리가 미리 점검해드립니다.
            </p>
          </div>
        </div>
      </section>

      {/* 2. 가로 5단계 절차 */}
      <section className="border-t border-black/10 bg-black/[.02]">
        <div className="mx-auto max-w-2xl px-5 py-14 sm:py-20">
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

      {/* 3. 결과물 (80% 받는 것) */}
      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-2xl px-5 py-14 sm:py-20">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">받게 되는 것</div>
          <h2 className="mt-3 text-[26px] sm:text-[32px] font-extrabold leading-tight tracking-tight">
            의뢰하시면 <span className="text-blue-600">이런 게</span> 손에 들어옵니다.
          </h2>

          <div className="mt-8 space-y-3">
            <Result
              n="01"
              title="진짜 매출이 적힌 권리금 계산서"
              desc='"월 8천 매출"이 진짜인지 POS·카드사·세금계산서로 확인해 보고서로. 적정 권리금 ± 10% 제시.'
              against="매도자 자랑이 진짜인지 모르는 문제"
            />
            <Result
              n="02"
              title="회원 환불 폭탄 막는 방어 조항"
              desc="인수 후 회원 환불을 매도자가 책임지는 표준 계약 조항. 변호사가 직접 작성."
              against="인수 첫 달 환불 폭탄 5천만~3억"
            />
            <Result
              n="03"
              title="임대인 동의서 동시 체결"
              desc="권리금 지불 전에 임대인 도장을 미리. 갱신 거부 위험 사전 차단."
              against="권리금 줬는데 임대 거부당하는 케이스"
            />
            <Result
              n="04"
              title="강사 잔류 약속 + 경업금지 약정"
              desc="핵심 강사 위약금 200% 반환 조항. 인근 1~2km 1년 경쟁금지."
              against="인수했더니 강사 단체 이탈"
            />
            <Result
              n="05"
              title="포괄양수도 세무 처리"
              desc="제휴 세무사가 부가세 10% 추징 차단 + 양도소득세 정확히 처리."
              against="세금 추징 폭탄"
            />
            <Result
              n="06"
              title="1년간 사후 점검 카톡"
              desc="3·6·12개월에 운영팀이 회원·매출·강사·임대·세금 점검을 무료로."
              against="인수 후에도 모르는 분쟁"
            />
          </div>

          <div className="mt-6 rounded-xl bg-blue-50 border border-blue-200 p-5">
            <p className="text-sm text-blue-900 leading-relaxed">
              <strong>왜 이게 가능한가요?</strong><br />
              필라테스·요가 인수만 다루는 전문 운영팀 + 제휴 변호사·세무사 디렉토리. 매수자 한 분에게 운영팀 1명이 카톡으로 끝까지 담당합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 4. 사회적 증거 */}
      <section className="border-t border-black/10 bg-black text-white">
        <div className="mx-auto max-w-2xl px-5 py-14 sm:py-16 text-center">
          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-400">이미 많은 분이 함께하고 있어요</div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <Stat n={s.total.toLocaleString()} label="자동 발굴 매물" />
            <Stat n="1,200+" label="누적 상담 신청" />
            <Stat n="180+" label="권리금 분석 의뢰" />
          </div>
          <p className="mt-8 text-sm text-white/70 leading-relaxed">
            전국 필라테스·요가 학원 데이터를 매일 자동 업데이트.<br />
            카카오·네이버·점포라인·호호요가 매물까지 한 화면에.
          </p>
        </div>
      </section>

      {/* 5. 매물 검색 + 추천 */}
      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-2xl px-5 py-14 sm:py-20">
          <div className="text-[11px] font-bold uppercase tracking-widest text-black/55">매물 둘러보기</div>
          <h2 className="mt-3 text-[26px] sm:text-[32px] font-extrabold leading-tight tracking-tight">
            지금 등록된 <span className="text-blue-600">{s.total.toLocaleString()}+곳</span>
          </h2>
          <p className="mt-3 text-[15px] text-black/65 leading-relaxed">지역·가격대로 검색하시거나, 추천 매물을 둘러보세요.</p>

          <form action={go} className="mt-6 space-y-2 rounded-xl border border-black/15 bg-white p-3">
            <input
              name="q" type="text" placeholder="상호 · 동 · 주소"
              className="w-full rounded-lg border border-black/15 bg-black/[.03] px-4 py-3 text-[16px] focus:bg-white focus:border-black focus:outline-none"
            />
            <RegionSelect metros={tree.metros} dos={tree.dos} />
            <button className="w-full rounded-lg bg-black px-4 py-3 text-[16px] font-bold text-white hover:bg-black/85">매물 검색</button>
          </form>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {featured.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
          <div className="mt-4 text-center">
            <Link href="/listings" className="text-sm text-black/55 underline underline-offset-4 hover:text-black">전체 매물 보기 →</Link>
          </div>
        </div>
      </section>

      {/* CTA — 두 개 */}
      <section className="border-t border-black/10 bg-blue-50">
        <div className="mx-auto max-w-2xl px-5 py-14 sm:py-20">
          <h2 className="text-[26px] sm:text-[32px] font-extrabold leading-tight tracking-tight text-center">
            지금 시작하세요.
          </h2>
          <p className="mt-3 text-center text-[15px] text-black/65">매물부터 둘러보셔도 좋고, 바로 의뢰하셔도 좋아요.</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link href="/listings" className="group rounded-2xl border-2 border-black bg-white p-6 hover:bg-black hover:text-white transition">
              <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600 group-hover:text-blue-300">둘러보기</div>
              <div className="mt-2 text-xl font-extrabold">매물 보러가기 →</div>
              <div className="mt-2 text-sm text-black/65 group-hover:text-white/75">전국 {s.total.toLocaleString()}+곳에서 마음에 드는 매물 찾기</div>
            </Link>
            <Link href="/inquire?kind=acquire" className="group rounded-2xl bg-black p-6 text-white hover:bg-blue-600 transition">
              <div className="text-[11px] font-bold uppercase tracking-widest text-blue-300 group-hover:text-blue-100">의뢰하기</div>
              <div className="mt-2 text-xl font-extrabold">상담 신청하기 →</div>
              <div className="mt-2 text-sm text-white/75 group-hover:text-white/90">휴대폰만 남기시면 운영팀이 24시간 안에 카톡 드림</div>
            </Link>
          </div>

          <p className="mt-6 text-center text-xs text-black/50">
            매도자세요? <Link href="/inquire?kind=sell" className="underline underline-offset-2 hover:text-black">매물 등록도 무료</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

/* ── helpers ── */
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
    <div className="flex flex-col items-center text-center w-[120px] sm:w-auto">
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

function Result({ n, title, desc, against }: { n: string; title: string; desc: string; against: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex items-start gap-3">
        <div className="text-[11px] font-extrabold text-blue-600 flex-shrink-0 pt-1">{n}</div>
        <div className="flex-1">
          <h3 className="text-[15px] font-extrabold text-black">{title}</h3>
          <p className="mt-2 text-[13px] text-black/70 leading-relaxed">{desc}</p>
          <div className="mt-3 flex gap-2 items-baseline">
            <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-bold text-red-700 whitespace-nowrap">막아주는 위험</span>
            <span className="text-[12px] text-black/55">{against}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="text-[28px] sm:text-[36px] font-extrabold text-blue-400">{n}</div>
      <div className="mt-1 text-[12px] text-white/65 leading-tight">{label}</div>
    </div>
  );
}
