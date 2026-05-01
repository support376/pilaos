import Link from "next/link";

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">진행 중인 거래</h1>
      <p className="mt-1 text-sm text-gray-600">NDA 체결한 거래의 단계별 진행 보드 (5단계).</p>
      <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">
        <p>로그인 + 인증 후 활성화됩니다.</p>
      </div>
    </div>
  );
}
export const metadata = { title: "진행 중인 거래", robots: { index: false } };
