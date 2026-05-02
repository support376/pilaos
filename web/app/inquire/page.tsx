import Link from "next/link";
import { redirect } from "next/navigation";
import { getListing, regionTree } from "@/lib/listings";
import { submitIntent } from "@/lib/intent";
import { RegionSelect } from "@/components/listing/RegionSelect";

export const metadata = { title: "무료 상담 신청 — pilaos", robots: { index: false } };

type Props = { searchParams: Promise<{ kind?: string; listing?: string; ok?: string; src?: string }> };

async function buyerAction(formData: FormData) {
  "use server";
  const phone = String(formData.get("phone") || "").trim();
  if (!phone) return;

  const listing_id = String(formData.get("listing_id") || "").trim();
  const mode = listing_id ? "matched" : "open";

  const role = (formData.getAll("role") as string[]).filter(Boolean) as ("instructor" | "owner" | "first_time" | "investor")[];
  const priorities = (formData.getAll("priorities") as string[]).filter(Boolean) as ("region" | "price" | "yield" | "facility" | "operating")[];
  const sido = String(formData.get("sido") || "").trim();
  const sigungu = String(formData.get("sigungu") || "").trim();
  const cash = Number(formData.get("capital_cash") || 0) || 0;
  const loan = Number(formData.get("capital_loan") || 0) || 0;
  const timing = (String(formData.get("timing") || "3m") as "now" | "3m" | "6m" | "later");
  const instructor_qualified = String(formData.get("instructor_qualified") || "") === "1";
  const source = String(formData.get("source") || "inquire") || "inquire";

  await submitIntent({
    kind: "buyer",
    mode,
    listing_id: listing_id || undefined,
    contact_name: String(formData.get("name") || "").trim(),
    contact_phone: phone,
    role: role.length ? role : ["first_time"],
    sido: sido || undefined,
    sigungu: sigungu || undefined,
    priorities,
    capital_cash: cash || undefined,
    capital_loan: loan || undefined,
    timing,
    instructor_qualified,
    source,
    message: String(formData.get("message") || "").trim() || undefined,
  });

  redirect(`/inquire?ok=1${listing_id ? `&listing=${encodeURIComponent(listing_id)}` : ""}`);
}

async function sellerAction(formData: FormData) {
  "use server";
  const phone = String(formData.get("phone") || "").trim();
  if (!phone) return;
  const listing_id = String(formData.get("listing_id") || "").trim();
  await submitIntent({
    kind: "seller",
    listing_id: listing_id || undefined,
    contact_name: String(formData.get("name") || "").trim(),
    contact_phone: phone,
    place_name: String(formData.get("place_name") || "").trim() || undefined,
    sido: String(formData.get("sido") || "").trim() || undefined,
    sigungu: String(formData.get("sigungu") || "").trim() || undefined,
    area_pyeong: Number(formData.get("area_pyeong") || 0) || undefined,
    deposit: Number(formData.get("deposit") || 0) || undefined,
    monthly_rent: Number(formData.get("monthly_rent") || 0) || undefined,
    asking_key_money: Number(formData.get("asking_key_money") || 0) || undefined,
    sell_reason: (String(formData.get("sell_reason") || "other") as "health" | "relocation" | "expansion" | "liquidation" | "other"),
    timing: (String(formData.get("timing") || "3m") as "immediate" | "1m" | "3m" | "6m" | "later"),
    message: String(formData.get("message") || "").trim() || undefined,
  });
  redirect(`/inquire?ok=1${listing_id ? `&listing=${encodeURIComponent(listing_id)}` : ""}`);
}

export default async function Inquire({ searchParams }: Props) {
  const sp = await searchParams;
  const tree = regionTree();
  const l = sp.listing ? getListing(sp.listing) : null;
  const isSell = sp.kind === "sell";

  if (sp.ok === "1") {
    return (
      <div className="mx-auto max-w-md px-4 py-12">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <div className="text-5xl">✓</div>
          <h1 className="mt-3 text-xl font-bold text-emerald-900">접수 완료</h1>
          <p className="mt-2 text-sm text-emerald-800">24시간 내 운영팀이 카톡으로 인사드립니다.<br />30분 무료 상담부터 시작합니다.</p>
          <div className="mt-5 flex gap-2 justify-center">
            <Link href="/" className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white">홈으로</Link>
            <Link href="/listings" className="rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-bold text-emerald-800">매물 더 보기</Link>
          </div>
        </div>
      </div>
    );
  }

  if (isSell) {
    // ── 매도자 단순 claim 폼 ──
    return (
      <div className="mx-auto max-w-md px-4 py-6 sm:py-10">
        <h1 className="text-xl font-bold sm:text-2xl">매물 등록 (매도자)</h1>
        <p className="mt-1 text-xs text-gray-500">{l ? `이 매물(${l.studio.place_name})의 운영자분이세요?` : "매장 정보만 알려주세요. 운영팀이 카톡으로 확인드립니다."}</p>

        <form action={sellerAction} className="mt-5 space-y-4 rounded-2xl border border-gray-200 bg-white p-5">
          {l ? <input type="hidden" name="listing_id" value={l.id} /> : null}

          <Field label="휴대폰" name="phone" type="tel" required placeholder="010-0000-0000" />
          <Field label="성함 (선택)" name="name" />
          <Field label="매장 상호" name="place_name" defaultValue={l?.studio.place_name ?? ""} />

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">지역</label>
            <RegionSelect metros={tree.metros} dos={tree.dos} defaultSido={l?.sido ?? ""} defaultSigungu={l?.sigungu ?? ""} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Field label="평수" name="area_pyeong" type="number" placeholder="30" />
            <Field label="희망 권리금 (만)" name="asking_key_money" type="number" placeholder="5000" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Field label="보증금 (만)" name="deposit" type="number" placeholder="3000" />
            <Field label="월세 (만)" name="monthly_rent" type="number" placeholder="200" />
          </div>

          <RadioGroup label="매도 사유" name="sell_reason" options={[
            { v: "health", label: "건강" },
            { v: "relocation", label: "이전" },
            { v: "expansion", label: "확장" },
            { v: "liquidation", label: "청산" },
            { v: "other", label: "기타" },
          ]} defaultValue="other" />

          <RadioGroup label="희망 시기" name="timing" options={[
            { v: "immediate", label: "즉시" },
            { v: "1m", label: "1개월" },
            { v: "3m", label: "3개월" },
            { v: "6m", label: "6개월" },
            { v: "later", label: "검토 단계" },
          ]} defaultValue="3m" />

          <Field label="메모 (선택)" name="message" textarea rows={2} />

          <button type="submit" className="w-full rounded-lg bg-gray-900 px-5 py-4 text-base font-bold text-white hover:bg-gray-700">
            매물 등록 신청
          </button>
          <p className="text-center text-[11px] text-gray-400">제출 시 <Link href="/terms" className="underline">이용약관</Link> · <Link href="/privacy" className="underline">개인정보처리방침</Link>에 동의합니다.</p>
        </form>
      </div>
    );
  }

  // ── 매수자 폼 (갈래 A: matched / 갈래 B: open) ──
  const matched = !!l;

  return (
    <div className="mx-auto max-w-md px-4 py-6 sm:py-10">
      <h1 className="text-xl font-bold sm:text-2xl">
        {matched ? "이 매물에 관심 있어요" : "매물 살 생각 있어요"}
      </h1>
      <p className="mt-1 text-xs text-gray-500">
        {matched
          ? "휴대폰 + 예산만 알려주세요. 운영팀이 매도자에게 컨택 대행합니다."
          : "조건만 등록하시면 우리 풀에서 매칭 매물을 카톡으로 보내드립니다."}
      </p>

      {l ? (
        <div className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
          <strong>관심 매물:</strong> {l.studio.place_name}
          <div className="text-amber-800/80">{l.sido} {l.sigungu}</div>
        </div>
      ) : null}

      <form action={buyerAction} className="mt-5 space-y-5 rounded-2xl border border-gray-200 bg-white p-5">
        {l ? <input type="hidden" name="listing_id" value={l.id} /> : null}
        <input type="hidden" name="source" value={sp.src ?? "inquire"} />

        <Field label="휴대폰 *" name="phone" type="tel" required placeholder="010-0000-0000" />
        <Field label="성함 (선택)" name="name" />

        {/* 역할 */}
        <CheckGroup label="어떤 분이세요?" name="role" options={[
          { v: "instructor", label: "현직 강사" },
          { v: "owner", label: "현직 원장" },
          { v: "first_time", label: "예비 창업" },
          { v: "investor", label: "투자자" },
        ]} />

        {/* 갈래 B에서만: 우선순위 + 지역 */}
        {!matched ? (
          <>
            <CheckGroup label="우선순위 (1~2개)" name="priorities" options={[
              { v: "region", label: "지역" },
              { v: "price", label: "가격" },
              { v: "yield", label: "수익률" },
              { v: "facility", label: "시설" },
              { v: "operating", label: "운영중" },
            ]} />

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">관심 지역</label>
              <RegionSelect metros={tree.metros} dos={tree.dos} />
            </div>
          </>
        ) : null}

        {/* 자금 — 두 칸 합계 */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">예산 한도 (만원)</label>
          <div className="grid grid-cols-2 gap-2">
            <input name="capital_cash" type="number" placeholder="현금 5000" inputMode="numeric"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" />
            <input name="capital_loan" type="number" placeholder="대출 가능 5000" inputMode="numeric"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" />
          </div>
          <p className="mt-1 text-[11px] text-gray-400">합계가 총 인수자금 한도입니다. 모르시면 비워두셔도 됩니다.</p>
        </div>

        <RadioGroup label="시기" name="timing" options={[
          { v: "now", label: "즉시" },
          { v: "3m", label: "3개월 내" },
          { v: "6m", label: "6개월 내" },
          { v: "later", label: "검토 단계" },
        ]} defaultValue="3m" />

        {/* 강사 자격 */}
        <div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="instructor_qualified" value="1" className="accent-gray-900" />
            강사 자격이 있습니다
          </label>
        </div>

        <Field label="메모 (선택, 200자)" name="message" textarea rows={2} />

        <button type="submit" className="w-full rounded-lg bg-gray-900 px-5 py-4 text-base font-bold text-white hover:bg-gray-700">
          {matched ? "매수 의향 등록 →" : "조건 등록 + 매물 추천 받기 →"}
        </button>
        <p className="text-center text-[11px] text-gray-400">제출 시 <Link href="/terms" className="underline">이용약관</Link> · <Link href="/privacy" className="underline">개인정보처리방침</Link>에 동의합니다.</p>
      </form>
    </div>
  );
}

/* ── helpers ── */
function Field({ label, name, type = "text", required, placeholder, defaultValue, textarea, rows = 3 }: {
  label: string; name: string; type?: string; required?: boolean; placeholder?: string; defaultValue?: string; textarea?: boolean; rows?: number;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-bold text-gray-700">{label}</label>
      {textarea ? (
        <textarea id={name} name={name} rows={rows} required={required} placeholder={placeholder} defaultValue={defaultValue}
          maxLength={200}
          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none" />
      ) : (
        <input id={name} name={name} type={type} required={required} placeholder={placeholder} defaultValue={defaultValue}
          inputMode={type === "number" ? "numeric" : type === "tel" ? "tel" : "text"}
          autoComplete={type === "tel" ? "tel" : type === "text" ? "name" : undefined}
          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-gray-900 focus:outline-none" />
      )}
    </div>
  );
}

function CheckGroup({ label, name, options }: { label: string; name: string; options: { v: string; label: string }[] }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-700 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.v} className="flex cursor-pointer items-center gap-1 rounded-full border border-gray-300 px-3 py-1.5 text-xs has-[:checked]:border-gray-900 has-[:checked]:bg-gray-900 has-[:checked]:text-white">
            <input type="checkbox" name={name} value={o.v} className="hidden" />
            {o.label}
          </label>
        ))}
      </div>
    </div>
  );
}

function RadioGroup({ label, name, options, defaultValue }: { label: string; name: string; options: { v: string; label: string }[]; defaultValue?: string }) {
  return (
    <fieldset>
      <legend className="text-xs font-bold text-gray-700 mb-2">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.v} className="flex cursor-pointer items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm has-[:checked]:border-gray-900 has-[:checked]:bg-gray-900 has-[:checked]:text-white">
            <input type="radio" name={name} value={o.v} defaultChecked={o.v === defaultValue} className="hidden" />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
