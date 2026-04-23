type Item = { title: string; sub: string };

export function LockedPreview({ items }: { items: Item[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((it) => (
        <div
          key={it.title}
          className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5"
        >
          <div className="pointer-events-none select-none blur-[3px] opacity-60">
            <div className="text-sm font-bold text-gray-900">{it.title}</div>
            <div className="mt-2 text-xs text-gray-600">{it.sub}</div>
            <div className="mt-4 flex items-end gap-1 h-16">
              {[60, 45, 70, 55, 80, 40, 90, 65, 75, 85].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-gradient-to-t from-amber-500/80 to-amber-300/80"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
            <div className="rounded-full bg-gray-900 px-4 py-2 text-xs font-bold text-white shadow-lg">
              🔒 인증 후 공개
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
