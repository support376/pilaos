type Kind = "kakao_place" | "naver_place" | "kakao_channel" | "homepage" | "instagram" | "naver_blog";

export function BrandIcon({ kind, size = 16 }: { kind: Kind; size?: number }) {
  const s = size;
  const r = s * 0.18;
  const fontSize = s * 0.62;
  const stroke = "currentColor";

  if (kind === "kakao_place" || kind === "kakao_channel") {
    // 카카오 노란색 + K (place: 핀, channel: 말풍선)
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} xmlns="http://www.w3.org/2000/svg">
        <rect width={s} height={s} rx={r} fill="#FEE500" />
        {kind === "kakao_place" ? (
          <path d={`M ${s/2} ${s*0.22} a ${s*0.22} ${s*0.22} 0 0 1 0 ${s*0.44} l ${-s*0.06} ${s*0.16} a ${s*0.04} ${s*0.04} 0 0 1 ${-s*0.08} 0 l ${-s*0.06} ${-s*0.16} a ${s*0.22} ${s*0.22} 0 0 1 ${s*0.20} ${-s*0.44} z`} fill="#191919" />
        ) : (
          <ellipse cx={s/2} cy={s*0.5} rx={s*0.32} ry={s*0.22} fill="#191919" />
        )}
      </svg>
    );
  }
  if (kind === "naver_place" || kind === "naver_blog") {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} xmlns="http://www.w3.org/2000/svg">
        <rect width={s} height={s} rx={r} fill={kind === "naver_blog" ? "#03C75A" : "#03C75A"} />
        <text x={s*0.5} y={s*0.72} textAnchor="middle" fontWeight="900" fontSize={fontSize} fill="white" fontFamily="-apple-system,sans-serif">{kind === "naver_blog" ? "B" : "N"}</text>
      </svg>
    );
  }
  if (kind === "instagram") {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ig-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F58529" />
            <stop offset="50%" stopColor="#DD2A7B" />
            <stop offset="100%" stopColor="#8134AF" />
          </linearGradient>
        </defs>
        <rect width={s} height={s} rx={r} fill="url(#ig-grad)" />
        <rect x={s*0.22} y={s*0.22} width={s*0.56} height={s*0.56} rx={s*0.14} fill="none" stroke="white" strokeWidth={s*0.07} />
        <circle cx={s*0.5} cy={s*0.5} r={s*0.16} fill="none" stroke="white" strokeWidth={s*0.07} />
        <circle cx={s*0.7} cy={s*0.3} r={s*0.05} fill="white" />
      </svg>
    );
  }
  if (kind === "homepage") {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} xmlns="http://www.w3.org/2000/svg">
        <rect width={s} height={s} rx={r} fill="#0EA5E9" />
        <circle cx={s*0.5} cy={s*0.5} r={s*0.32} fill="none" stroke="white" strokeWidth={s*0.06} />
        <ellipse cx={s*0.5} cy={s*0.5} rx={s*0.16} ry={s*0.32} fill="none" stroke="white" strokeWidth={s*0.06} />
        <line x1={s*0.18} y1={s*0.5} x2={s*0.82} y2={s*0.5} stroke="white" strokeWidth={s*0.06} />
      </svg>
    );
  }
  return null;
}
