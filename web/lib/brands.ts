// 필라테스 브랜드 마스터 + 상호 → 브랜드 매칭 휴리스틱
import { Brand } from "./types";

export const BRANDS: Brand[] = [
  { slug: "filates", name: "필라피티스", aliases: ["필라피티스", "FILATES"] },
  { slug: "fildex", name: "필덱스", aliases: ["필덱스", "FILDEX"] },
  { slug: "recover", name: "리커버", aliases: ["리커버", "RECOVER"] },
  { slug: "balletbody", name: "발레바디", aliases: ["발레바디", "BALLET BODY"] },
  { slug: "lagree", name: "라그리", aliases: ["라그리", "LAGREE"] },
  { slug: "movement-lab", name: "무브먼트랩", aliases: ["무브먼트랩"] },
  { slug: "the-pilates", name: "더필라테스", aliases: ["더필라테스"] },
  { slug: "pilates-life", name: "필라테스라이프", aliases: ["필라테스라이프"] },
  { slug: "core-pilates", name: "코어필라테스", aliases: ["코어필라테스"] },
  { slug: "studio-m", name: "스튜디오엠", aliases: ["스튜디오엠", "STUDIO M"] },
  { slug: "balanced", name: "밸런스드바디", aliases: ["밸런스드바디", "BALANCED"] },
  { slug: "club-pilates", name: "클럽필라테스", aliases: ["클럽필라테스", "CLUB PILATES"] },
  { slug: "the-house", name: "더하우스", aliases: ["더하우스"] },
  { slug: "body-tune", name: "바디튠", aliases: ["바디튠"] },
  { slug: "vivapilates", name: "비바필라테스", aliases: ["비바필라테스"] },
  { slug: "independent", name: "무가맹·개인", aliases: [] },
];

export function brandFromName(placeName: string): string {
  if (!placeName) return "independent";
  const n = placeName.replace(/\s+/g, "").toLowerCase();
  for (const b of BRANDS) {
    if (b.slug === "independent") continue;
    for (const a of b.aliases) {
      const t = a.replace(/\s+/g, "").toLowerCase();
      if (n.includes(t)) return b.slug;
    }
  }
  return "independent";
}

export function brandBySlug(slug: string): Brand | null {
  return BRANDS.find((b) => b.slug === slug) ?? null;
}
