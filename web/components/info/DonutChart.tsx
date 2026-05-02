export function DisputeDonut() {
  // 30% 빨강 호 + 70% 회색 트랙
  const r = 70;
  const c = 2 * Math.PI * r;
  const filled = c * 0.3;
  return (
    <div className="flex flex-col items-center sm:flex-row sm:gap-8">
      <svg viewBox="0 0 180 180" className="h-44 w-44 flex-shrink-0">
        <circle cx="90" cy="90" r={r} fill="none" stroke="#000" strokeOpacity="0.08" strokeWidth="22" />
        <circle
          cx="90" cy="90" r={r} fill="none"
          stroke="#dc2626" strokeWidth="22" strokeLinecap="butt"
          strokeDasharray={`${filled} ${c}`}
          transform="rotate(-90 90 90)"
        />
        <text x="90" y="84" textAnchor="middle" className="fill-black" fontSize="34" fontWeight="800">30%</text>
        <text x="90" y="108" textAnchor="middle" className="fill-black/55" fontSize="11" fontWeight="600">분쟁 발생률</text>
      </svg>
      <div className="mt-5 sm:mt-0 max-w-sm">
        <div className="text-[14px] font-bold text-red-600">필라테스·요가 인수 100건 중</div>
        <div className="mt-1 text-[22px] sm:text-[26px] font-extrabold leading-snug text-black">30건은 6개월 안에 분쟁이 터집니다.</div>
        <p className="mt-2 text-[13px] text-black/65 leading-relaxed">
          회원 환불, 임대인 갱신 거부, 강사 단체 이탈, 세무 추징 — 매수자가 인수 전에 알 수 없는 항목들이 절반.
        </p>
        <div className="mt-3 inline-block rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-[12px] font-bold text-blue-700">
          필라오스로 인수 시 분쟁 90% 사전 차단
        </div>
      </div>
    </div>
  );
}
