export function DigitalRadar() {
  const labels = ["네이버 플레이스", "네이버 블로그", "카카오 플레이스", "카카오톡 채널", "인스타그램", "홈페이지·구글"];
  const values = [85, 60, 90, 40, 75, 30]; // 0~100
  const cx = 100, cy = 100, r = 70;
  const angleStep = (Math.PI * 2) / labels.length;

  // 폴리곤 좌표
  const points = values.map((v, i) => {
    const a = i * angleStep - Math.PI / 2;
    const dist = (v / 100) * r;
    return [cx + Math.cos(a) * dist, cy + Math.sin(a) * dist];
  });
  const polyStr = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

  // 가이드 링
  const rings = [0.25, 0.5, 0.75, 1].map((p) => p * r);

  // 라벨 위치
  const labelPositions = labels.map((_, i) => {
    const a = i * angleStep - Math.PI / 2;
    return [cx + Math.cos(a) * (r + 14), cy + Math.sin(a) * (r + 14)];
  });

  const score = Math.round(values.reduce((a, b) => a + b, 0) / values.length);

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
      <svg viewBox="0 0 200 200" className="h-56 w-56 flex-shrink-0">
        {/* 가이드 링 */}
        {rings.map((rg, i) => (
          <circle key={i} cx={cx} cy={cy} r={rg} fill="none" stroke="#000" strokeOpacity="0.06" strokeWidth="1" />
        ))}
        {/* 축 */}
        {labels.map((_, i) => {
          const a = i * angleStep - Math.PI / 2;
          return (
            <line key={i} x1={cx} y1={cy}
              x2={cx + Math.cos(a) * r} y2={cy + Math.sin(a) * r}
              stroke="#000" strokeOpacity="0.08" strokeWidth="1" />
          );
        })}
        {/* 데이터 폴리곤 */}
        <polygon points={polyStr} fill="#2563eb" fillOpacity="0.15" stroke="#2563eb" strokeWidth="2" />
        {/* 데이터 점 */}
        {points.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill="#2563eb" />
        ))}
        {/* 라벨 */}
        {labels.map((l, i) => {
          const [x, y] = labelPositions[i];
          const anchor = x < cx - 10 ? "end" : x > cx + 10 ? "start" : "middle";
          return (
            <text key={i} x={x} y={y} textAnchor={anchor} fontSize="9" className="fill-black/65" fontWeight="600">{l}</text>
          );
        })}
      </svg>
      <div className="text-center sm:text-left max-w-xs">
        <div className="text-[12px] font-bold text-black/55">예시 매물의 디지털 운영 점수</div>
        <div className="mt-1 text-[40px] font-extrabold text-blue-600 leading-none">{score}<span className="text-[18px] text-black/55">/100</span></div>
        <div className="mt-1 text-[13px] font-bold text-black/85">상위 25% 운영 매장</div>
        <p className="mt-3 text-[12px] text-black/60 leading-relaxed">
          6개 디지털 채널 운영 여부, 리뷰 수, 게시물 빈도, 응답률을 종합해 0~100점으로 즉시 표시합니다. 매물 페이지에서 한 번에 확인하세요.
        </p>
      </div>
    </div>
  );
}
