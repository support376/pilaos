import Link from "next/link";

export const metadata = { title: "페이지를 찾을 수 없습니다" };

export default function NotFound() {
  return (
    <div className="bg-white">
      <section className="mx-auto max-w-md px-5 py-20 text-center">
        <div className="text-[72px] font-black text-black/15 leading-none">404</div>
        <h1 className="mt-4 text-2xl font-extrabold text-black">페이지를 찾을 수 없어요</h1>
        <p className="mt-3 text-sm text-black/65 leading-relaxed">
          삭제됐거나 주소가 바뀌었을 수 있어요.<br />
          아래에서 원하시는 곳으로 가실 수 있습니다.
        </p>
        <div className="mt-8 grid gap-2">
          <Link href="/" className="rounded-lg bg-black px-5 py-3 text-sm font-bold text-white hover:bg-black/85">홈으로</Link>
          <Link href="/listings" className="rounded-lg border border-black/15 bg-white px-5 py-3 text-sm font-bold text-black hover:bg-black/5">매물 검색</Link>
          <Link href="/inquire?kind=acquire" className="rounded-lg border border-black/15 bg-white px-5 py-3 text-sm font-bold text-black hover:bg-black/5">상담 신청</Link>
        </div>
        <p className="mt-8 text-[11px] text-black/45">
          매물 ID로 직접 접근하셨나요? 매물이 운영자 요청으로 노출 거부됐을 수 있습니다.
        </p>
      </section>
    </div>
  );
}
