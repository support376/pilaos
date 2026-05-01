"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "pilaos:favs";

type Snippet = {
  id: string;
  place_name: string;
  sigungu: string | null;
  key_money_mid: number;
  yield_pct: number;
  digital_grade: string;
};

export function WatchlistClient() {
  const [ids, setIds] = useState<string[]>([]);
  const [items, setItems] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let map: Record<string, true> = {};
    try { map = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch {}
    const list = Object.keys(map);
    setIds(list);
    if (list.length === 0) { setLoading(false); return; }
    fetch("/api/listings/snippets?ids=" + encodeURIComponent(list.join(",")))
      .then((r) => r.json())
      .then((d) => { setItems(d.rows ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const remove = (id: string) => {
    let map: Record<string, true> = {};
    try { map = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch {}
    delete map[id];
    localStorage.setItem(KEY, JSON.stringify(map));
    setItems((prev) => prev.filter((x) => x.id !== id));
    setIds((prev) => prev.filter((x) => x !== id));
  };

  if (loading) return <p className="mt-6 text-sm text-gray-500">불러오는 중…</p>;
  if (ids.length === 0) {
    return (
      <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="text-sm text-gray-600">아직 관심 매물이 없습니다.</p>
        <Link href="/listings" className="mt-3 inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-gray-700">매물 둘러보기</Link>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-2">
      {items.map((s) => (
        <div key={s.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
          <Link href={`/listings/${s.id}`} className="min-w-0 flex-1">
            <div className="text-xs text-gray-400 font-mono">{s.id}</div>
            <div className="font-bold text-gray-900">{s.place_name}</div>
            <div className="mt-0.5 text-xs text-gray-500">{s.sigungu ?? ""} · {s.digital_grade}급 · 권리금 추정 {fmtMan(s.key_money_mid)} · 수익률 {s.yield_pct}%</div>
          </Link>
          <div className="flex items-center gap-2">
            <Link href={`/buy/intent?listing=${encodeURIComponent(s.id)}`} className="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-gray-700">매수 의향</Link>
            <button onClick={() => remove(s.id)} className="rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50">제거</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function fmtMan(n: number): string {
  if (!n || n <= 0) return "—";
  const eok = Math.floor(n / 10000);
  const man = n % 10000;
  if (eok > 0 && man > 0) return `${eok}억 ${man.toLocaleString()}만`;
  if (eok > 0) return `${eok}억`;
  return `${man.toLocaleString()}만`;
}
