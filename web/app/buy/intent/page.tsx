import Link from "next/link";
import { redirect } from "next/navigation";
import { getListing, summary } from "@/lib/listings";
import { submitIntent } from "@/lib/intent";
import { FormField } from "@/components/listing/FormField";

type Props = { searchParams: Promise<{ listing?: string; ok?: string }> };

async function action(formData: FormData) {
  "use server";
  const phone = String(formData.get("phone") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const regions = String(formData.get("regions") || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!phone) return;
  await submitIntent({
    kind: "acquire",
    contact_name: name,
    contact_phone: phone,
    region_filters: regions,
    budget_total: Number(formData.get("budget") || 0) || 0,
    budget_key_money_max: Number(formData.get("key_max") || 0) || undefined,
    min_area_pyeong: Number(formData.get("area_min") || 0) || undefined,
    min_reformer: Number(formData.get("reformer_min") || 0) || undefined,
    experience: (String(formData.get("experience") || "first_time") as "owner" | "instructor" | "investor" | "first_time"),
    urgency: (String(formData.get("urgency") || "1q") as "this_month" | "1q" | "2q" | "later"),
    message: String(formData.get("message") || "").trim() || undefined,
  });
  redirect(`/buy/intent?ok=1`);
}

export default async function BuyIntent({ searchParams }: Props) {
  const sp = await searchParams;
  const l = sp.listing ? getListing(sp.listing) : null;
  const s = summary();
  const top = s.by_sigungu.slice(0, 18).map((x) => x.sigungu);

  if (sp.ok === "1") {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
          <div className="text-5xl">✓</div>
          <h1 className="mt-3 text-xl font-bold text-emerald-900">매수 의향 접수 완료</h1>
          <p className="mt-2 text-sm text-emerald-800">조건 매물이 잡히는 즉시 알림드립니다.</p>
          <Link href="/listings" className="mt-6 inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-gray-700">매물 둘러보기</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold">매수 의향 등록</h1>
      <p className="mt-1 text-sm text-gray-600">조건 입력 → 워치리스트 등록 → 매물 매칭 시 알림 + 운영팀 컨택 대행</p>

      {l ? (
        <div className="mt-4 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-900">
          관심 매물: <strong>{l.studio.place_name}</strong> ({l.id}). NDA 후 진성정보 공개됩니다.
        </div>
      ) : null}

      <form action={action} className="mt-6 grid gap-5 rounded-2xl border border-gray-200 bg-white p-6 sm:grid-cols-2">
        <FormField label="성함" name="name" />
        <FormField label="휴대폰" name="phone" type="tel" required placeholder="010-0000-0000" />
        <FormField label="관심 지역 (콤마 구분)" name="regions" placeholder={top.slice(0, 3).join(", ")} helper="예: 강남구, 서초구, 송파구" />
        <FormField label="총 예산 (만원)" name="budget" type="number" required placeholder="예 15000" />
        <FormField label="권리금 상한 (만원)" name="key_max" type="number" />
        <FormField label="최소 면적 (평)" name="area_min" type="number" />
        <FormField label="최소 리포머 (대)" name="reformer_min" type="number" />
        <FormField label="경험" name="experience" options={[
          { value: "owner", label: "현직 원장" },
          { value: "instructor", label: "강사" },
          { value: "investor", label: "투자자" },
          { value: "first_time", label: "예비창업" },
        ]} />
        <FormField label="긴급도" name="urgency" options={[
          { value: "this_month", label: "이번 달 내" },
          { value: "1q", label: "1분기 내" },
          { value: "2q", label: "2분기 내" },
          { value: "later", label: "검토 단계" },
        ]} />
        <FormField label="메모 (선택)" name="message" type="textarea" rows={3} placeholder="원하는 컨셉, 주차 필수 등" />
        <div className="sm:col-span-2 rounded-lg bg-gray-50 p-4 text-xs text-gray-600">
          자금 증빙(잔액증명·대출 가심사) 업로드는 매칭 후 워크룸에서 진행. 검증된 매수자에게 진성정보 우선 공개.
        </div>
        <div className="sm:col-span-2 flex gap-2">
          <button type="submit" className="flex-1 rounded-md bg-gray-900 px-5 py-3 text-sm font-bold text-white hover:bg-gray-700">매수 의향 등록</button>
        </div>
      </form>
    </div>
  );
}

export const metadata = { title: "매수 의향 등록", robots: { index: false } };
