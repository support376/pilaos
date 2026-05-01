import Link from "next/link";
import { redirect } from "next/navigation";
import { submitIntent } from "@/lib/intent";
import { FormField } from "@/components/listing/FormField";

type Props = { searchParams: Promise<{ ok?: string }> };

async function action(formData: FormData) {
  "use server";
  const phone = String(formData.get("phone") || "").trim();
  if (!phone) return;
  await submitIntent({
    kind: "start",
    contact_name: String(formData.get("name") || ""),
    contact_phone: phone,
    region_filters: String(formData.get("regions") || "").split(",").map((s) => s.trim()).filter(Boolean),
    budget_total: Number(formData.get("budget") || 0) || 0,
    preferred_size_pyeong: Number(formData.get("size") || 0) || undefined,
    preferred_concept: String(formData.get("concept") || "").trim() || undefined,
    timing: (String(formData.get("timing") || "3m") as "1m" | "3m" | "6m" | "1y"),
    message: String(formData.get("message") || "").trim() || undefined,
  });
  redirect("/start/intent?ok=1");
}

export default async function StartIntent({ searchParams }: Props) {
  const sp = await searchParams;
  if (sp.ok === "1") {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
          <div className="text-5xl">✓</div>
          <h1 className="mt-3 text-xl font-bold text-emerald-900">창업 상담 신청 완료</h1>
          <p className="mt-2 text-sm text-emerald-800">관심 지역 시세 리포트 + 추천 매물을 정리해드립니다.</p>
          <Link href="/listings" className="mt-6 inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-gray-700">매물 둘러보기</Link>
        </div>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold">창업 의향 등록</h1>
      <p className="mt-1 text-sm text-gray-600">신규 창업 vs 매물 인수 비교 시뮬레이션 + 시세 리포트 무료 제공</p>
      <form action={action} className="mt-6 grid gap-5 rounded-2xl border border-gray-200 bg-white p-6 sm:grid-cols-2">
        <FormField label="성함" name="name" />
        <FormField label="휴대폰" name="phone" type="tel" required placeholder="010-0000-0000" />
        <FormField label="관심 지역 (콤마)" name="regions" placeholder="강남구, 서초구" />
        <FormField label="예산 (만원)" name="budget" type="number" required />
        <FormField label="원하는 평수" name="size" type="number" />
        <FormField label="시점" name="timing" options={[
          { value: "1m", label: "1개월" },
          { value: "3m", label: "3개월" },
          { value: "6m", label: "6개월" },
          { value: "1y", label: "1년 내" },
        ]} />
        <FormField label="컨셉 (선택)" name="concept" placeholder="기구필라테스 / 그룹+1:1 / 프리미엄" />
        <FormField label="메모 (선택)" name="message" type="textarea" />
        <div className="sm:col-span-2 flex gap-2">
          <button type="submit" className="flex-1 rounded-md bg-gray-900 px-5 py-3 text-sm font-bold text-white hover:bg-gray-700">상담 신청</button>
        </div>
      </form>
    </div>
  );
}

export const metadata = { title: "창업 의향 등록", robots: { index: false } };
