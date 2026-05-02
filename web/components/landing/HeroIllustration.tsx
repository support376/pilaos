/**
 * 추상 line drawing — 매수자(사람) + 운영팀 카톡 + 매장(스튜디오)
 * 흑백 + blue accent
 */
export function HeroIllustration() {
  return (
    <svg viewBox="0 0 320 200" className="w-full h-auto" aria-hidden>
      {/* 좌측: 매수자 (사람) */}
      <g stroke="black" strokeWidth="1.5" fill="none">
        <circle cx="50" cy="70" r="14" />
        <path d="M30 110 C 30 92 38 84 50 84 C 62 84 70 92 70 110 L 70 130" />
        <path d="M30 130 L 70 130" />
      </g>

      {/* 카톡 말풍선 - 매수자 → 운영팀 */}
      <g>
        <rect x="76" y="58" width="48" height="22" rx="11" fill="white" stroke="black" strokeWidth="1.2" />
        <text x="100" y="72" textAnchor="middle" fontSize="9" fill="black" fontWeight="600">상담</text>
      </g>

      {/* 중앙: 운영팀 (filled circle, accent) */}
      <g>
        <circle cx="160" cy="100" r="32" fill="#2563eb" />
        <text x="160" y="106" textAnchor="middle" fontSize="14" fill="white" fontWeight="800">필라오스</text>
      </g>

      {/* 카톡 말풍선 - 운영팀 → 매장 */}
      <g>
        <rect x="200" y="58" width="42" height="22" rx="11" fill="white" stroke="black" strokeWidth="1.2" />
        <text x="221" y="72" textAnchor="middle" fontSize="9" fill="black" fontWeight="600">매칭</text>
      </g>

      {/* 우측: 매장 (스튜디오 building) */}
      <g stroke="black" strokeWidth="1.5" fill="none">
        <rect x="246" y="70" width="48" height="62" />
        <path d="M246 70 L 270 56 L 294 70" />
        <line x1="270" y1="100" x2="270" y2="132" />
        <rect x="252" y="80" width="14" height="14" />
        <rect x="274" y="80" width="14" height="14" />
        <rect x="262" y="108" width="16" height="24" fill="#2563eb" stroke="none" />
      </g>

      {/* 연결선 (매수자 → 운영팀 → 매장) */}
      <g stroke="black" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3 3">
        <path d="M 65 88 Q 95 95 128 96" />
        <path d="M 192 96 Q 220 95 245 95" />
      </g>

      {/* 하단 라벨 */}
      <g fontSize="9" fontWeight="600" fill="black" opacity="0.55">
        <text x="50" y="158" textAnchor="middle">매수자</text>
        <text x="160" y="158" textAnchor="middle">운영팀 1명</text>
        <text x="270" y="158" textAnchor="middle">매물·매도자</text>
      </g>

      {/* 점선 화살표 — 양방향 */}
      <g stroke="#2563eb" strokeWidth="1.5" fill="none">
        <path d="M 50 175 L 270 175" markerEnd="url(#arrEnd)" markerStart="url(#arrStart)" />
      </g>
      <defs>
        <marker id="arrEnd" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M 0 0 L 6 3 L 0 6 z" fill="#2563eb" />
        </marker>
        <marker id="arrStart" markerWidth="6" markerHeight="6" refX="1" refY="3" orient="auto">
          <path d="M 6 0 L 0 3 L 6 6 z" fill="#2563eb" />
        </marker>
      </defs>
      <text x="160" y="190" textAnchor="middle" fontSize="9" fontWeight="700" fill="#2563eb">카톡 한 채널로 처음부터 끝까지</text>
    </svg>
  );
}
