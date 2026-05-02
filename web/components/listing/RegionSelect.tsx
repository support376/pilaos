"use client";
import { useMemo, useState } from "react";

type RegionGroup = { sido: string; total: number; sigungu: { sigungu: string; count: number }[] };

type Props = {
  metros: RegionGroup[];
  dos: RegionGroup[];
  defaultSido?: string;
  defaultSigungu?: string;
  /** field name 접두어. 기본은 sido / sigungu */
  sidoName?: string;
  sigunguName?: string;
  /** 폼 변경 시 자동제출하려면 form id 지정 또는 onChange 핸들러로 처리 */
  className?: string;
  size?: "sm" | "md";
};

/**
 * 2단계 시도→시군구 셀렉트.
 * 1단계: 광역시 / 도 optgroup (HTML 표준 1단계만 지원)
 * 2단계: 선택된 시도에 속한 시군구만 가나다순으로 노출
 *
 * "전체"를 선택하면 sigungu도 비워짐.
 */
export function RegionSelect({
  metros,
  dos,
  defaultSido = "",
  defaultSigungu = "",
  sidoName = "sido",
  sigunguName = "sigungu",
  className = "",
  size = "md",
}: Props) {
  const [sido, setSido] = useState(defaultSido);
  const [sigungu, setSigungu] = useState(defaultSigungu);

  const map = useMemo(() => {
    const m = new Map<string, RegionGroup>();
    for (const g of metros) m.set(g.sido, g);
    for (const g of dos) m.set(g.sido, g);
    return m;
  }, [metros, dos]);

  const sgList = sido ? map.get(sido)?.sigungu ?? [] : [];

  const cls =
    size === "sm"
      ? "rounded-md border border-black/15 px-2 py-2 text-[14px]"
      : "rounded-lg border border-black/15 bg-black/[.03] px-3 py-3 text-[16px] focus:bg-white focus:border-black focus:outline-none";

  return (
    <div className={`grid grid-cols-2 gap-2 ${className}`}>
      <select
        name={sidoName}
        value={sido}
        onChange={(e) => {
          setSido(e.target.value);
          setSigungu(""); // 시도 변경하면 시군구 리셋
        }}
        className={cls}
      >
        <option value="">시도 — 전체</option>
        <optgroup label="광역시·특별시">
          {metros.map((g) => (
            <option key={g.sido} value={g.sido}>
              {g.sido} ({g.total.toLocaleString()})
            </option>
          ))}
        </optgroup>
        <optgroup label="도">
          {dos.map((g) => (
            <option key={g.sido} value={g.sido}>
              {g.sido} ({g.total.toLocaleString()})
            </option>
          ))}
        </optgroup>
      </select>

      <select
        name={sigunguName}
        value={sigungu}
        onChange={(e) => setSigungu(e.target.value)}
        disabled={!sido}
        className={`${cls} disabled:bg-gray-100 disabled:text-gray-400`}
      >
        <option value="">{sido ? "시군구 — 전체" : "시도부터 선택"}</option>
        {sgList.map((sg) => (
          <option key={sg.sigungu} value={sg.sigungu}>
            {sg.sigungu} ({sg.count})
          </option>
        ))}
      </select>
    </div>
  );
}
