type Props = {
  score: number;
  max?: number;
  grade: "A" | "B" | "C" | "D" | "F";
  size?: number;
};

const gradeStroke: Record<Props["grade"], string> = {
  A: "stroke-emerald-500",
  B: "stroke-sky-500",
  C: "stroke-amber-500",
  D: "stroke-orange-500",
  F: "stroke-rose-500",
};

const gradeText: Record<Props["grade"], string> = {
  A: "text-emerald-500",
  B: "text-sky-500",
  C: "text-amber-500",
  D: "text-orange-500",
  F: "text-rose-500",
};

export function ScoreRing({ score, max = 90, grade, size = 220 }: Props) {
  const radius = size / 2 - 14;
  const c = 2 * Math.PI * radius;
  const pct = Math.min(1, Math.max(0, score / max));
  const offset = c * (1 - pct);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={14}
          className="stroke-gray-100"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={14}
          strokeLinecap="round"
          fill="none"
          className={`${gradeStroke[grade]} transition-all`}
          style={{
            strokeDasharray: c,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={`text-6xl font-extrabold ${gradeText[grade]} leading-none`}>
          {score}
        </div>
        <div className="mt-1 text-xs text-gray-400 font-medium">/ {max}점</div>
        <div className={`mt-2 text-3xl font-black ${gradeText[grade]}`}>
          {grade}
        </div>
      </div>
    </div>
  );
}
