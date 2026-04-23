import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { getStudioRanked } from "@/lib/db";
import {
  submitWaitlist,
  countWaitlist,
  countWaitlistForStudio,
} from "@/lib/waitlist";

type Params = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string }>;
};

async function submitClaim(formData: FormData) {
  "use server";
  const id = String(formData.get("studio_id") || "").trim();
  const place_name = String(formData.get("place_name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const owner_name = String(formData.get("owner_name") || "").trim();
  const biz_number = String(formData.get("biz_number") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!id || !phone) return;

  const h = await headers();
  const user_agent = h.get("user-agent") ?? undefined;
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    undefined;

  await submitWaitlist({
    kakao_place_id: id,
    place_name,
    phone,
    owner_name: owner_name || undefined,
    biz_number: biz_number || undefined,
    message: message || undefined,
    source_url: `/studio/${id}`,
    user_agent,
    ip,
  });

  redirect(`/claim/${id}?ok=1`);
}

export default async function ClaimPage({ params, searchParams }: Params) {
  const { id } = await params;
  const { ok } = await searchParams;
  const studio = getStudioRanked(id);
  if (!studio) return notFound();

  if (ok === "1") {
    const [total, forMe] = await Promise.all([
      countWaitlist(),
      countWaitlistForStudio(id),
    ]);
    return (
      <main className="mx-auto max-w-xl px-6 py-16">
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-10 text-center">
          <div className="text-5xl mb-4">✓</div>
          <h1 className="text-2xl font-bold text-emerald-900">
            인증 신청 접수 완료
          </h1>
          <p className="mt-3 text-sm text-emerald-800">
            24시간 이내 등록된 번호로 연락드립니다.
          </p>
          <div className="mt-6 space-y-2 rounded-xl bg-white p-5 text-left text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">스튜디오</span>
              <span className="font-semibold">{studio.place_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">전체 대기</span>
              <strong>{total}명</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">이 스튜디오 신청</span>
              <strong>{forMe}건</strong>
            </div>
          </div>
          <Link
            href={`/studio/${id}`}
            className="mt-8 inline-block rounded-lg bg-gray-900 px-6 py-3 text-sm font-bold text-white hover:bg-gray-700"
          >
            ← 스튜디오 페이지로
          </Link>
        </div>
      </main>
    );
  }

  const totalWaitlist = await countWaitlist();

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <Link
        href={`/studio/${id}`}
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        ← {studio.place_name}로 돌아가기
      </Link>

      <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
          오너 인증 신청
        </div>
        <h1 className="mt-3 text-3xl font-extrabold">
          『{studio.place_name}』<br />
          이건 우리 스튜디오입니다
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          인증이 완료되면 전체 분석 · 경쟁사 추적 · CRM · 예약 URL이 열립니다.
        </p>

        <form action={submitClaim} className="mt-8 space-y-5">
          <input type="hidden" name="studio_id" value={studio.kakao_place_id} />
          <input type="hidden" name="place_name" value={studio.place_name} />

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              대표자 휴대폰 번호 <span className="text-rose-500">*</span>
            </label>
            <input
              name="phone"
              type="tel"
              required
              placeholder="010-0000-0000"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-gray-900 focus:outline-none"
            />
            <p className="mt-1.5 text-xs text-gray-500">
              본인인증에 사용되며 24시간 내 이 번호로 연락드립니다.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              대표자 성함
            </label>
            <input
              name="owner_name"
              type="text"
              placeholder="홍길동"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-gray-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              사업자등록번호 (선택)
            </label>
            <input
              name="biz_number"
              type="text"
              placeholder="000-00-00000"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-gray-900 focus:outline-none"
            />
            <p className="mt-1.5 text-xs text-gray-500">
              미입력 시 연락 통화 중 확인합니다. 추후 OCR 자동 인증으로 대체됩니다.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              메모 (선택)
            </label>
            <textarea
              name="message"
              rows={3}
              placeholder="궁금한 점이나 요청사항"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-gray-900 focus:outline-none"
            />
          </div>

          <div className="rounded-lg bg-gray-50 p-4 text-xs text-gray-600">
            인증 완료 후 제공되는 기능
            <ul className="mt-2 space-y-1 ml-4 list-disc">
              <li>전체 개선 항목 + 실행 로드맵</li>
              <li>경쟁사 주간 점수 변화 추적</li>
              <li>월별 지역 순위 추이 차트</li>
              <li>리뷰 자동 요청 · AI 답변 초안</li>
              <li>고객 예약 URL + 자동 리마인더</li>
            </ul>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gray-900 px-6 py-4 text-base font-bold text-white hover:bg-gray-700"
          >
            인증 신청하기
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-gray-500">
          현재까지 <strong className="text-gray-900">{totalWaitlist}명</strong>의
          오너가 인증 신청했습니다
        </div>
      </div>
    </main>
  );
}

export async function generateMetadata({ params }: Params) {
  const { id } = await params;
  const s = getStudioRanked(id);
  return {
    title: `${s?.place_name ?? "스튜디오"} 오너 인증 신청`,
    robots: { index: false },
  };
}
