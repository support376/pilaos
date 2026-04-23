type Row = {
  label: string;
  me: number;
  top: number;
  avg: number;
  max: number;
};

export function CategoryBars({ rows }: { rows: Row[] }) {
  return (
    <div className="space-y-5">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-semibold text-gray-900">{r.label}</span>
            <span className="text-gray-500">
              나 <strong className="text-gray-900">{r.me}</strong> · 1위 {r.top} · 평균{" "}
              {r.avg.toFixed(1)}
            </span>
          </div>
          <div className="space-y-1">
            <Bar label="나" value={r.me} max={r.max} color="bg-amber-500" />
            <Bar label="1위" value={r.top} max={r.max} color="bg-emerald-500" />
            <Bar label="평균" value={r.avg} max={r.max} color="bg-gray-400" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Bar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-8 shrink-0 text-gray-500">{label}</span>
      <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`${color} h-full rounded-full transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-10 shrink-0 text-right font-semibold text-gray-700">
        {typeof value === "number" && Number.isInteger(value)
          ? value
          : value.toFixed(1)}
      </span>
    </div>
  );
}
