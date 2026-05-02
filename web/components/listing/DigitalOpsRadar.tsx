import { Studio } from "@/lib/types";

/**
 * 매물 상세에 노출되는 디지털 운영 점수 레이더.
 * 실제 매물 데이터(Studio) 기반.
 */
export function DigitalOpsRadar({ studio, score }: { studio: Studio; score: number }) {
  // 6채널 점수 (0~100) — Studio 데이터 기반
  const values = [
    studio.naver_url ? 85 : 0,                                  // 네이버 플레이스
    Math.min(100, (studio.blog_review_count ?? 0) * 5),         // 네이버 블로그
    studio.kakao_place_id ? 85 : 0,                             // 카카오 플레이스
    studio.kakao_channel_url ? 90 : 0,                          // 카카오톡 채널
    studio.instagram_handle ? 85 : 0,                           // 인스타그램
    studio.homepage_url ? 75 : 0,                               // 홈페이지
  ].map(v => Math.min(100, v));

  const labels = ["네이버\n플레이스", "네이버\n블로그", "카카오\n플레이스", "카카오톡\n채널", "인스타", "홈페이지\n·구글"];
  const cx = 120, cy = 110, r = 70;
  const angleStep = (Math.PI * 2) / labels.length;

  const points = values.map((v, i) => {
    const a = i * angleStep - Math.PI / 2;
    const dist = (v / 100) * r;
    return [cx + Math.cos(a) * dist, cy + Math.sin(a) * dist];
  });
  const polyStr = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const rings = [0.25, 0.5, 0.75, 1].map((p) => p * r);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
      <svg viewBox="0 0 240 220" className="w-full max-w-[280px] mx-auto sm:mx-0 sm:flex-shrink-0">
        {rings.map((rg, i) => (
          <circle key={i} cx={cx} cy={cy} r={rg} fill="none" stroke="black" strokeOpacity="0.06" />
        ))}
        {labels.map((_, i) => {
          const a = i * angleStep - Math.PI / 2;
          return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a) * r} y2={cy + Math.sin(a) * r} stroke="black" strokeOpacity="0.08" />;
        })}
        <polygon points={polyStr} fill="#2563eb" fillOpacity="0.15" stroke="#2563eb" strokeWidth="2" />
        {points.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill="#2563eb" />
        ))}
        {labels.map((l, i) => {
          const a = i * angleStep - Math.PI / 2;
          const lx = cx + Math.cos(a) * (r + 16);
          const ly = cy + Math.sin(a) * (r + 16);
          const anchor = lx < cx - 10 ? "end" : lx > cx + 10 ? "start" : "middle";
          const lines = l.split("\n");
          return (
            <text key={i} x={lx} y={ly - (lines.length - 1) * 4} textAnchor={anchor} fontSize="9" fill="black" fillOpacity="0.65" fontWeight="600">
              {lines.map((ln, j) => <tspan key={j} x={lx} dy={j === 0 ? 0 : 11}>{ln}</tspan>)}
            </text>
          );
        })}
      </svg>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-bold text-black/55 uppercase tracking-widest">디지털 운영 점수</div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-[44px] font-black text-blue-600 leading-none">{score}</span>
          <span className="text-[14px] text-black/55">/90</span>
        </div>
        <p className="mt-2 text-[13px] text-black/65 leading-relaxed">
          6개 디지털 채널 운영 여부, 리뷰 수, 응답률을 종합한 점수입니다.<br />
          <span className="text-blue-600 font-bold">점수가 높을수록</span> 인수 후 회원 유지가 쉽습니다.
        </p>
      </div>
    </div>
  );
}
