"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type Marker = {
  id: string;
  lng: number;
  lat: number;
  title: string;
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  isMe?: boolean;
};

type Props = {
  center: { lng: number; lat: number };
  markers: Marker[];
  radiusM?: number;
  height?: number;
  jsKey?: string;
};

declare global {
  interface Window {
    kakao?: {
      maps: {
        load: (cb: () => void) => void;
        LatLng: new (lat: number, lng: number) => unknown;
        Map: new (el: HTMLElement, opts: unknown) => unknown;
        Circle: new (opts: unknown) => { setMap: (m: unknown) => void };
        CustomOverlay: new (opts: unknown) => { setMap: (m: unknown) => void };
      };
    };
  }
}

const GRADE_COLORS: Record<Marker["grade"], string> = {
  A: "#10b981",
  B: "#0ea5e9",
  C: "#f59e0b",
  D: "#f97316",
  F: "#f43f5e",
};

export function StudioMap({
  center,
  markers,
  radiusM = 1000,
  height = 320,
  jsKey,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    if (!sdkReady || !window.kakao || !mapRef.current) return;
    const el = mapRef.current;

    window.kakao.maps.load(() => {
      if (!window.kakao) return;
      const k = window.kakao.maps;
      const map = new k.Map(el, {
        center: new k.LatLng(center.lat, center.lng),
        level: 4,
      });

      new k.Circle({
        center: new k.LatLng(center.lat, center.lng),
        radius: radiusM,
        strokeWeight: 2,
        strokeColor: "#111827",
        strokeOpacity: 0.3,
        strokeStyle: "dashed",
        fillColor: "#111827",
        fillOpacity: 0.04,
      }).setMap(map);

      markers.forEach((m) => {
        const color = m.isMe ? "#111827" : GRADE_COLORS[m.grade];
        const html = `
          <a href="/studio/${m.id}" style="
            display:flex; align-items:center; gap:4px;
            padding:4px 8px;
            background:${color};
            color:white;
            border-radius:999px;
            font-size:11px;
            font-weight:700;
            box-shadow:0 2px 6px rgba(0,0,0,.25);
            text-decoration:none;
            white-space:nowrap;
            transform:translate(-50%, -100%);
            border: ${m.isMe ? "2px solid #fbbf24" : "none"};
          ">
            ${m.isMe ? "★ " : ""}${m.score} · ${escapeHtml(m.title).slice(0, 10)}
          </a>
        `;
        new k.CustomOverlay({
          position: new k.LatLng(m.lat, m.lng),
          content: html,
          yAnchor: 1,
          xAnchor: 0.5,
          clickable: true,
        }).setMap(map);
      });
    });
  }, [sdkReady, center.lng, center.lat, radiusM, markers]);

  if (!jsKey) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500"
      >
        지도 표시를 위해 <code className="mx-1 rounded bg-white px-1.5 py-0.5">NEXT_PUBLIC_KAKAO_JS_KEY</code>{" "}
        환경변수 설정이 필요합니다.
      </div>
    );
  }

  return (
    <>
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${jsKey}&autoload=false`}
        strategy="afterInteractive"
        onLoad={() => setSdkReady(true)}
        onReady={() => setSdkReady(true)}
      />
      <div
        ref={mapRef}
        style={{ height }}
        className="w-full rounded-xl border border-gray-200 overflow-hidden"
      />
    </>
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
