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
    <div className="bg-white text-black">

      {/* HERO */}
      <section className="mx-auto max-w-2xl px-5 pt-16 pb-12 sm:pt-24">
        <div className="text-[11px] font-bold uppercase tracking-widest text-red-600">필라테스·요가 인수하시려는 분께</div>
        <h1 className="mt-4 text-[34px] sm:text-5xl font-extrabold leading-[1.15] tracking-tight">
          혼자 사면<br />
          <span className="text-red-600">큰일납니다.</span>
        </h1>
        <p className="mt-6 text-[16px] sm:text-lg text-black/70 leading-relaxed">
          학원 100곳을 인수하면 그중 30곳은 6개월 안에 분쟁이 터집니다.<br />
          회원 환불 폭탄, 임대인이 갱신을 거부하기, 강사들이 단체로 그만두기, 세금 폭탄.
        </p>
        <p className="mt-5 text-[18px] font-bold text-black">
          그래서 우리는 <span className="text-blue-600">단계로 나눠</span> 도와드립니다.
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          <Link href="/inquire?kind=acquire" className="rounded-lg bg-black px-7 py-4 text-base font-bold text-white hover:bg-black/85">
            상담 신청 →
          </Link>
          <Link href="/risk" className="rounded-lg border border-black/15 bg-white px-7 py-4 text-base font-semibold text-black hover:bg-black/5">
            위험 7가지 보기
          </Link>
        </div>
        <p className="mt-4 text-xs text-black/50">상담은 무료입니다. 휴대폰 번호만 남겨주세요.</p>
      </section>

      {/* 1. 위험 7가지 */}
      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-2xl px-5 py-16">
          <Tag color="red">1 · 무엇이 위험한가</Tag>
          <H2>인수하고 나서 <em className="not-italic text-red-600">큰일 나는 7가지</em></H2>
          <Sub>매수자가 인수 전에 알 수 없는 항목이 절반입니다.</Sub>

          <div className="mt-8 space-y-2.5">
            <Risk n={1} title="회원권 환불 폭탄" loss="5천만 ~ 3억" />
            <Risk n={2} title="임대인이 갱신·승계 거부" loss="권리금 전액" />
            <Risk n={3} title="핵심 강사 단체로 그만둠" loss="월매출 절반↓" />
            <Risk n={4} title="실제 매출이 매도자 말과 다름" loss="권리금 30~50%" />
            <Risk n={5} title="세금 추징 (포괄양수도 누락)" loss="부가세 10%" />
            <Risk n={6} title="기구·시설 노후 발견" loss="2~3천만" />
            <Risk n={7} title="공동 명의·법인 분쟁" loss="사업 정지" />
          </div>

          <div className="mt-6 text-center">
            <Link href="/risk" className="text-sm font-bold text-red-600 underline underline-offset-4 hover:text-red-700">7가지 자세히 보기 →</Link>
          </div>
        </div>
      </section>

      {/* 2. 5단계 절차 */}
      <section className="border-t border-black/10 bg-black/[.02]">
        <div className="mx-auto max-w-2xl px-5 py-16">
          <Tag color="blue">2 · 우리 대책</Tag>
          <H2>5단계로 <em className="not-italic text-blue-600">끊어드립니다</em></H2>
          <Sub>각 단계마다 결정·결제·환불 시점이 명확합니다. 그만 두셔도 그 단계까지만.</Sub>

          <div className="mt-8 space-y-2.5">
            <Stage n={0} name="매물 찾기·상담 신청" pill="무료" pillColor="blue" />
            <Stage n={1} name="권리금 계산서 만들기" pill="매도자 착수금" pillColor="amber" />
            <Stage n={2} name="실사·자료 검토" pill="매수자 예약금" pillColor="amber" />
            <Stage n={3} name="계약·잔금" pill="변호사가 직접" pillColor="black" />
            <Stage n={4} name="1년간 사후 점검" pill="무료" pillColor="blue" />
          </div>

          <div className="mt-6 text-center">
            <Link href="/process" className="text-sm font-bold text-blue-600 underline underline-offset-4 hover:text-blue-700">5단계 자세히 보기 →</Link>
          </div>
        </div>
      </section>

      {/* 3. 비용 한 표 */}
      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-2xl px-5 py-16">
          <Tag>3 · 비용</Tag>
          <H2>매수자는 <em className="not-italic text-blue-600">예약금 50만원</em>만.</H2>
          <Sub>매도자는 거래가 성사된 경우에만 권리금의 일정 %를 부담합니다.</Sub>

          <div className="mt-8 overflow-hidden rounded-xl border border-black/15">
            <table className="w-full text-sm">
              <thead className="bg-black text-white text-xs">
                <tr>
                  <th className="px-3 py-2.5 text-left font-bold">단계</th>
                  <th className="px-3 py-2.5 text-right font-bold">매수자</th>
                  <th className="px-3 py-2.5 text-right font-bold">매도자</th>
                  <th className="px-3 py-2.5 text-right font-bold">변호사·세무사</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <Tr step="0 매물 찾기" buyer="0" seller="0" legal="0" />
                <Tr step="1 권리금 계산서" buyer="0" seller="150만" legal="0" />
                <Tr step="2 실사·검토" buyer="50만" seller="0" legal="15만~" highlight />
                <Tr step="3 계약·잔금" buyer="0" seller="2~4%" legal="~165만" />
                <Tr step="4 1년 점검" buyer="0" seller="0" legal="0" />
              </tbody>
              <tfoot className="bg-blue-50 border-t-2 border-blue-600">
                <tr>
                  <td className="px-3 py-3 text-xs font-bold">권리금 1억 학원 합계</td>
                  <td className="px-3 py-3 text-right text-base font-extrabold text-blue-600">50만</td>
                  <td className="px-3 py-3 text-right text-base font-extrabold text-blue-600">450만</td>
                  <td className="px-3 py-3 text-right text-sm font-bold text-black">약 180만</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <p className="mt-4 text-xs text-black/55 leading-relaxed">
            ※ 변호사·세무사·공증·금융 비용은 의뢰인이 변호사·세무사에게 <strong>직접</strong> 결제합니다. <Link href="/pricing/legal" className="text-blue-600 underline">자세히</Link><br />
            ※ pilaos는 변호사 자문료에 일절 관여하지 않습니다 (변호사법 제109조 준수).
          </p>

          <div className="mt-6 text-center">
            <Link href="/pricing" className="text-sm font-bold text-blue-600 underline underline-offset-4 hover:text-blue-700">전체 비용 정책 →</Link>
          </div>
        </div>
      </section>

      {/* 4. 매물 검색 */}
      <section className="border-t border-black/10 bg-black/[.02]">
        <div className="mx-auto max-w-2xl px-5 py-16">
          <Tag>4 · 매물</Tag>
          <H2>전국 <em className="not-italic text-blue-600">{s.total.toLocaleString()}+곳</em>의 매물.</H2>
          <Sub>우리가 자동으로 찾은 매물 + 호호요가·점포라인에 올라온 매물까지.</Sub>

          <form action={go} className="mt-6 space-y-2 rounded-xl border border-black/15 bg-white p-3">
            <input
              name="q" type="text" placeholder="상호 · 동 · 주소"
              className="w-full rounded-lg border border-black/15 bg-black/[.03] px-4 py-3 text-base focus:bg-white focus:border-black focus:outline-none"
            />
            <RegionSelect metros={tree.metros} dos={tree.dos} />
            <button className="w-full rounded-lg bg-black px-4 py-3 text-base font-bold text-white hover:bg-black/85">매물 검색</button>
          </form>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {featured.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
          <div className="mt-4 text-center">
            <Link href="/listings" className="text-sm text-black/55 underline underline-offset-4 hover:text-black">전체 매물 보기 →</Link>
          </div>
        </div>
      </section>

      {/* 5. 조건만 등록 */}
      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-2xl px-5 py-16">
          <Tag color="blue">5 · 조건만 알려주세요</Tag>
          <H2>특정 매물이 없어도, <em className="not-italic text-blue-600">우리가 매물을 찾아</em> 연락드립니다.</H2>
          <Sub>지역, 예산, 시기만 알려주시면 매칭한 매물을 카톡으로 보내드립니다.</Sub>
          <div className="mt-6">
            <QuickIntentForm />
          </div>
        </div>
      </section>

      {/* 6. 우리가 안 하는 일 */}
      <section className="border-t border-black/10 bg-black/[.02]">
        <div className="mx-auto max-w-2xl px-5 py-16">
          <Tag>6 · 우리가 안 하는 일</Tag>
          <H2>합법적이고 <em className="not-italic text-blue-600">투명하게</em>.</H2>
          <Sub>일부러 분리한 부분이 있습니다.</Sub>

          <div className="mt-6 space-y-2.5">
            <NotDo title="권리금을 우리가 보관하지 않습니다" desc="법무법인의 예치 계좌 또는 은행 신탁 계좌로 안내해드립니다." />
            <NotDo title="변호사 자문료를 받지 않습니다" desc="변호사가 의뢰인에게 직접 청구합니다. 우리는 매칭과 일정만 무료로 도와드립니다." />
            <NotDo title="대출 알선 수수료를 받지 않습니다" desc="소상공인진흥공단·은행 신청 대행은 무료입니다. 대출 결제는 의뢰인이 금융사와 직접 합니다." />
            <NotDo title="거래 성사를 강요하지 않습니다" desc="매수자분이 변심하시면 다음 단계로 진입하지 않으면 됩니다." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-2xl px-5 py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">번호만 남겨주세요.</h2>
          <p className="mt-5 text-white/75 leading-relaxed">
            24시간 안에 운영팀이 카톡으로 연락드립니다.<br />
            30분 무료 상담 후 다음 단계는 함께 결정해요.<br />
            <span className="text-white/50 text-sm">상담만 받고 끝나도 비용은 없습니다.</span>
          </p>
          <Link href="/inquire?kind=acquire" className="mt-8 inline-block rounded-lg bg-white px-8 py-4 text-base font-bold text-black hover:bg-white/90">
            상담 신청 →
          </Link>
          <p className="mt-6 text-xs text-white/50">
            매도자세요? <Link href="/inquire?kind=sell" className="text-white underline underline-offset-2">매물 등록도 무료</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

/* ── helpers ── */
function Tag({ children, color = "black" }: { children: React.ReactNode; color?: "black" | "red" | "blue" }) {
  const cls = color === "red" ? "text-red-600" : color === "blue" ? "text-blue-600" : "text-black/60";
  return <div className={`text-[11px] font-bold uppercase tracking-widest ${cls}`}>{children}</div>;
}
function H2({ children }: { children: React.ReactNode }) { return <h2 className="mt-3 text-2xl sm:text-[28px] font-extrabold leading-snug tracking-tight">{children}</h2>; }
function Sub({ children }: { children: React.ReactNode }) { return <p className="mt-3 text-[15px] text-black/65 leading-relaxed">{children}</p>; }
function Risk({ n, title, loss }: { n: number; title: string; loss: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50/40 p-4">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-extrabold text-white">{n}</div>
      <div className="flex-1 text-[15px] font-bold text-black">{title}</div>
      <div className="text-xs font-bold text-red-600 whitespace-nowrap">{loss}</div>
    </div>
  );
}
function Stage({ n, name, pill, pillColor }: { n: number; name: string; pill: string; pillColor: "blue" | "amber" | "black" }) {
  const pcls = pillColor === "blue" ? "bg-blue-600 text-white" : pillColor === "amber" ? "bg-black text-white" : "bg-black/10 text-black";
  return (
    <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-4">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-black text-sm font-extrabold text-white">{n}</div>
      <div className="flex-1 text-[15px] font-bold text-black">{name}</div>
      <div className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold whitespace-nowrap ${pcls}`}>{pill}</div>
    </div>
  );
}
function Tr({ step, buyer, seller, legal, highlight }: { step: string; buyer: string; seller: string; legal: string; highlight?: boolean }) {
  return (
    <tr className={`border-t border-black/10 ${highlight ? "bg-blue-50/60" : ""}`}>
      <td className="px-3 py-2.5 text-sm">{step}</td>
      <td className="px-3 py-2.5 text-right text-sm">{buyer}</td>
      <td className="px-3 py-2.5 text-right text-sm">{seller}</td>
      <td className="px-3 py-2.5 text-right text-sm">{legal}</td>
    </tr>
  );
}
function NotDo({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex gap-3 rounded-xl border border-black/10 bg-white p-4">
      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white mt-0.5">×</span>
      <div>
        <div className="text-[15px] font-bold text-black">{title}</div>
        <div className="mt-1 text-xs text-black/60 leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}
