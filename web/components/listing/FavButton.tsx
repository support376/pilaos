"use client";
import { useEffect, useState } from "react";

const KEY = "pilaos:favs";

function readFavs(): Record<string, true> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}
function writeFavs(v: Record<string, true>) {
  try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {}
}

export function FavButton({ listingId, variant = "card" }: { listingId: string; variant?: "card" | "hero" }) {
  const [on, setOn] = useState(false);
  useEffect(() => { setOn(!!readFavs()[listingId]); }, [listingId]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const favs = readFavs();
    const next = !on;
    if (next) favs[listingId] = true; else delete favs[listingId];
    writeFavs(favs);
    setOn(next);
    // FavCounterModal에 알림
    try { window.dispatchEvent(new CustomEvent("pilaos:fav-changed")); } catch {}
    // fire-and-forget API
    try {
      fetch(`/api/listings/${listingId}/fav`, { method: next ? "POST" : "DELETE" });
    } catch {}
  };

  if (variant === "hero") {
    return (
      <button onClick={toggle} type="button"
        className={`inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-bold ring-1 transition ${on ? "bg-red-50 text-red-700 ring-red-300 hover:bg-red-100" : "bg-white text-black/75 ring-black/15 hover:bg-black/[.03]"}`}>
        <span aria-hidden>{on ? "♥" : "♡"}</span>
        {on ? "관심 매물에 저장됨" : "관심 매물에 저장"}
      </button>
    );
  }
  return (
    <button onClick={toggle} type="button" aria-label={on ? "관심 매물에서 제거" : "관심 매물에 추가"}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full ring-1 ${on ? "bg-red-50 text-red-600 ring-red-300" : "bg-white text-black/40 ring-black/10 hover:text-red-600 hover:ring-red-300"}`}>
      <span aria-hidden className="text-base leading-none">{on ? "♥" : "♡"}</span>
    </button>
  );
}
