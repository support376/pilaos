import { redirect } from "next/navigation";
import { submitIntent } from "@/lib/intent";
import Link from "next/link";

async function inlineAction(formData: FormData) {
  "use server";
  const phone = String(formData.get("phone") || "").trim();
  if (!phone) return;
  const listing_id = String(formData.get("listing_id") || "").trim();
  await submitIntent({
    kind: "buyer", mode: "matched", listing_id,
    contact_name: "", contact_phone: phone,
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
    <form action={inlineAction} className="rounded-2xl border-2 border-black bg-white p-5">
      <input type="hidden" name="listing_id" value={listingId} />
      <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">이 매물 신청</div>
      <h3 className="mt-1 text-lg font-extrabold">{placeName}</h3>
      <p className="mt-1 text-xs text-black/60">휴대폰만 남기시면 24시간 안에 운영팀이 카톡으로 연락드립니다.</p>

      <div className="mt-4 space-y-2">
        <input
          name="phone" type="tel" required placeholder="휴대폰 010-0000-0000"
          inputMode="tel" autoComplete="tel"
          className="w-full rounded-lg border border-black/15 px-4 py-3 text-base focus:border-black focus:outline-none"
        />

        <div className="grid grid-cols-2 gap-2">
          <input name="capital_cash" type="number" placeholder="현금 (만)" inputMode="numeric"
            className="rounded-md border border-black/15 px-3 py-2 text-sm focus:border-black focus:outline-none" />
          <input name="capital_loan" type="number" placeholder="대출 가능 (만)" inputMode="numeric"
            className="rounded-md border border-black/15 px-3 py-2 text-sm focus:border-black focus:outline-none" />
        </div>

        <select name="timing" defaultValue="3m" className="w-full rounded-md border border-black/15 px-3 py-2 text-sm focus:border-black">
          <option value="now">언제? · 즉시 시작</option>
          <option value="3m">언제? · 3개월 안</option>
          <option value="6m">언제? · 6개월 안</option>
          <option value="later">언제? · 아직 검토 중</option>
        </select>

        <button type="submit" className="w-full rounded-lg bg-black px-5 py-3.5 text-base font-bold text-white hover:bg-black/85">
          이 매물 신청하기 →
        </button>
        <p className="text-[11px] text-black/55 text-center">
          더 자세히 적고 싶으시면 <Link href={`/inquire?listing=${encodeURIComponent(listingId)}&kind=acquire`} className="underline hover:text-black">전체 폼</Link>
        </p>
      </div>
    </form>
  );
}
