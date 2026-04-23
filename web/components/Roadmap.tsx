import { Studio } from "@/lib/types";

type Item = {
  label: string;
  done: boolean;
  points: number;
  effort: string;
  why: string;
};

export function Roadmap({ studio }: { studio: Studio }) {
  const items: Item[] = [
    {
      label: "네이버 플레이스 등록",
      done: !!studio.naver_url,
      points: 15,
      effort: "5분",
      why: "네이버 검색에서 보이려면 필수",
    },
    {
      label: "인스타그램 계정",
      done: !!studio.instagram_handle,
      points: 15,
      effort: "10분",
      why: "필라테스 강남권 상위 95%가 운영 중",
    },
    {
      label: "홈페이지 개설",
      done: !!studio.homepage_url,
      points: 10,
      effort: "2~3일",
      why: "체험 예약 전환 자산",
    },
    {
      label: "카카오톡 채널 개설",
      done: !!studio.kakao_channel_name,
      points: 10,
      effort: "10분",
      why: "재등록 리마인더·상담 채널 확보",
    },
    {
      label: "카카오맵 리뷰 5+",
      done: (studio.kakao_review_count ?? 0) >= 5,
      points:
        (studio.kakao_review_count ?? 0) >= 5
          ? 0
          : 6 - (studio.kakao_review_count ?? 0 > 0 ? 3 : 0),
      effort: "리뷰 요청 자동화",
      why: "로컬 검색 노출 가중치",
    },
    {
      label: "블로그 리뷰 5+",
      done: (studio.blog_review_count ?? 0) >= 5,
      points:
        (studio.blog_review_count ?? 0) >= 5
          ? 0
          : 6 - (studio.blog_review_count ?? 0 > 0 ? 3 : 0),
      effort: "체험단 2~3명",
      why: "네이버 블로그 SEO",
    },
    {
      label: "네이버 블로그 계정",
      done: !!studio.naver_blog_handle,
      points: 5,
      effort: "30분",
      why: "상위 업체 42%가 자체 운영",
    },
    {
      label: "카카오맵 메뉴/가격 등록",
      done: (studio.menu_count ?? 0) > 0,
      points: 5,
      effort: "5분",
      why: "전국 89%가 안 함 — 즉시 차별화",
    },
  ];

  const pending = items.filter((x) => !x.done && x.points > 0);
  const gain = pending.reduce((s, x) => s + x.points, 0);

  return (
    <section className="space-y-3">
      {pending.length === 0 ? (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center">
          <div className="text-emerald-900 font-semibold">
            모든 핵심 채널을 갖추고 있습니다. 👏
          </div>
        </div>
      ) : (
        <>
          <div className="rounded-xl bg-gray-900 p-5 text-white">
            <div className="text-sm text-gray-300">빠진 {pending.length}개를 다 채우면</div>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-amber-400">
                +{gain}점
              </span>
              <span className="text-gray-300">까지 올릴 수 있습니다.</span>
            </div>
          </div>
          <ol className="space-y-2">
            {pending.map((it) => (
              <li
                key={it.label}
                className="flex items-center justify-between rounded-lg border border-rose-200 bg-rose-50/50 px-4 py-3"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 h-6 w-6 shrink-0 rounded-full border-2 border-rose-400" />
                  <div>
                    <div className="font-semibold text-gray-900">{it.label}</div>
                    <div className="text-xs text-gray-600">
                      {it.why} · <span className="text-gray-400">작업 {it.effort}</span>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white">
                  +{it.points}점
                </div>
              </li>
            ))}
          </ol>
        </>
      )}

      {items
        .filter((x) => x.done)
        .map((it) => (
          <div
            key={it.label}
            className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/40 px-4 py-2 text-sm"
          >
            <div className="flex items-center gap-3">
              <span className="h-5 w-5 shrink-0 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center">
                ✓
              </span>
              <span className="text-gray-700">{it.label}</span>
            </div>
            <span className="text-xs text-emerald-700">확보됨</span>
          </div>
        ))}
    </section>
  );
}
