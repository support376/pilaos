import Link from "next/link";

type Props = {
  placeName: string;
  studioId: string;
  waitlistTotal?: number;
};

export function BigCTA({ placeName, studioId, waitlistTotal }: Props) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-8 text-white shadow-xl">
      <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-amber-500/20 blur-3xl" />
      <div className="relative">
        <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-400">
          지금 오너 인증하면
        </div>
        <h2 className="text-2xl font-bold">
          <span className="text-white">『{placeName}』</span>의
          <br />
          전체 분석이 공개됩니다.
        </h2>

        <ul className="mt-5 space-y-2 text-sm text-gray-200">
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">✓</span>
            남은 개선 항목 전체 + 예상 점수 증가
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">✓</span>
            내 앞 3개 경쟁사의 주간 변화 추적
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">✓</span>
            월별 지역 순위 추이 차트
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">✓</span>
            놓친 고객 구체 추정 + 리뷰 자동 요청 스크립트
          </li>
        </ul>

        <Link
          href={`/claim/${studioId}`}
          className="mt-6 block w-full rounded-xl bg-amber-500 px-6 py-4 text-center text-base font-bold text-gray-900 shadow-lg transition hover:bg-amber-400"
        >
          이건 우리 스튜디오입니다 → 2분 인증
        </Link>

        <div className="mt-3 text-center text-xs text-gray-400">
          지금까지{" "}
          <strong className="text-white">
            {(waitlistTotal ?? 0).toLocaleString()}명
          </strong>
          의 오너가 인증 신청했습니다
        </div>
      </div>
    </section>
  );
}
