import Link from "next/link";
import { redirect } from "next/navigation";
import { searchListings, summary, regionTree } from "@/lib/listings";
import { ListingCard } from "@/components/listing/ListingCard";
import { RegionSelect } from "@/components/listing/RegionSelect";
import { QuickIntentForm } from "@/components/listing/QuickIntentForm";

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
    <div className="bg-stone-50 text-stone-900">

      {/* ───────── S1 HERO — 이성시장 비유 ───────── */}
      <section className="mx-auto max-w-2xl px-5 pt-14 pb-10 sm:pt-20 sm:pb-12">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-700">
          필라테스·요가 선생님께
        </div>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          좋은 매물은<br />
          <span className="bg-gradient-to-b from-transparent from-60% to-amber-100 to-60% px-1">먼저 잡아야 합니다.</span>
        </h1>
        <p className="mt-5 text-base text-stone-600 sm:text-lg leading-relaxed">
          선생님이라면 좋은 매물이 어디 있는지 모르실 리 없잖아요.<br />
          문제는 <strong className="text-stone-900">매도 의향 빨리 파악</strong>하기,<br className="sm:hidden"/> <strong className="text-stone-900">진짜 숫자 검증</strong>하기, <strong className="text-stone-900">자금 일으키기</strong>.
        </p>
        <p className="mt-4 text-base text-stone-900 font-bold sm:text-lg">
          그걸 우리가 대신해드립니다. 휴대폰 번호만 남겨주세요.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/inquire?kind=acquire" className="rounded-xl bg-stone-900 px-7 py-4 text-base font-bold text-white hover:bg-stone-700">
            무료 상담 신청 →
          </Link>
          <Link href="/listings" className="rounded-xl border border-stone-300 bg-white px-7 py-4 text-base font-semibold hover:bg-stone-50">
            매물 둘러보기
          </Link>
        </div>
        <p className="mt-4 text-xs text-stone-500">24시간 내 운영팀이 카톡으로 인사드립니다 · 비용 이야기는 그 다음에</p>
      </section>

      {/* ───────── S2 적극적 매물 발굴 ───────── */}
      <section className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-2xl px-5 py-14">
          <Label>① 적극적으로 매물을 찾습니다</Label>
          <H2>전국 매물, <em className="not-italic text-amber-700">우리가 매일 직접</em> 찾습니다.</H2>
          <Sub>호호요가, 점포라인, 당근비즈, 인스타, 블로그 — 매수자분이 가시는 모든 곳에서 매일 매물을 모아옵니다.</Sub>

          <div className="mt-6 rounded-xl border border-stone-200 bg-stone-50 p-5">
            <div className="text-xs font-bold text-stone-500 mb-3">우리가 통합하는 매물 풀</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Pool name="자동시드" count={`${s.total.toLocaleString()}+`} note="전국 카카오·네이버 자동 발굴" />
              <Pool name="호호요가" count="~5,000" note="센터매매 게시판 매일 동기화" />
              <Pool name="점포라인" count="~3,000" note="필라테스/헬스 카테고리" />
              <Pool name="당근비즈·인스타" count="~1,500" note="#필라테스양도 매일 모니터" />
            </div>
            <div className="mt-3 rounded-md bg-amber-50 p-3 text-xs text-amber-900">
              <strong>매도 의향이 명시된 매물</strong>은 매물 페이지에 <span className="rounded-full bg-amber-200 px-2 py-0.5 font-bold text-amber-900">거래의사 ✓</span> 배지로 표시됩니다.
            </div>
          </div>

          {/* 시도 그리드 */}
          <div className="mt-6">
            <p className="mb-2 text-xs font-bold text-stone-500">📍 지역으로 바로 찾기 — 광역시</p>
            <div className="grid grid-cols-4 gap-1.5">
              {tree.metros.map((g) => (
                <Link key={g.sido} href={`/listings?sido=${encodeURIComponent(g.sido)}`}
                  className="rounded-lg border border-stone-200 bg-white px-2 py-3 text-center hover:bg-stone-50">
                  <div className="text-sm font-bold">{g.sido}</div>
                  <div className="text-[10px] text-stone-500">{g.total.toLocaleString()}</div>
                </Link>
              ))}
            </div>
            <p className="mb-2 mt-3 text-xs font-bold text-stone-500">도</p>
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-9">
              {tree.dos.map((g) => (
                <Link key={g.sido} href={`/listings?sido=${encodeURIComponent(g.sido)}`}
                  className="rounded-lg border border-stone-200 bg-stone-50 px-2 py-3 text-center hover:bg-white">
                  <div className="text-sm font-bold">{g.sido}</div>
                  <div className="text-[10px] text-stone-500">{g.total.toLocaleString()}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────── S3 매물 안 숨겨진 정보 X-ray + 실측 ───────── */}
      <section className="border-t border-stone-200">
        <div className="mx-auto max-w-2xl px-5 py-14">
          <Label>② 매물 안에 숨겨진 정보를 알아냅니다</Label>
          <H2>"월 8천이라는데..."<br /><em className="not-italic text-amber-700">진짜인지 검증</em>합니다.</H2>
          <Sub>매도자가 보여주는 카톡 캡처는 누구나 만들 수 있습니다. 우리는 매도자가 받은 진짜 자료를 받아 한 시트로 정리합니다.</Sub>

          {/* 자료 4개 박스 */}
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <DataBox icon="💳" name="POS 매출" desc="KIS·키움·SPC 등 12개월 거래 데이터" />
            <DataBox icon="🏦" name="카드사 입금" desc="BC·KB·신한·삼성·롯데·하나·NH 명세" />
            <DataBox icon="📑" name="세금계산서" desc="홈택스 부가세 신고 자료 대조" />
            <DataBox icon="👥" name="회원관리 SW" desc="활성 회원·미사용 회원권·환불약관" />
          </div>

          {/* 실측 결과 시각화 — 핵심 */}
          <div className="mt-6 rounded-2xl border-2 border-stone-900 bg-stone-900 p-6 text-white">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400">실측 결과 예시</div>
            <h3 className="mt-1 text-lg font-bold">이 매물의 적정 권리금 산정</h3>

            <div className="mt-5 space-y-2 font-mono text-sm">
              <Row label="진성 월매출 (12개월 평균)" amount="+5,720,000" pos />
              <Row label="− 임대료·관리비" amount="−1,800,000" neg />
              <Row label="− 인건비 (4대보험 포함)" amount="−2,100,000" neg />
              <div className="my-2 border-t border-stone-700"></div>
              <Row label="월 영업이익" amount="+1,820,000" pos bold />
              <div className="my-2 border-t border-stone-700"></div>
              <Row label="− 회원권 잠재 환불 부채" amount="−18,500,000" neg note="(1년 내 청구 가능)" />
              <Row label="+ 리포머·캐딜락 중고 평가" amount="+9,200,000" pos />
              <div className="my-2 border-t border-stone-700"></div>
              <div className="rounded-lg bg-amber-500/15 p-3 mt-2">
                <div className="text-xs text-amber-200">적정 권리금 산정</div>
                <div className="text-2xl font-extrabold text-amber-400 mt-1">62,000,000원 ± 10%</div>
                <div className="text-[11px] text-amber-200/80 mt-1">매도자 호가 1억 → 협상 6,200만 (실제 케이스)</div>
              </div>
            </div>
          </div>

          <Quote><strong>매도자 호가 1억이 실제 6천만일 수도 있습니다.</strong><br/>그 차액 4천만이 선생님 통장에서 나갈 돈이에요.</Quote>
        </div>
      </section>

      {/* ───────── S4 전문가 대행 ───────── */}
      <section className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-2xl px-5 py-14">
          <Label>③ 전문가가 대신해드립니다</Label>
          <H2>선생님은 <em className="not-italic text-amber-700">답만 주세요.</em></H2>
          <Sub>매물 찾기부터 인수 마무리까지, 카톡 한 채널로 끝납니다.</Sub>

          <div className="mt-6 grid gap-2.5">
            <Doer item="매도자에게 전화·카톡" who="우리가" />
            <Doer item="POS·카드 매출 자료 요청" who="우리가" />
            <Doer item="은행·소상공인진흥공단 신청 서류" who="우리가" />
            <Doer item="변호사·세무사 매칭 + 일정 조율" who="우리가" />
            <Doer item="매물 약속 잡기" who="우리가" />
          </div>

          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/60 p-5">
            <div className="text-sm font-bold text-emerald-900">선생님이 직접 하실 일은 4가지</div>
            <div className="mt-3 space-y-2 text-sm text-stone-700">
              <Step n={1} title="무료 상담 신청 (휴대폰 번호만)" />
              <Step n={2} title="운영팀 카톡에 단답으로 답변" />
              <Step n={3} title="매물 직접 둘러보기 (분위기 확인)" />
              <Step n={4} title="마음에 들면 다음 단계 안내 받기" />
            </div>
          </div>
        </div>
      </section>

      {/* ───────── S5 사후 안전망 ───────── */}
      <section className="border-t border-stone-200">
        <div className="mx-auto max-w-2xl px-5 py-14">
          <Label>④ 인수 후에도 안전하게</Label>
          <H2>인수 첫 6개월이<br /><em className="not-italic text-rose-600">진짜 위험</em>합니다.</H2>
          <Sub>회원 환불 청구·임대인 갱신 거부·강사 단체 이탈·세금 추징. 그래서 우리는 인수 전에 변호사가 7가지를 미리 정리합니다.</Sub>

          <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-3">변호사 7항 미리 점검</div>
            <ul className="divide-y divide-dashed divide-stone-200 text-sm">
              <Law title="회원권 환불 충당 조항" desc="인수 첫 달 환불 폭탄 차단" />
              <Law title="임대인 동의서 동시 체결" desc="권리금 1원도 헛돈 안 나가게" />
              <Law title="강사 잔류·경업금지 약정" desc="핵심 강사 인근 이탈 시 200% 위약금" />
              <Law title="위약금 공증 (강제집행)" desc="법원 안 가도 바로 회수" />
              <Law title="권리금 70/30 분할지급" desc="6개월 후 30% — 매도자 잠적 시 회수" />
              <Law title="포괄양수도 신고" desc="부가세 10% 추징 차단" />
              <Law title="회원·강사 동의 절차" desc="개인정보보호법 과태료 차단" />
            </ul>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            <SafeCheck title="3개월 점검" desc="회원·매출·민원 카톡 확인" />
            <SafeCheck title="6개월 점검" desc="임대·강사·세금 점검" />
            <SafeCheck title="12개월 점검" desc="갱신·확장 카운슬링" />
          </div>

          <Quote><strong>인수했다고 끝이 아니에요.</strong><br/>1년 동안 운영팀이 카톡으로 같이 봅니다. 무료입니다.</Quote>
        </div>
      </section>

      {/* ───────── S6 지역 기반은 다르다 ───────── */}
      <section className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-2xl px-5 py-14">
          <Label>⑥ 지역에 따라 시세는 다릅니다</Label>
          <H2><em className="not-italic text-amber-700">강남 권리금</em>이 부산이랑 같을 리가요.</H2>
          <Sub>선생님이 보시는 매물의 권리금이 그 지역 평균인지, 매물 페이지에서 바로 확인하세요.</Sub>

          {/* 시세 비교 표 */}
          <div className="mt-6 rounded-xl border border-stone-200 bg-stone-50 p-5">
            <div className="text-xs font-bold text-stone-500 mb-3">시군구 평균 권리금 (필라테스 기준, 추정)</div>
            <div className="space-y-1.5">
              <Bar region="서울 강남구" amount={8000} max={10000} label="8,000만" />
              <Bar region="서울 송파구" amount={6500} max={10000} label="6,500만" />
              <Bar region="경기 성남시 분당" amount={5500} max={10000} label="5,500만" />
              <Bar region="부산 해운대구" amount={4000} max={10000} label="4,000만" />
              <Bar region="대구 수성구" amount={3500} max={10000} label="3,500만" />
              <Bar region="충북 청주시" amount={1500} max={10000} label="1,500만" />
            </div>
            <p className="mt-3 text-xs text-stone-500">※ 실제 매물 페이지에서는 시군구별 p25/p50/p75 분포까지 노출됩니다.</p>
          </div>

          <div className="mt-5 text-center">
            <Link href="/listings" className="text-sm font-bold text-amber-700 underline hover:text-amber-800">
              우리 지역 매물 시세 보러 가기 →
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── S6.5 갈래 B 미니 폼 — 조건만 등록 ───────── */}
      <section className="border-t border-stone-200">
        <div className="mx-auto max-w-2xl px-5 py-14">
          <Label>⑤ 특정 매물 없이도</Label>
          <H2>조건만 알려주세요. <em className="not-italic text-amber-700">매물은 우리가</em> 매칭.</H2>
          <Sub>전국 1만+ 자동시드 + 호호요가·점포라인 외부 시그널까지 — 조건에 맞는 매물 5개를 카톡으로 보내드립니다.</Sub>
          <div className="mt-6">
            <QuickIntentForm />
          </div>
        </div>
      </section>

      {/* ───────── S7 추천 매물 ───────── */}
      <section className="border-t border-stone-200">
        <div className="mx-auto max-w-2xl px-5 py-14">
          <Label>지금 바로</Label>
          <H2>이런 매물이 <em className="not-italic text-amber-700">실제로</em> 있어요.</H2>
          <Sub>전국 {s.total.toLocaleString()}+개 매물 중 디지털 운영 우수 4건.</Sub>

          {/* 검색 폼 */}
          <form action={go} className="mt-5 space-y-2 rounded-xl border border-stone-200 bg-white p-3">
            <input
              name="q"
              type="text"
              placeholder="상호 · 동 · 주소"
              className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-base focus:bg-white focus:border-stone-900 focus:outline-none"
            />
            <RegionSelect metros={tree.metros} dos={tree.dos} />
            <button className="w-full rounded-lg bg-stone-900 px-4 py-3 text-base font-bold text-white hover:bg-stone-700">
              매물 검색
            </button>
          </form>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {featured.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
          <div className="mt-3 text-center">
            <Link href="/listings" className="text-sm text-stone-500 underline hover:text-stone-900">전체 매물 보기 →</Link>
          </div>
        </div>
      </section>

      {/* ───────── S8 CTA ───────── */}
      <section className="bg-stone-900 text-white">
        <div className="mx-auto max-w-2xl px-5 py-16 text-center">
          <h2 className="text-3xl font-extrabold leading-tight">
            번호만 남겨주세요.
          </h2>
          <p className="mt-4 text-stone-300 leading-relaxed">
            24시간 내 운영팀이 카톡으로 인사드립니다.<br />
            30분 무료 상담 후 다음 단계는 같이 결정해요.<br />
            <span className="text-stone-400 text-sm">여기서 끝나도 비용 0원입니다.</span>
          </p>
          <Link
            href="/inquire?kind=acquire"
            className="mt-7 inline-block rounded-xl bg-amber-400 px-8 py-4 text-base font-bold text-stone-900 hover:bg-amber-300"
          >
            무료 상담 신청 →
          </Link>
          <p className="mt-5 text-xs text-stone-400">
            매도자분이세요? <Link href="/inquire?kind=sell" className="text-amber-400 underline">매물 등록도 무료</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

/* ── helpers ── */
function Label({ children }: { children: React.ReactNode }) {
  return <div className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-700">{children}</div>;
}
function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-3 text-2xl font-bold leading-snug tracking-tight sm:text-3xl">{children}</h2>;
}
function Sub({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-sm text-stone-600 sm:text-base leading-relaxed">{children}</p>;
}
function Quote({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 rounded-r-lg border-l-4 border-amber-500 bg-amber-50 px-5 py-4 text-sm text-stone-800 leading-relaxed sm:text-base">{children}</div>;
}
function Pool({ name, count, note }: { name: string; count: string; note: string }) {
  return (
    <div className="rounded-md bg-white p-3 border border-stone-200">
      <div className="text-xs text-stone-500">{name}</div>
      <div className="mt-0.5 text-base font-bold text-stone-900">{count}</div>
      <div className="text-[11px] text-stone-500 mt-0.5">{note}</div>
    </div>
  );
}
function DataBox({ icon, name, desc }: { icon: string; name: string; desc: string }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4">
      <div className="text-xl">{icon}</div>
      <div className="mt-1.5 text-sm font-bold">{name}</div>
      <div className="mt-0.5 text-xs text-stone-500 leading-relaxed">{desc}</div>
    </div>
  );
}
function Row({ label, amount, pos, neg, bold, note }: { label: string; amount: string; pos?: boolean; neg?: boolean; bold?: boolean; note?: string }) {
  return (
    <div className={`flex justify-between gap-3 ${bold ? "font-bold" : ""}`}>
      <div className="text-stone-300">
        {label}
        {note ? <span className="text-stone-500 ml-2 text-xs">{note}</span> : null}
      </div>
      <div className={pos ? "text-emerald-400" : neg ? "text-rose-400" : "text-stone-100"}>{amount}</div>
    </div>
  );
}
function Doer({ item, who }: { item: string; who: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white border border-stone-200 px-4 py-3">
      <span className="text-sm text-stone-700">{item}</span>
      <span className="rounded-full bg-stone-900 px-2.5 py-0.5 text-[11px] font-bold text-white">{who}</span>
    </div>
  );
}
function Step({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex gap-2.5 items-start">
      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white mt-0.5">{n}</span>
      <span>{title}</span>
    </div>
  );
}
function Law({ title, desc }: { title: string; desc: string }) {
  return (
    <li className="py-3 flex justify-between gap-3 items-baseline">
      <span><span className="font-bold text-stone-900">{title}</span></span>
      <span className="text-xs text-stone-500 text-right">{desc}</span>
    </li>
  );
}
function SafeCheck({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 text-center">
      <div className="text-sm font-bold text-amber-700">{title}</div>
      <div className="mt-1 text-xs text-stone-600">{desc}</div>
    </div>
  );
}
function Bar({ region, amount, max, label }: { region: string; amount: number; max: number; label: string }) {
  const pct = Math.min(100, (amount / max) * 100);
  return (
    <div>
      <div className="flex justify-between items-baseline text-xs mb-1">
        <span className="font-medium text-stone-700">{region}</span>
        <span className="font-bold text-amber-700">{label}</span>
      </div>
      <div className="h-2 rounded-full bg-stone-200 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600" style={{ width: `${pct}%` }}></div>
      </div>
    </div>
  );
}
