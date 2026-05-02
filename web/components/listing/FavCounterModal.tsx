"use client";
import { useEffect, useState } from "react";

const FAV_KEY = "pilaos:favs";
const MODAL_DISMISS_KEY = "pilaos:fav-modal-dismissed-at";
const THRESHOLD = 5;
const DISMISS_HOURS = 24;

function readFavs(): Record<string, true> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || "{}"); } catch { return {}; }
}

function shouldShow(): boolean {
  if (typeof window === "undefined") return false;
  const dismissed = localStorage.getItem(MODAL_DISMISS_KEY);
  if (dismissed) {
    const hours = (Date.now() - Number(dismissed)) / 1000 / 3600;
    if (hours < DISMISS_HOURS) return false;
  }
  return Object.keys(readFavs()).length >= THRESHOLD;
}

/**
 * 페이지 마운트 시 ♥ 카운트 체크. 5개 이상 + 24h 미만 dismiss 없으면 모달 노출.
 * 다른 컴포넌트(FavButton)가 storage 이벤트로 알릴 수도 있음.
 */
export function FavCounterModal() {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const tick = () => { if (shouldShow()) setOpen(true); };
    tick();
    // FavButton이 발화하는 커스텀 이벤트 수신
    const onFavChange = () => tick();
    window.addEventListener("pilaos:fav-changed", onFavChange);
    // 다른 탭에서 변경
    const onStorage = (e: StorageEvent) => { if (e.key === FAV_KEY) tick(); };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("pilaos:fav-changed", onFavChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem(MODAL_DISMISS_KEY, String(Date.now()));
    setOpen(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || submitting) return;
    setSubmitting(true);
    const favs = Object.keys(readFavs());
    try {
      await fetch("/api/intent/buyer-favs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, fav_listing_ids: favs, source: "favs_modal" }),
      });
      setDone(true);
      localStorage.setItem(MODAL_DISMISS_KEY, String(Date.now())); // 한 번 제출 후 24h 안 뜸
    } catch {
      // fallback: 그냥 닫기
    }
    setSubmitting(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4" onClick={dismiss}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        {!done ? (
          <>
            <div className="text-3xl text-center text-red-600">♥</div>
            <h2 className="mt-3 text-center text-lg font-bold">관심 매물 5개 표시하셨네요!</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              운영팀이 매물을 정리해서 카톡으로 보내드릴까요?<br />
              <span className="text-xs text-black/55">가볍게 확인만요. 비용은 없습니다.</span>
            </p>
            <form onSubmit={submit} className="mt-5 space-y-3">
              <input
                type="tel"
                required
                placeholder="휴대폰 010-0000-0000"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-gray-900 focus:outline-none"
              />
              <button type="submit" disabled={submitting} className="w-full rounded-lg bg-black px-5 py-3.5 text-base font-bold text-white hover:bg-black/85 disabled:opacity-50">
                {submitting ? "보내는 중..." : "정리해서 받기 →"}
              </button>
              <button type="button" onClick={dismiss} className="w-full text-xs text-black/40 hover:text-black/70">
                나중에
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-3">
            <div className="text-4xl">✓</div>
            <h2 className="mt-3 text-lg font-bold text-blue-700">접수됐습니다</h2>
            <p className="mt-2 text-sm text-black/65">24시간 안에 카톡으로 정리해드립니다.</p>
            <button onClick={dismiss} className="mt-4 rounded-lg bg-black px-5 py-2 text-sm font-bold text-white hover:bg-black/85">
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
