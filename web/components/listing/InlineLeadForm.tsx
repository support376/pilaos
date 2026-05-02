import { redirect } from "next/navigation";
import { submitIntent } from "@/lib/intent";
import Link from "next/link";

async function inlineAction(formData: FormData) {
  "use server";
  const phone = String(formData.get("phone") || "").trim();
  if (!phone) return;
  const listing_id = String(formData.get("listing_id") || "").trim();
  await submitIntent({
    kind: "buyer",
    mode: "matched",
    listing_id,
    contact_name: "",
    contact_phone: phone,
    role: ["first_time"],
    capital_cash: Number(formData.get("capital_cash") || 0) || undefined,
    capital_loan: Number(formData.get("capital_loan") || 0) || undefined,
    timing: (String(formData.get("timing") || "3m") as "now" | "3m" | "6m" | "later"),
    source: "listing_inline",
  });
  redirect(`/inquire?ok=1&listing=${encodeURIComponent(listing_id)}`);
}

export function InlineLeadForm({ listingId, placeName }: { listingId: string; placeName: string }) {
  return (
    <form action={inlineAction} className="rounded-2xl border-2 border-gray-900 bg-gray-50 p-5">
      <input type="hidden" name="listing_id" value={listingId} />
      <div className="text-xs font-bold uppercase tracking-wider text-amber-700">이 매물에 관심 있어요</div>
      <h3 className="mt-1 text-lg font-bold">{placeName}</h3>
      <p className="mt-1 text-xs text-gray-600">휴대폰만 남기시면 24시간 내 운영팀이 카톡으로 인사드립니다.</p>

      <div className="mt-4 space-y-2">
        <input
          name="phone"
          type="tel"
          required
          placeholder="휴대폰 010-0000-0000"
          inputMode="tel"
          autoComplete="tel"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-gray-900 focus:outline-none"
        />

        <div className="grid grid-cols-2 gap-2">
          <input name="capital_cash" type="number" placeholder="현금 (만)" inputMode="numeric"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" />
          <input name="capital_loan" type="number" placeholder="대출 가능 (만)" inputMode="numeric"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" />
        </div>

        <select name="timing" defaultValue="3m" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900">
          <option value="now">시기: 즉시 시작</option>
          <option value="3m">시기: 3개월 내</option>
          <option value="6m">시기: 6개월 내</option>
          <option value="later">시기: 검토 단계</option>
        </select>

        <button type="submit" className="w-full rounded-lg bg-gray-900 px-5 py-3.5 text-base font-bold text-white hover:bg-gray-700">
          매수 의향 등록 →
        </button>
        <p className="text-[11px] text-gray-500 text-center">
          더 자세히? <Link href={`/inquire?listing=${encodeURIComponent(listingId)}&kind=acquire`} className="underline hover:text-gray-900">전체 폼 작성</Link>
        </p>
      </div>
    </form>
  );
}
