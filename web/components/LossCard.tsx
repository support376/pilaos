import { Studio } from "@/lib/types";

// 마케팅 카피용 추정치. 베이스라인을 시군구 평균/전국 평균으로 변환해 채움.
export function LossCard({ studio }: { studio: Studio }) {
  const losses: { icon: string; title: string; detail: string }[] = [];

  if (!studio.instagram_handle) {
    losses.push({
      icon: "📉",
      title: "인스타 미운영",
      detail: "강남권 상위 업체의 95%가 인스타로 신규 문의 유입. 월 평균 방문자 수백 명 단위의 유입 누수 추정.",
    });
  }

  if (!studio.homepage_url) {
    losses.push({
      icon: "💸",
      title: "홈페이지 없음",
      detail: "체험 예약 버튼을 걸어둘 자체 랜딩이 없어 전환율 20~40% 손실 추정. 광고를 돌려도 돌아올 곳이 없음.",
    });
  }

  if (!studio.naver_url) {
    losses.push({
      icon: "🔍",
      title: "네이버 플레이스 미등록",
      detail: "지역 필라테스 검색의 70% 이상이 네이버에서 발생. 가장 큰 노출 채널을 비워둔 상태.",
    });
  }

  if (!studio.kakao_channel_name) {
    losses.push({
      icon: "📵",
      title: "카카오톡 채널 없음",
      detail: "체험 후 재등록 리마인더·공지 발송 채널 부재. 이탈 고객 재방문율 평균 -35%p.",
    });
  }

  if ((studio.kakao_review_count ?? 0) === 0) {
    losses.push({
      icon: "⭐",
      title: "카카오맵 리뷰 0개",
      detail: "로컬 검색 랭킹 가중치에서 직접 패널티. 신규 고객의 신뢰 시그널 완전 공백.",
    });
  }

  if ((studio.menu_count ?? 0) === 0) {
    losses.push({
      icon: "💰",
      title: "카카오맵 가격/메뉴 미등록",
      detail: "가격 비교 단계에서 배제됨. 전국 89%가 방치 중인 기회 — 5분이면 동종 대비 상위권 진입.",
    });
  }

  if (losses.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-rose-700 uppercase tracking-wide">
        당신이 매달 놓치고 있는 것
      </h3>
      {losses.slice(0, 4).map((l) => (
        <div
          key={l.title}
          className="flex gap-3 rounded-lg border border-rose-200 bg-white p-4"
        >
          <span className="text-2xl" aria-hidden>
            {l.icon}
          </span>
          <div>
            <div className="font-bold text-gray-900">{l.title}</div>
            <div className="mt-1 text-sm text-gray-600">{l.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
