import { redirect } from "next/navigation";
import { submitIntent } from "@/lib/intent";

async function quickAction(formData: FormData) {
  "use server";
  const phone = String(formData.get("phone") || "").trim();
  if (!phone) return;
  const sido = String(formData.get("sido") || "").trim();
  const cash = Number(formData.get("capital_cash") || 0) || undefined;
  const loan = Number(formData.get("capital_loan") || 0) || undefined;
  const timing = (String(formData.get("timing") || "3m") as "now" | "3m" | "6m" | "later");

  await submitIntent({
    kind: "buyer", mode: "open",
    contact_name: "", contact_phone: phone,
    role: ["first_time"], sido: sido || undefined,
    capital_cash: cash, capital_loan: loan, timing,
    source: "home_quick",
  });
  redirect(`/inquire?ok=1`);
}

export function QuickIntentForm() {
  return (
    <form action={quickAction} className="space-y-2.5 rounded-2xl border-2 border-black bg-white p-5">
      <div className="text-[11px] font-bold uppercase tracking-widest text-blue-600">조건만 알려주기</div>
      <h3 className="text-lg font-extrabold">특정 매물이 없어도 됩니다.</h3>
      <p className="text-xs text-black/60">조건만 알려주시면 매칭한 매물 5개를 카톡으로 보내드립니다.</p>

      <input
        name="phone" type="tel" required placeholder="휴대폰 010-0000-0000"
        inputMode="tel" autoComplete="tel"
        className="w-full rounded-lg border border-black/15 px-4 py-3 text-base focus:border-black focus:outline-none"
      />

      <select name="sido" defaultValue="" className="w-full rounded-md border border-black/15 px-3 py-2.5 text-sm focus:border-black">
        <option value="">관심 지역 (선택)</option>
        <optgroup label="광역시">
          {["서울","부산","대구","인천","광주","대전","울산","세종"].map(s => <option key={s} value={s}>{s}</option>)}
        </optgroup>
        <optgroup label="도">
          {["경기","강원","충북","충남","전북","전남","경북","경남","제주"].map(s => <option key={s} value={s}>{s}</option>)}
        </optgroup>
      </select>

      <div className="grid grid-cols-2 gap-2">
        <input name="capital_cash" type="number" placeholder="현금 (만)" inputMode="numeric"
          className="rounded-md border border-black/15 px-3 py-2 text-sm focus:border-black focus:outline-none" />
        <input name="capital_loan" type="number" placeholder="대출 가능 (만)" inputMode="numeric"
          className="rounded-md border border-black/15 px-3 py-2 text-sm focus:border-black focus:outline-none" />
      </div>

      <select name="timing" defaultValue="3m" className="w-full rounded-md border border-black/15 px-3 py-2.5 text-sm focus:border-black">
        <option value="now">언제? · 즉시 시작</option>
        <option value="3m">언제? · 3개월 안</option>
        <option value="6m">언제? · 6개월 안</option>
        <option value="later">언제? · 아직 검토 중</option>
      </select>

      <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-3.5 text-base font-bold text-white hover:bg-blue-700">
        매물 추천 받기 →
      </button>
    </form>
  );
}
