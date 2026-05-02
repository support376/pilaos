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

      {/* S1 HERO — 위험 톤 */}
      <section className="mx-auto max-w-2xl px-5 pt-14 pb-10 sm:pt-20 sm:pb-12">
        <div className="text-xs font-bold uppercase tracking-wider text-rose-700">필라테스·요가 인수하시려는 선생님께</div>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          혼자 하시면<br />
          <span className="bg-gradient-to-b from-transparent from-60% to-rose-100 to-60% px-1 text-rose-700">큰일납니다.</span>
        </h1>
        <p className="mt-5 text-base text-stone-600 sm:text-lg leading-relaxed">
          필라테스 인수 100건 중 <strong className="text-rose-700">30건은 6개월 안에 분쟁</strong>이 터집니다.<br />
          회원 환불 폭탄, 임대인 갱신 거부, 강사 단체 이탈, 세무 추징…
        </p>
        <p className="mt-4 text-base text-stone-900 font-bold sm:text-lg">
          그래서 우리는 <span className="text-amber-700">단계로 끊어드립니다.</span>
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/inquire?kind=acquire" className="rounded-xl bg-stone-900 px-7 py-4 text-base font-bold text-white hover:bg-stone-700">
            무료 상담 신청 →
          </Link>
          <Link href="/risk" className="rounded-xl border border-stone-300 bg-white px-7 py-4 text-base font-semibold hover:bg-stone-50">
            7가지 위험 보기
          </Link>
        </div>
        <p className="mt-4 text-xs text-stone-500">매수자분이 우리에게 내시는 비용은 <strong className="text-stone-700">디파짓 50만원</strong>뿐. 단계마다 그만 두실 수 있어요.</p>
      </section>

      {/* S2 7가지 위험 */}
      <section className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-2xl px-5 py-14">
          <Label color="rose">위험</Label>
          <H2>인수 후 큰일 나는 <em className="not-italic text-rose-700">7가지 패턴</em></H2>
          <Sub>매수자가 인수 전에 절대 모르는 항목이 3~4개. 손실 규모도 만만치 않습니다.</Sub>

          <div className="mt-6 space-y-2">
            <Risk n={1} title="회원권 환불 폭탄" loss="5천만 ~ 3억" />
            <Risk n={2} title="임대인 갱신·승계 거부" loss="권리금 전액" />
            <Risk n={3} title="핵심 강사 단체 이탈" loss="월매출 50%↓" />
            <Risk n={4} title="매출 부풀리기" loss="권리금 30~50%" />
            <Risk n={5} title="세무 추징" loss="부가세 10%" />
            <Risk n={6} title="시설 노후" loss="2~3천만" />
            <Risk n={7} title="동업·법인 분쟁" loss="사업 정지" />
          </div>

          <div className="mt-5 text-center">
            <Link href="/risk" className="text-sm font-bold text-rose-700 underline hover:text-rose-800">7가지 자세히 →</Link>
          </div>
        </div>
      </section>

      {/* S3 5단계 절차 */}
      <section className="border-t border-stone-200">
        <div className="mx-auto max-w-2xl px-5 py-14">
          <Label color="amber">대책</Label>
          <H2>단계로 끊어드립니다 — <em className="not-italic text-amber-700">5단계</em></H2>
          <Sub>각 단계마다 결정·결제·환불이 명확. 그만 두셔도 비용은 그 단계까지만.</Sub>

          <div className="mt-6 space-y-2">
            <Stage n={0} name="발견 · 의사 표현" pill="무료" />
            <Stage n={1} name="권리금 산정" pill="Retainer (매도자)" />
            <Stage n={2} name="실사 진입" pill="디파짓 50만 (매수자)" />
            <Stage n={3} name="계약 · 잔금" pill="변호사 직접" />
            <Stage n={4} name="1년 사후 점검" pill="무료" />
          </div>

          <div className="mt-5 text-center">
            <Link href="/process" className="text-sm font-bold text-amber-700 underline hover:text-amber-800">단계 자세히 →</Link>
          </div>
        </div>
      </section>

      {/* S4 비용 흐름 한 표 */}
      <section className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-2xl px-5 py-14">
          <Label color="amber">비용 흐름</Label>
          <H2>매수자는 <em className="not-italic text-amber-700">50만원</em>만.<br />매도자는 거래 성사 시 권리금 %.</H2>
          <Sub>점포라인 매수자 240만 + 매도자 590만 대비 합리적. 단계마다 결제 시점 명확.</Sub>

          <div className="mt-6 overflow-hidden rounded-xl border border-stone-200">
            <table className="w-full text-sm">
              <thead className="bg-stone-100 text-xs text-stone-600">
                <tr>
                  <th className="px-3 py-2 text-left">단계</th>
                  <th className="px-3 py-2 text-right">매수자</th>
                  <th className="px-3 py-2 text-right">매도자</th>
                  <th className="px-3 py-2 text-right">변호사·세무 (외부)</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <Tr step="0 발견" buyer="0" seller="0" legal="0" />
                <Tr step="1 권리금 산정" buyer="0" seller="150만" legal="0" />
                <Tr step="2 실사 진입" buyer="50만" seller="0" legal="15만~" highlight />
                <Tr step="3 계약·잔금 (성사)" buyer="0" seller="2~4%" legal="~165만" />
                <Tr step="4 1년 점검" buyer="0" seller="0" legal="0" />
              </tbody>
              <tfoot className="bg-amber-50">
                <tr className="border-t-2 border-amber-300">
                  <td className="px-3 py-2 text-xs font-bold">1억 매물 합계</td>
                  <td className="px-3 py-2 text-right text-base font-extrabold text-amber-700">50만</td>
                  <td className="px-3 py-2 text-right text-base font-extrabold text-amber-700">450만</td>
                  <td className="px-3 py-2 text-right text-base font-bold">~180만</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <p className="mt-3 text-xs text-stone-500 leading-relaxed">
            ※ 변호사·세무사·공증·금융 비용은 의뢰인이 직접 결제합니다. <Link href="/pricing/legal" className="text-amber-700 underline">자세히 →</Link><br />
            ※ pilaos는 자문료에 일절 관여하지 않습니다 (변호사법 §109 준수).
          </p>

          <div className="mt-5 text-center">
            <Link href="/pricing" className="text-sm font-bold text-amber-700 underline hover:text-amber-800">전체 가격 정책 →</Link>
          </div>
        </div>
      </section>

      {/* S5 매물 검색 */}
      <section className="border-t border-stone-200">
        <div className="mx-auto max-w-2xl px-5 py-14">
          <Label color="blue">매물</Label>
          <H2>전국 <em className="not-italic text-amber-700">{s.total.toLocaleString()}+개</em> 매물.</H2>
          <Sub>자동 시드 + 호호요가·점포라인 외부 시그널 통합. 거래 의사 매물엔 ✓ 배지.</Sub>

          <form action={go} className="mt-5 space-y-2 rounded-xl border border-stone-200 bg-white p-3">
            <input
              name="q" type="text" placeholder="상호 · 동 · 주소"
              className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-base focus:bg-white focus:border-stone-900 focus:outline-none"
            />
            <RegionSelect metros={tree.metros} dos={tree.dos} />
            <button className="w-full rounded-lg bg-stone-900 px-4 py-3 text-base font-bold text-white hover:bg-stone-700">매물 검색</button>
          </form>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {featured.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
          <div className="mt-3 text-center">
            <Link href="/listings" className="text-sm text-stone-500 underline hover:text-stone-900">전체 매물 보기 →</Link>
          </div>
        </div>
      </section>

      {/* S6 조건만 등록 */}
      <section className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-2xl px-5 py-14">
          <Label color="amber">조건만 알려주세요</Label>
          <H2>특정 매물 없어도, <em className="not-italic text-amber-700">매물은 우리가</em> 매칭.</H2>
          <Sub>전국 1만+ 자동 시드 + 외부 시그널까지. 카톡으로 보내드립니다.</Sub>
          <div className="mt-6">
            <QuickIntentForm />
          </div>
        </div>
      </section>

      {/* S7 우리는 무엇을 하지 않는가 (신뢰) */}
      <section className="border-t border-stone-200">
        <div className="mx-auto max-w-2xl px-5 py-14">
          <Label color="gray">신뢰</Label>
          <H2>pilaos가 <em className="not-italic text-amber-700">하지 않는 일</em>.</H2>
          <Sub>합법적이고 투명한 구조를 위해 일부러 분리해두었습니다.</Sub>

          <div className="mt-6 space-y-2">
            <NotDo title="권리금 자금을 직접 보관하지 않습니다" desc="법무법인 예치계좌 또는 3자 약정 은행계좌로 안내. 특정금융정보법 준수." />
            <NotDo title="법률 자문료를 받지 않습니다" desc="변호사가 의뢰인에게 직접 청구. 매칭과 일정만 무료. 변호사법 §109 준수." />
            <NotDo title="대출 알선 수수료를 받지 않습니다" desc="소상공인진흥공단·신보·은행 신청 대행은 무료. 금융사가 의뢰인에게 직접 결제." />
            <NotDo title="거래 성사 강제하지 않습니다" desc="매수자 변심·매도자 변심 시 다음 단계 진입하지 않으면 됩니다. 위약금 강요 없음." />
          </div>
        </div>
      </section>

      {/* S8 CTA */}
      <section className="bg-stone-900 text-white">
        <div className="mx-auto max-w-2xl px-5 py-16 text-center">
          <h2 className="text-3xl font-extrabold leading-tight">번호만 남겨주세요.</h2>
          <p className="mt-4 text-stone-300 leading-relaxed">
            24시간 내 운영팀이 카톡으로 인사드립니다.<br />
            30분 무료 상담 후 다음 단계는 같이 결정해요.<br />
            <span className="text-stone-400 text-sm">여기서 끝나도 비용 0원입니다.</span>
          </p>
          <Link href="/inquire?kind=acquire" className="mt-7 inline-block rounded-xl bg-amber-400 px-8 py-4 text-base font-bold text-stone-900 hover:bg-amber-300">
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
function Label({ children, color = "amber" }: { children: React.ReactNode; color?: "amber" | "rose" | "blue" | "gray" }) {
  const cls = { amber: "bg-amber-100 text-amber-700", rose: "bg-rose-100 text-rose-700", blue: "bg-blue-100 text-blue-700", gray: "bg-stone-200 text-stone-700" }[color];
  return <div className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${cls}`}>{children}</div>;
}
function H2({ children }: { children: React.ReactNode }) { return <h2 className="mt-3 text-2xl font-bold leading-snug tracking-tight sm:text-3xl">{children}</h2>; }
function Sub({ children }: { children: React.ReactNode }) { return <p className="mt-2 text-sm text-stone-600 sm:text-base leading-relaxed">{children}</p>; }
function Risk({ n, title, loss }: { n: number; title: string; loss: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50/50 p-4">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-rose-600 text-sm font-extrabold text-white">{n}</div>
      <div className="flex-1 text-sm font-bold text-stone-900">{title}</div>
      <div className="text-xs font-bold text-rose-700 whitespace-nowrap">손실 {loss}</div>
    </div>
  );
}
function Stage({ n, name, pill }: { n: number; name: string; pill: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-4">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-stone-900 text-sm font-extrabold text-white">{n}</div>
      <div className="flex-1 text-sm font-bold text-stone-900">{name}</div>
      <div className="text-[11px] font-bold text-amber-700 whitespace-nowrap">{pill}</div>
    </div>
  );
}
function Tr({ step, buyer, seller, legal, highlight }: { step: string; buyer: string; seller: string; legal: string; highlight?: boolean }) {
  return (
    <tr className={`border-t border-stone-200 ${highlight ? "bg-amber-50" : ""}`}>
      <td className="px-3 py-2.5 text-sm">{step}</td>
      <td className="px-3 py-2.5 text-right text-sm">{buyer}</td>
      <td className="px-3 py-2.5 text-right text-sm">{seller}</td>
      <td className="px-3 py-2.5 text-right text-sm">{legal}</td>
    </tr>
  );
}
function NotDo({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex gap-3 rounded-xl border border-stone-200 bg-white p-4">
      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-stone-900 text-xs font-bold text-white">✗</span>
      <div>
        <div className="text-sm font-bold">{title}</div>
        <div className="mt-0.5 text-xs text-stone-600">{desc}</div>
      </div>
    </div>
  );
}
