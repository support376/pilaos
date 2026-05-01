import Link from "next/link";
import { redirect } from "next/navigation";
import { getListing } from "@/lib/listings";
import { submitIntent } from "@/lib/intent";
import { FormField } from "@/components/listing/FormField";

type Props = { searchParams: Promise<{ listing?: string; ok?: string }> };

async function action(formData: FormData) {
  "use server";
  const phone = String(formData.get("phone") || "").trim();
  const listing_id = String(formData.get("listing_id") || "").trim();
  if (!phone || !listing_id) return;
  await submitIntent({
    kind: "close",
    contact_name: String(formData.get("name") || ""),
    contact_phone: phone,
    listing_id,
    lease_remaining_months: Number(formData.get("lease") || 0) || undefined,
    active_member_count: Number(formData.get("members") || 0) || undefined,
    issues: String(formData.get("issues") || "").split(",").map((s) => s.trim()).filter(Boolean),
    preferred_outcome: (String(formData.get("outcome") || "transfer_first") as "transfer_first" | "shutdown_only"),
    message: String(formData.get("message") || "").trim() || undefined,
  });
  redirect(`/close/intent?ok=1`);
}

export default async function CloseIntent({ searchParams }: Props) {
  const sp = await searchParams;
  const l = sp.listing ? getListing(sp.listing) : null;
  if (sp.ok === "1") {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
          <div className="text-5xl">✓</div>
          <h1 className="mt-3 text-xl font-bold text-emerald-900">폐업 패키지 신청 완료</h1>
          <p className="mt-2 text-sm text-emerald-800">우선 양수도 매칭을 시도하고, 안 되면 폐업 정리를 진행합니다.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold">폐업 패키지 신청</h1>
      <p className="mt-1 text-sm text-gray-600">임대 협상 · 회원 환급/승계 · 비품 처분 · 세무 마무리 정액 패키지 (200~500만원)</p>

      {l ? (
        <div className="mt-4 rounded-lg bg-rose-50 p-4 text-sm text-rose-900">대상 매물: <strong>{l.studio.place_name}</strong> ({l.id})</div>
      ) : null}

      <form action={action} className="mt-6 grid gap-5 rounded-2xl border border-gray-200 bg-white p-6 sm:grid-cols-2">
        <input type="hidden" name="listing_id" value={l?.id ?? ""} required />
        <FormField label="성함" name="name" />
        <FormField label="휴대폰" name="phone" type="tel" required />
        <FormField label="임대 잔여 (개월)" name="lease" type="number" />
        <FormField label="활성 회원수" name="members" type="number" />
        <FormField label="원하는 결과" name="outcome" options={[
          { value: "transfer_first", label: "우선 양수도 시도 → 안 되면 폐업" },
          { value: "shutdown_only", label: "양수도 패스, 폐업 정리만" },
        ]} />
        <FormField label="이슈 (콤마)" name="issues" placeholder="임대인 미협조, 회원 환급 부담, 강사 퇴직금" />
        <FormField label="추가 메모" name="message" type="textarea" />
        <div className="sm:col-span-2 flex gap-2">
          <button type="submit" className="flex-1 rounded-md bg-gray-900 px-5 py-3 text-sm font-bold text-white hover:bg-gray-700">폐업 패키지 신청</button>
        </div>
      </form>
    </div>
  );
}

export const metadata = { title: "폐업 패키지 신청", robots: { index: false } };
