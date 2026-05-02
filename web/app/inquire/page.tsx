import Link from "next/link";
import { redirect } from "next/navigation";
import { getListing, regionTree } from "@/lib/listings";
import { submitIntent } from "@/lib/intent";
import { RegionSelect } from "@/components/listing/RegionSelect";

export const metadata = { title: "신청하기 — pilaos", robots: { index: false } };

type Props = { searchParams: Promise<{ kind?: string; listing?: string; ok?: string }> };

async function action(formData: FormData) {
  "use server";
  const phone = String(formData.get("phone") || "").trim();
  if (!phone) return;

  const kindRaw = String(formData.get("kind") || "acquire");
  const intent_type = (["sell", "acquire", "start", "close"] as const).includes(kindRaw as never)
    ? (kindRaw as "sell" | "acquire" | "start" | "close")
    : "acquire";

  const role = formData.getAll("role").map(String) as ("owner" | "instructor" | "investor" | "buyer" | "general")[];
  const name = String(formData.get("name") || "").trim();
  const sido = String(formData.get("sido") || "").trim();
  const sigungu = String(formData.get("sigungu") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const listing_id = String(formData.get("listing_id") || "").trim();

  await submitIntent({
    kind: "inquire",
    intent_type,
    contact_name: name,
    contact_phone: phone,
    role: role.length ? role : ["general"],
    sido: sido || undefined,
    sigungu: sigungu || undefined,
    listing_id: listing_id || undefined,
    message: message || undefined,
  });

  redirect(`/inquire?ok=1${listing_id ? `&listing=${encodeURIComponent(listing_id)}` : ""}`);
}

export default async function Inquire({ searchParams }: Props) {
  const sp = await searchParams;
  const tree = regionTree();
  const l = sp.listing ? getListing(sp.listing) : null;
  const defaultKind = sp.kind && ["sell", "acquire", "start", "close"].includes(sp.kind) ? sp.kind : "acquire";

  if (sp.ok === "1") {
    return (
      <div className="mx-auto max-w-md px-4 py-12">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <div className="text-5xl">✓</div>
          <h1 className="mt-3 text-xl font-bold text-emerald-900">접수 완료</h1>
          <p className="mt-2 text-sm text-emerald-800">24시간 내 운영팀이 카톡으로 연락드립니다.</p>
          <Link href="/" className="mt-6 inline-block rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white">홈으로</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-6 sm:py-10">
      <h1 className="text-xl font-bold sm:text-2xl">신청하기</h1>
      <p className="mt-1 text-xs text-gray-500">필수는 휴대폰만. 나머진 선택. 운영팀이 카톡으로 회신합니다.</p>

      {l ? (
        <div className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
          <strong>관심 매물:</strong> {l.studio.place_name}
          <div className="text-amber-800/80">{l.sido} {l.sigungu}</div>
        </div>
      ) : null}

      <form action={action} className="mt-5 space-y-5 rounded-2xl border border-gray-200 bg-white p-5">
        {l ? <input type="hidden" name="listing_id" value={l.id} /> : null}

        {/* 1. 어떤 신청 */}
        <fieldset>
          <legend className="text-xs font-bold text-gray-700">무엇을 도와드릴까요?</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {[
              { v: "acquire", label: "매수 (인수)" },
              { v: "sell", label: "매도 (양도)" },
              { v: "start", label: "창업 검토" },
              { v: "close", label: "폐업 정리" },
            ].map((o) => (
              <label key={o.v} className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-3 text-sm has-[:checked]:border-gray-900 has-[:checked]:bg-gray-900 has-[:checked]:text-white">
                <input type="radio" name="kind" value={o.v} defaultChecked={o.v === defaultKind} className="accent-gray-900" />
                <span className="text-sm font-medium">{o.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* 2. 휴대폰 */}
        <div>
          <label htmlFor="phone" className="block text-xs font-bold text-gray-700">
            휴대폰 <span className="text-rose-600">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="010-0000-0000"
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-gray-900 focus:outline-none"
            inputMode="tel"
            autoComplete="tel"
          />
        </div>

        {/* 3. 어떤 분 (다중 선택) */}
        <fieldset>
          <legend className="text-xs font-bold text-gray-700">어떤 분이세요? <span className="text-gray-400">(중복 가능)</span></legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {[
              { v: "owner", label: "현직 원장" },
              { v: "instructor", label: "강사" },
              { v: "buyer", label: "예비 매수자" },
              { v: "investor", label: "투자자" },
              { v: "general", label: "일반" },
            ].map((o) => (
              <label key={o.v} className="flex cursor-pointer items-center gap-1 rounded-full border border-gray-300 px-3 py-1.5 text-xs has-[:checked]:border-gray-900 has-[:checked]:bg-gray-900 has-[:checked]:text-white">
                <input type="checkbox" name="role" value={o.v} className="hidden" />
                {o.label}
              </label>
            ))}
          </div>
        </fieldset>

        {/* 4. 지역 (선택) */}
        <div>
          <label className="block text-xs font-bold text-gray-700">관심 지역 <span className="text-gray-400">(선택)</span></label>
          <div className="mt-1">
            <RegionSelect
              metros={tree.metros}
              dos={tree.dos}
              defaultSido={l?.sido ?? ""}
              defaultSigungu={l?.sigungu ?? ""}
              size="md"
            />
          </div>
        </div>

        {/* 5. 이름 / 메모 */}
        <div>
          <label htmlFor="name" className="block text-xs font-bold text-gray-700">성함 <span className="text-gray-400">(선택)</span></label>
          <input id="name" name="name" type="text" placeholder="홍길동" className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-gray-900 focus:outline-none" autoComplete="name" />
        </div>

        <div>
          <label htmlFor="message" className="block text-xs font-bold text-gray-700">메모 <span className="text-gray-400">(선택, 200자)</span></label>
          <textarea id="message" name="message" rows={3} maxLength={200} placeholder="예산·시기·우대조건 등 자유롭게" className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none" />
        </div>

        <button type="submit" className="w-full rounded-lg bg-gray-900 px-5 py-4 text-base font-bold text-white hover:bg-gray-700">
          신청하기
        </button>
        <p className="text-center text-[11px] text-gray-400">제출 시 <Link href="/terms" className="underline">이용약관</Link> · <Link href="/privacy" className="underline">개인정보처리방침</Link>에 동의합니다.</p>
      </form>
    </div>
  );
}
