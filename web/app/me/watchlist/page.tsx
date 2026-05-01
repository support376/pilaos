import Link from "next/link";

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">워치리스트</h1>
      <p className="mt-1 text-sm text-gray-600">조건 매칭된 매물 알림 + 자금증빙 업로드.</p>
      <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">
        <p>로그인 + 인증 후 활성화됩니다.</p>
        <Link href="/buy/intent" className="mt-3 inline-block text-xs underline">매수 의향 등록</Link>
      </div>
    </div>
  );
}
export const metadata = { title: "워치리스트", robots: { index: false } };
