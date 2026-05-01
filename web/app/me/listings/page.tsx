import Link from "next/link";

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">내 매물</h1>
      <p className="mt-1 text-sm text-gray-600">내가 등록한 매물의 진행상태, 들어온 의향, 조회/찜 수.</p>
      <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">
        <p>로그인 + 인증 후 활성화됩니다.</p>
        <Link href="/sell/new" className="mt-3 inline-block text-xs underline">매물 등록하기</Link>
      </div>
    </div>
  );
}
export const metadata = { title: "내 매물", robots: { index: false } };
