"use client";
import { useState } from "react";

function fee(keyMoneyMan: number): { rate: string; amount: number } {
  if (keyMoneyMan <= 0) return { rate: "—", amount: 0 };
  if (keyMoneyMan < 10000) return { rate: "정액 300만원", amount: 300 };
  if (keyMoneyMan < 30000) return { rate: "4%", amount: Math.round(keyMoneyMan * 0.04) };
  if (keyMoneyMan < 100000) return { rate: "3%", amount: Math.round(keyMoneyMan * 0.03) };
  return { rate: "2%", amount: Math.round(keyMoneyMan * 0.02) };
}

const fmt = (n: number) => n.toLocaleString();

export function SuccessFeeSimulator() {
  const [keyMoney, setKeyMoney] = useState(15000);
  const f = fee(keyMoney);
  const retainer = 150;
  const total = retainer + f.amount;
  const pct = keyMoney > 0 ? (total / keyMoney * 100).toFixed(2) : "0";

  return (
    <div className="space-y-5">
      {/* 슬라이더 */}
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <label className="text-[12px] font-bold text-black/65 uppercase">권리금</label>
          <span className="text-[32px] font-black text-black leading-none">{fmt(keyMoney)}<span className="ml-1 text-[14px] font-normal text-black/55">만원</span></span>
        </div>
        <input
          type="range" min={3000} max={300000} step={500} value={keyMoney}
          onChange={(e) => setKeyMoney(Number(e.target.value))}
          className="w-full accent-blue-600 cursor-pointer"
        />
        <div className="mt-1 flex justify-between text-[10px] text-black/35 font-medium">
          <span>3천만</span><span>1억</span><span>3억</span><span>10억</span><span>30억</span>
        </div>
      </div>

      {/* 결과 박스 */}
      <div className="rounded-2xl border-2 border-black bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-black/10 flex items-center justify-between">
          <span className="text-[13px] text-black/65">착수금</span>
          <span className="text-[16px] font-extrabold text-black">{retainer}<span className="text-[12px] font-normal text-black/55">만원</span></span>
        </div>
        <div className="px-5 py-4 border-b border-black/10 flex items-center justify-between">
          <span className="text-[13px] text-black/65">성공 보수 <span className="ml-1 rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-bold text-black/55">{f.rate}</span></span>
          <span className="text-[16px] font-extrabold text-black">{fmt(f.amount)}<span className="text-[12px] font-normal text-black/55">만원</span></span>
        </div>
        <div className="bg-blue-50 px-5 py-5">
          <div className="flex items-baseline justify-between">
            <span className="text-[14px] font-bold text-blue-900">매도자 총 부담</span>
            <span className="text-[26px] font-black text-blue-600 leading-none">{fmt(total)}<span className="ml-1 text-[14px] font-bold text-blue-900">만원</span></span>
          </div>
          <div className="mt-1 text-right text-[11px] text-blue-900/60">권리금의 {pct}%</div>
        </div>
      </div>

      <p className="text-[11px] text-black/55 leading-relaxed">
        ※ 거래 미성사 시 착수금만 부담, 성공 보수 0원. 매물 검증 구독 (월 5만)은 별도.
      </p>
    </div>
  );
}
