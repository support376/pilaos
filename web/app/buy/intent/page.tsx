import Link from "next/link";
import { redirect } from "next/navigation";
import { getListing, summary } from "@/lib/listings";
import { submitIntent } from "@/lib/intent";
import { FormField } from "@/components/listing/FormField";
import { fmtMan } from "@/lib/estimate";

type Props = { searchParams: Promise<{ listing?: string; ok?: string }> };

async function action(formData: FormData) {
  "use server";
  const phone = String(formData.get("phone") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const regions = String(formData.get("regions") || "").split(",").map((s) => s.trim()).filter(Boolean);
  const listing_id = String(formData.get("listing_id") || "").trim();
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
    message: (listing_id ? `[매물 ${listing_id}] ` : "") + (String(formData.get("message") || "").trim() || ""),
  });
  redirect(`/buy/intent?ok=1${listing_id ? `&listing=${encodeURIComponent(listing_id)}` : ""}`);
}

export default async function BuyIntent({ searchParams }: Props) {
  const sp = await searchParams;
  const l = sp.listing ? getListing(sp.listing) : null;
  const s = summary();
  const top = s.by_sigungu.slice(0, 18).map((x) => x.sigungu);

  if (sp.ok === "1") {
    return (
      <div className="mx-auto max-w-xl px-4 py-12">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8">
          <div className="text-5xl text-center">✓</div>
          <h1 className="mt-3 text-xl font-bold text-emerald-900 text-center">매수 의향 접수 완료</h1>

          <div className="mt-6 rounded-xl bg-white p-5">
            <p className="font-semibold text-gray-900 mb-3">다음에 어떤 일이 일어나나요?</p>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
              <li><strong>조건 매물 매칭</strong> — 등록 지역·가격대에 맞는 잠재매물 자동 매칭. 새 매물 등록 시 알림.</li>
              <li><strong>매도 의사 미등록 매물 → 운영팀 컨택</strong> — 우리가 매도자에게 "잠재 매수자 N명 대기 중"이라는 메시지로 의향 확인 요청.</li>
              <li><strong>매도자 의향 확인 후 NDA 매칭</strong> — 양측 NDA 후 진성정보(매출장·계약·회원명단) 공개.</li>
              <li><strong>실사 의뢰 (선택)</strong> — 변호사 동반 풀패키지 (3~500만원)로 법률·재무·시설·회원 검증.</li>
              <li><strong>가격 협상·계약·잔금</strong> — 표준 양수도계약 + 회원 승계 절차.</li>
            </ol>
          </div>

          {l ? (
            <div className="mt-4 rounded-xl bg-white p-4 text-xs text-gray-600">
              <strong className="text-gray-900">관심 매물</strong>
              <div className="mt-1">{l.studio.place_name} · 권리금 추정 {fmtMan(l.estimate.key_money.mid)}</div>
              <div className="mt-2">이 매물에 대해 운영팀이 매도자에게 의향 확인 컨택을 우선 진행합니다.</div>
            </div>
          ) : null}

          <div className="mt-4 rounded-xl bg-white p-4 text-xs text-gray-600">
            <p><strong className="text-gray-900">검증된 매수자 배지 받기</strong></p>
            <p className="mt-1">자금 증빙(잔액증명·대출 가심사·LOI)을 업로드하시면 "검증 매수자" 배지를 받고 진성정보 NDA 자동 승인 우선권이 생깁니다. 운영팀이 카톡으로 안내드립니다.</p>
          </div>

          <div className="mt-6 flex gap-2 justify-center">
            <Link href="/listings" className="rounded-md bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-gray-700">매물 더 둘러보기</Link>
            <Link href="/me/watchlist" className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">내 관심 매물</Link>
          </div>
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
          <strong>관심 매물:</strong> {l.studio.place_name} ({l.id})
          <div className="mt-1 text-xs">권리금 추정 {fmtMan(l.estimate.key_money.mid)} · 월수익률 {l.estimate.monthly_yield_pct}% · {l.sigungu}</div>
          <div className="mt-2 text-xs text-emerald-800/80">이 매물 매도자가 미등록 상태라도 운영팀이 직접 컨택해 의향을 확인합니다.</div>
        </div>
      ) : null}

      <form action={action} className="mt-6 grid gap-5 rounded-2xl border border-gray-200 bg-white p-6 sm:grid-cols-2">
        {l ? <input type="hidden" name="listing_id" value={l.id} /> : null}
        <FormField label="성함" name="name" />
        <FormField label="휴대폰" name="phone" type="tel" required placeholder="010-0000-0000" />
        <FormField label="관심 지역 (콤마 구분)" name="regions" defaultValue={l?.sigungu ?? ""} placeholder={top.slice(0, 3).join(", ")} helper="예: 강남구, 서초구, 송파구" />
        <FormField label="총 예산 (만원)" name="budget" type="number" required placeholder={l ? String(l.estimate.total_acquisition.mid) : "예 15000"} />
        <FormField label="권리금 상한 (만원)" name="key_max" type="number" placeholder={l ? String(Math.round(l.estimate.key_money.high)) : ""} />
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
          접수 후 24시간 내 운영팀이 카톡으로 매물 후보 정리해서 보내드립니다. 자금 증빙은 매칭 후 워크룸에서.
        </div>
        <div className="sm:col-span-2 flex gap-2">
          <button type="submit" className="flex-1 rounded-md bg-gray-900 px-5 py-3 text-sm font-bold text-white hover:bg-gray-700">매수 의향 등록</button>
        </div>
      </form>
    </div>
  );
}

export const metadata = { title: "매수 의향 등록", robots: { index: false } };
