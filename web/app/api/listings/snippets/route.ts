import { getListing } from "@/lib/listings";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const ids = (url.searchParams.get("ids") ?? "").split(",").filter(Boolean).slice(0, 30);
  const rows = ids.map((id) => {
    const l = getListing(id);
    if (!l) return null;
    return {
      id: l.id,
      place_name: l.studio.place_name,
      sigungu: l.sigungu,
      key_money_mid: l.estimate.key_money.mid,
      yield_pct: l.estimate.monthly_yield_pct,
      digital_grade: l.digital_grade,
    };
  }).filter(Boolean);
  return Response.json({ rows });
}
