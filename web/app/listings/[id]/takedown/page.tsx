import Link from "next/link";
import { redirect } from "next/navigation";
import { getListing } from "@/lib/listings";
import { submitIntent } from "@/lib/intent";
import { FormField } from "@/components/listing/FormField";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string }> };

async function action(formData: FormData) {
  "use server";
  const id = String(formData.get("listing_id") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const reason = String(formData.get("reason") || "").trim();
  const biz_number = String(formData.get("biz_number") || "").trim();
  if (!id || !phone) return;

  // 일단 매도 인텐트 채널 재사용 (운영팀 webhook 알림). v3.1에서 별도 takedown 테이블로.
  await submitIntent({
    kind: "close",
    contact_name: name,
    contact_phone: phone,
    listing_id: id,
    issues: ["TAKEDOWN", reason || "—"],
    preferred_outcome: "shutdown_only",
    message: `[TAKE-DOWN 요청] 사업자번호 ${biz_number || "미입력"} · 사유: ${reason || "—"}`,
  });
  redirect(`/listings/${encodeURIComponent(id)}/takedown?ok=1`);
}

export default async function TakedownPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const l = getListing(id);

  if (sp.ok === "1") {
    return (
      <div className="mx-auto max-w-xl px-4 py-12">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8">
          <div className="text-5xl text-center">✓</div>
          <h1 className="mt-3 text-xl font-bold text-emerald-900 text-center">노출 거부 신청 접수 완료</h1>
          <p className="mt-3 text-sm text-emerald-800 text-center">24시간 이내 처리해드립니다.</p>
          <ol className="mt-6 list-decimal pl-5 text-sm text-emerald-900/85 space-y-2">
            <li><strong>접수 즉시</strong> — 운영팀 인박스에 알림 도착, 임시 hide 처리 가능</li>
            <li><strong>1시간~24시간 내</strong> — 등록 휴대폰으로 본인확인 통화 → 영구 hide</li>
            <li><strong>완료 후</strong> — 매물 페이지·검색·시군구 페이지에서 모두 제거. 검색엔진 캐시는 별도 요청</li>
          </ol>
          <div className="mt-6 text-center">
            <Link href="/" className="rounded-md bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-gray-700">홈으로</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!l) {
    return <div className="mx-auto max-w-xl px-4 py-12 text-sm text-gray-500">매물을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-4 flex items-center gap-2 text-xs text-gray-500">
        <Link href="/listings" className="hover:text-gray-900">매물</Link>
        <span>/</span>
        <Link href={`/listings/${l.id}`} className="hover:text-gray-900">{l.studio.place_name}</Link>
        <span>/</span>
        <span className="text-gray-700">노출 거부 신청</span>
      </div>

      <h1 className="text-2xl font-bold">매물 노출 거부 신청</h1>
      <p className="mt-1 text-sm text-gray-600">매장 운영자가 직접 매물 노출을 거부할 수 있습니다. 본인확인 후 24시간 내 hide 처리.</p>

      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <strong>대상 매물:</strong> {l.studio.place_name}<br/>
        <span className="text-xs">{l.id} · {l.sigungu} {l.dong ?? ""}</span>
      </div>

      <form action={action} className="mt-6 grid gap-5 rounded-2xl border border-gray-200 bg-white p-6 sm:grid-cols-2">
        <input type="hidden" name="listing_id" value={l.id} />

        <h2 className="sm:col-span-2 text-base font-bold text-gray-900">본인확인</h2>
        <FormField label="대표자 성함" name="name" required />
        <FormField label="휴대폰" name="phone" type="tel" required placeholder="010-0000-0000" helper="이 번호로 24시간 내 운영팀이 확인 통화" />
        <FormField label="사업자등록번호 (선택)" name="biz_number" placeholder="000-00-00000" helper="입력 시 즉시 본인확인 가속화" />

        <h2 className="sm:col-span-2 mt-4 text-base font-bold text-gray-900">사유</h2>
        <FormField label="노출 거부 사유" name="reason" type="textarea" rows={4} placeholder="예: 매도 의사 없음 / 정보 부정확 / 폐업 / 기타" />

        <div className="sm:col-span-2 rounded-lg bg-gray-50 p-4 text-xs text-gray-700">
          <p className="font-semibold mb-2">노출 거부 효과</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>매물 페이지·리스트·시군구 페이지에서 즉시 제거</li>
            <li>외부 검색엔진 캐시는 별도 요청 가능</li>
            <li>운영팀의 콜드 컨택 do-not-contact 영구 등록</li>
            <li>이후 본인이 직접 매도 의향 등록 시 신규 매물로 활성화 가능</li>
          </ul>
        </div>

        <div className="sm:col-span-2 flex gap-2">
          <button type="submit" className="flex-1 rounded-md bg-gray-900 px-5 py-3 text-sm font-bold text-white hover:bg-gray-700">노출 거부 신청</button>
          <Link href={`/listings/${l.id}`} className="rounded-md border border-gray-300 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50">취소</Link>
        </div>
      </form>
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return { title: `매물 노출 거부 신청 · ${id}`, robots: { index: false } };
}
