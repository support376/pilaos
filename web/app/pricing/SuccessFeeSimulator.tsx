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
    <div className="mt-3 space-y-4">
      <div>
        <div className="flex items-baseline justify-between">
          <label className="text-xs font-bold text-black/70">권리금 (만원)</label>
          <span className="text-2xl font-black text-blue-600">{fmt(keyMoney)}<span className="ml-1 text-sm text-black/50">만</span></span>
        </div>
        <input
          type="range" min={3000} max={300000} step={500} value={keyMoney}
          onChange={(e) => setKeyMoney(Number(e.target.value))}
          className="mt-2 w-full accent-blue-600"
        />
        <div className="mt-1 flex justify-between text-[10px] text-black/40">
          <span>3천만</span><span>1억</span><span>3억</span><span>10억</span><span>30억</span>
        </div>
      </div>

      <div className="rounded-xl border border-black/10 bg-white p-4">
        <table className="w-full text-sm">
          <tbody>
            <tr><td className="py-1.5 text-black/65">착수금 (1단계)</td><td className="text-right font-bold">{retainer}만원</td></tr>
            <tr className="border-t border-black/10"><td className="py-1.5 text-black/65">성공 보수 ({f.rate})</td><td className="text-right font-bold">{fmt(f.amount)}만원</td></tr>
            <tr className="border-t-2 border-black"><td className="py-2 font-bold">매도자 총 부담</td><td className="text-right text-lg font-extrabold text-blue-600">{fmt(total)}만원</td></tr>
            <tr><td className="py-1 text-[11px] text-black/55">권리금 대비</td><td className="text-right text-[11px] text-black/55">{pct}%</td></tr>
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-black/55">※ 거래 미성사 시 착수금만 부담, 성공 보수 0. 매물 검증 구독은 별도.</p>
    </div>
  );
}
