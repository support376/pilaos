import Link from "next/link";
import { redirect } from "next/navigation";
import { getListing, searchListings } from "@/lib/listings";
import { submitIntent } from "@/lib/intent";
import { FormField } from "@/components/listing/FormField";
import { fmtMan } from "@/lib/estimate";

type Props = { searchParams: Promise<{ listing?: string; step?: string; q?: string; ok?: string }> };

async function action(formData: FormData) {
  "use server";
  const listing_id = String(formData.get("listing_id") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const name = String(formData.get("name") || "").trim();
  if (!phone || !listing_id) return;
  await submitIntent({
    kind: "sell",
    contact_name: name,
    contact_phone: phone,
    listing_id,
    asking_key_money: Number(formData.get("asking") || 0) || undefined,
    flexible: formData.get("flexible") === "1",
    anonymous: formData.get("anonymous") === "1",
    timing: (String(formData.get("timing") || "3m") as "immediate" | "1m" | "3m" | "6m" | "later"),
    reason: (String(formData.get("reason") || "other") as "health" | "relocation" | "expansion" | "liquidation" | "other"),
    message: String(formData.get("message") || "").trim() || undefined,
  });
  redirect(`/sell/new?listing=${encodeURIComponent(listing_id)}&step=done`);
}

const STEPS = [
  { id: "find", label: "1. 매장 찾기" },
  { id: "verify", label: "2. 본인확인" },
  { id: "price", label: "3. 가격·시점" },
  { id: "options", label: "4. 노출 옵션" },
  { id: "review", label: "5. 검토·접수" },
];

function StepBar({ current }: { current: string }) {
  const idx = STEPS.findIndex((s) => s.id === current);
  return (
    <ol className="mb-6 flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-white p-2 text-xs">
      {STEPS.map((s, i) => (
        <li key={s.id} className={`rounded-md px-3 py-1.5 ${i === idx ? "bg-amber-100 text-amber-900 font-bold" : i < idx ? "bg-emerald-50 text-emerald-700" : "text-gray-500"}`}>
          {i < idx ? "✓ " : ""}{s.label}
        </li>
      ))}
    </ol>
  );
}

export default async function SellNew({ searchParams }: Props) {
  const sp = await searchParams;
  const step = sp.step ?? (sp.listing ? "verify" : "find");
  const l = sp.listing ? getListing(sp.listing) : null;

  if (step === "done") {
    return (
      <div className="mx-auto max-w-xl px-4 py-12">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8">
          <div className="text-5xl text-center">✓</div>
          <h1 className="mt-3 text-xl font-bold text-emerald-900 text-center">매도 의향 접수 완료</h1>
          <p className="mt-2 text-sm text-emerald-800 text-center">{l ? l.studio.place_name : "매물"} 등록 신청을 받았습니다.</p>

          <div className="mt-6 rounded-xl bg-white p-5">
            <p className="font-semibold mb-3 text-gray-900">다음 단계</p>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
              <li><strong>24시간 내 운영팀 통화</strong> — 등록 휴대폰으로 본인확인 + 사업자번호 매칭</li>
              <li><strong>매물 정보 검토</strong> — 평수/시설 등 잘못된 부분 정정 가능</li>
              <li><strong>잠재 매수자 매칭</strong> — 조건 맞는 매수자에게 NDA 후 진성정보 공개</li>
              <li><strong>실사 의뢰 (선택)</strong> — 변호사 동반 패키지로 권리금·매출 검증 → "검증 매물" 배지</li>
              <li><strong>거래 진행</strong> — 가격 협상·계약·잔금·회원 승계 표준 절차</li>
            </ol>
          </div>

          <div className="mt-4 rounded-xl bg-white p-4 text-xs text-gray-600">
            <p><strong className="text-gray-900">우리가 도와드리는 일</strong></p>
            <ul className="mt-2 list-disc pl-4 space-y-1">
              <li>매수자 컨택 대행 (운영팀이 대신 연락)</li>
              <li>NDA·양수도계약 표준 템플릿 (변호사 검토)</li>
              <li>회원 승계 동의 자동화 워크플로</li>
              <li>중고 비품 처분 라우팅 (필요 시)</li>
              <li>임대인 협조 협상 지원 (폐업 패키지)</li>
            </ul>
          </div>

          <div className="mt-6 flex gap-2 justify-center">
            <Link href={l ? `/listings/${l.id}` : "/listings"} className="rounded-md bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-gray-700">매물 페이지로</Link>
            
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold">매물 등록 / 매도 의향</h1>
      <p className="mt-1 text-sm text-gray-600">5단계 위저드 — 평균 2~3분 소요</p>
      <StepBar current={step} />

      {step === "find" ? <Step1Find query={sp.q} /> : null}
      {step === "verify" && l ? <Step2to5Form listing={l} action={action} /> : null}
    </div>
  );
}

function Step1Find({ query }: { query?: string }) {
  const q = (query ?? "").trim();
  const hits = q ? searchListings({ q }, "score", 12).rows : [];
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        <p className="font-semibold">광고비 0원으로 잠재 매수자에게 자동 노출</p>
        <p className="mt-1 text-xs leading-relaxed">메타·당근·블로그·파워링크에 매달 광고비 쓰는 대신, 본 매물을 등록하시면 운영팀이 잠재 매수자 풀에서 직접 매칭합니다. 네이버 플레이스 순위가 떨어진 매장도 OK.</p>
      </div>
      <h2 className="text-lg font-bold">매장 찾기</h2>
      <p className="mt-1 text-sm text-gray-600">전국 1만개 매물 중에 본인 매장을 찾아주세요. 없으면 신규 등록도 가능합니다.</p>
      <form method="get" className="mt-4">
        <input type="hidden" name="step" value="find" />
        <div className="flex gap-2">
          <input name="q" defaultValue={q} placeholder="상호 또는 동명" className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" />
          <button className="rounded-md bg-gray-900 px-5 py-2 text-sm font-bold text-white hover:bg-gray-700">검색</button>
        </div>
      </form>
      {q ? (
        hits.length > 0 ? (
          <div className="mt-5 space-y-2">
            <p className="text-xs text-gray-500">"{q}" 검색 결과 {hits.length}건 — 본인 매장 클릭</p>
            {hits.map((h) => (
              <Link key={h.id} href={`/sell/new?listing=${encodeURIComponent(h.id)}`}
                className="block rounded-lg border border-gray-200 bg-white p-3 transition hover:border-amber-400 hover:bg-amber-50">
                <div className="font-bold text-gray-900">{h.studio.place_name}</div>
                <div className="mt-0.5 text-xs text-gray-500">{[h.sigungu, h.dong].filter(Boolean).join(" · ")} · {h.studio.road_address_name || h.studio.address_name}</div>
                <div className="mt-1 text-[11px] text-amber-700">권리금 추정 {fmtMan(h.estimate.key_money.mid)} · 디지털 {h.digital_grade}급</div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-600">
            "{q}" 검색 결과 없음. <Link href="/sell/new?step=verify&listing=NEW" className="text-amber-700 underline">신규 매물로 등록</Link>
          </div>
        )
      ) : (
        <div className="mt-5 rounded-lg bg-gray-50 p-4 text-xs text-gray-600">
          매장을 못 찾으셨나요? <Link href="/sell/new?step=verify&listing=NEW" className="font-bold text-amber-700 underline">신규 등록으로 바로 진행</Link>
        </div>
      )}
    </div>
  );
}

function Step2to5Form({ listing: l, action }: { listing: ReturnType<typeof getListing>; action: (fd: FormData) => Promise<void> }) {
  if (!l) return null;
  return (
    <form action={action} className="space-y-6">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <div className="font-semibold">선택 매물</div>
        <div className="mt-1">{l.studio.place_name} · {[l.sigungu, l.dong].filter(Boolean).join(" · ")}</div>
        <div className="mt-1 text-xs">매물번호 {l.id} · <Link href={`/listings/${l.id}`} className="underline">상세 보기</Link> · <Link href="/sell/new?step=find" className="underline">다른 매장 찾기</Link></div>
      </div>

      <input type="hidden" name="listing_id" value={l.id} />

      <div className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-6 sm:grid-cols-2">
        <h2 className="sm:col-span-2 text-base font-bold text-gray-900">2. 본인확인</h2>
        <FormField label="대표자 성함" name="name" placeholder="홍길동" />
        <FormField label="휴대폰" name="phone" type="tel" required placeholder="010-0000-0000" helper="등록 후 24시간 내 운영팀이 통화로 본인확인" />
      </div>

      <div className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-6 sm:grid-cols-2">
        <h2 className="sm:col-span-2 text-base font-bold text-gray-900">3. 가격 · 시점</h2>
        <FormField label="희망 권리금 (만원)" name="asking" type="number" placeholder={`예 ${l.estimate.key_money.mid}`} helper={`pilaos 추정: ${fmtMan(l.estimate.key_money.mid)} (low ${fmtMan(l.estimate.key_money.low)} ~ high ${fmtMan(l.estimate.key_money.high)})`} />
        <FormField label="시점" name="timing" options={[
          { value: "immediate", label: "즉시" },
          { value: "1m", label: "1개월 내" },
          { value: "3m", label: "3개월 내" },
          { value: "6m", label: "6개월 내" },
          { value: "later", label: "검토 단계" },
        ]} />
        <FormField label="매도 사유" name="reason" options={[
          { value: "health", label: "건강 / 가정사" },
          { value: "relocation", label: "지역 이전" },
          { value: "expansion", label: "확장 (기존점 정리)" },
          { value: "liquidation", label: "청산" },
          { value: "other", label: "기타" },
        ]} />
        <div className="flex items-center gap-2 sm:col-span-1">
          <input type="checkbox" id="flex" name="flexible" value="1" defaultChecked />
          <label htmlFor="flex" className="text-sm">가격 협의 가능</label>
        </div>
      </div>

      <div className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-6 sm:grid-cols-2">
        <h2 className="sm:col-span-2 text-base font-bold text-gray-900">4. 노출 옵션</h2>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="anon" name="anonymous" value="1" defaultChecked />
          <label htmlFor="anon" className="text-sm">익명 노출 (상호 비공개, 시군구·동까지만)</label>
        </div>
        <FormField label="추가 메모 (선택)" name="message" type="textarea" rows={3} placeholder="회원 인수인계, 강사 승계, 임대인 협조 등" />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-base font-bold text-gray-900">5. 검토 · 접수</h2>
        <p className="mt-2 text-xs text-gray-600">아래 내용으로 운영팀에 매도 의향이 접수됩니다. 본인확인 통화 후 매물 정보 수정·매수자 매칭이 시작됩니다.</p>
        <ul className="mt-3 list-disc pl-5 text-xs text-gray-700 space-y-1">
          <li>이 매물에 N명 매수 의향 등록 (실시간 — 향후)</li>
          <li>NDA 후 진성정보 공개</li>
          <li>변호사 동반 실사 패키지 (선택)</li>
          <li>거래 성공 시 수수료 1~3%</li>
        </ul>
        <button type="submit" className="mt-5 w-full rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white hover:bg-gray-700">매도 의향 접수하기</button>
      </div>
    </form>
  );
}

export const metadata = { title: "매물 등록 위저드", robots: { index: false } };
