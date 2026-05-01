import Link from "next/link";
import { redirect } from "next/navigation";
import { getListing } from "@/lib/listings";
import { submitIntent } from "@/lib/intent";
import { FormField } from "@/components/listing/FormField";

type Props = { searchParams: Promise<{ listing?: string; ok?: string }> };

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
  redirect(`/sell/new?listing=${encodeURIComponent(listing_id)}&ok=1`);
}

export default async function SellNew({ searchParams }: Props) {
  const sp = await searchParams;
  const l = sp.listing ? getListing(sp.listing) : null;

  if (sp.ok === "1") {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
          <div className="text-5xl">✓</div>
          <h1 className="mt-3 text-xl font-bold text-emerald-900">매도 의향 접수 완료</h1>
          <p className="mt-2 text-sm text-emerald-800">24시간 이내 등록된 번호로 운영팀이 연락드립니다.</p>
          <Link href="/listings" className="mt-6 inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-gray-700">매물 둘러보기</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold">매물 등록 / 매도 의향</h1>
      <p className="mt-1 text-sm text-gray-600">5단계 위저드 — 본인확인 → 기본정보 → 계약조건 → 운영숫자 → 가격·노출</p>

      {l ? (
        <div className="mt-4 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
          연결 매물: <strong>{l.studio.place_name}</strong> ({l.id}). <Link href={`/listings/${l.id}`} className="underline">상세 보기</Link>
        </div>
      ) : (
        <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
          내 매장이 이미 매물 풀에 있다면 <Link href="/listings" className="underline">검색에서 찾아 "이 매물 주인입니다"</Link>로 시작하면 자동 연결됩니다.
        </div>
      )}

      <form action={action} className="mt-6 grid gap-5 rounded-2xl border border-gray-200 bg-white p-6 sm:grid-cols-2">
        <h2 className="sm:col-span-2 text-sm font-bold text-gray-700">1. 본인확인</h2>
        <FormField label="대표자 성함" name="name" placeholder="홍길동" />
        <FormField label="휴대폰" name="phone" type="tel" required placeholder="010-0000-0000" helper="본인확인 통화에 사용" />
        <input type="hidden" name="listing_id" value={l?.id ?? ""} required />

        <h2 className="sm:col-span-2 mt-2 text-sm font-bold text-gray-700">5. 가격 · 노출</h2>
        <FormField label="희망 권리금 (만원)" name="asking" type="number" placeholder="예 7000" />
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
        <div className="flex items-center gap-2">
          <input type="checkbox" id="flex" name="flexible" value="1" defaultChecked />
          <label htmlFor="flex" className="text-sm">가격 협의 가능</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="anon" name="anonymous" value="1" defaultChecked />
          <label htmlFor="anon" className="text-sm">익명 노출 (상호 비공개)</label>
        </div>

        <FormField label="추가 메모 (선택)" name="message" type="textarea" rows={3} placeholder="회원 인수인계, 강사 승계, 임대인 협조 등" />

        <div className="sm:col-span-2 rounded-lg bg-gray-50 p-4 text-xs text-gray-600">
          접수 후 운영팀이 본인확인 통화 → NDA 체결 → 잠재 매수자 매칭 순서로 진행합니다. 변호사 동반 실사가 필요하면 별도 패키지로 안내해드립니다.
        </div>

        <div className="sm:col-span-2 flex gap-2">
          <button type="submit" className="flex-1 rounded-md bg-gray-900 px-5 py-3 text-sm font-bold text-white hover:bg-gray-700">매도 의향 접수</button>
        </div>
      </form>
    </div>
  );
}

export const metadata = { title: "매물 등록 / 매도 의향", robots: { index: false } };
