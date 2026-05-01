// 매도/매수/창업/폐업 의향 등록 — 백엔드 fallback
//
// SUPABASE_URL이 있으면 거기로, 없으면 콘솔 로그 + 외부 webhook (DISCORD_WEBHOOK_URL/SLACK_WEBHOOK_URL).
// pilaos-web과 달리 이 레포는 SQLite readonly만 쓰므로 mutation은 외부로.

import { Intent } from "./types";

type Result = { ok: true; id: string } | { ok: false; error: string };

export async function submitIntent(intent: Intent): Promise<Result> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // 1) Supabase REST 시도
  if (url && key) {
    try {
      const resp = await fetch(`${url}/rest/v1/intent`, {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({ payload: intent, kind: intent.kind, status: "new" }),
      });
      if (resp.ok) {
        const rows = (await resp.json()) as Array<{ id: number | string }>;
        return { ok: true, id: String(rows?.[0]?.id ?? Date.now()) };
      }
      console.error("[intent] supabase error", resp.status, await resp.text());
    } catch (e) {
      console.error("[intent] supabase fetch failed", e);
    }
  }

  // 2) Discord/Slack webhook
  const discord = process.env.DISCORD_WEBHOOK_URL;
  const slack = process.env.SLACK_WEBHOOK_URL;
  const summary = humanize(intent);
  if (discord) {
    try {
      await fetch(discord, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: summary }),
      });
    } catch (e) { console.error("[intent] discord failed", e); }
  }
  if (slack) {
    try {
      await fetch(slack, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: summary }),
      });
    } catch (e) { console.error("[intent] slack failed", e); }
  }

  // 3) 콘솔 로그 (개발/스테이징)
  console.log("[intent submit]", JSON.stringify(intent, null, 2));
  return { ok: true, id: `dev-${Date.now()}` };
}

function humanize(i: Intent): string {
  const tag: Record<Intent["kind"], string> = {
    sell: "매도", acquire: "인수", start: "창업", close: "폐업",
  };
  const lines = [
    `[pilaos] ${tag[i.kind]} 의향 등록 — ${i.contact_name} ${i.contact_phone}`,
  ];
  if (i.kind === "sell")
    lines.push(`매물: ${i.listing_id} · 희망권리금 ${i.asking_key_money ?? "협의"}만 · 시점 ${i.timing}`);
  if (i.kind === "acquire")
    lines.push(`예산 ${i.budget_total}만 · 지역 ${i.region_filters.join(", ")} · 긴급도 ${i.urgency}`);
  if (i.kind === "start")
    lines.push(`예산 ${i.budget_total}만 · 지역 ${i.region_filters.join(", ")} · 시점 ${i.timing}`);
  if (i.kind === "close")
    lines.push(`매물: ${i.listing_id} · 임대잔여 ${i.lease_remaining_months ?? "?"}m · 회원 ${i.active_member_count ?? "?"}`);
  if (i.message) lines.push(`메모: ${i.message}`);
  return lines.join("\n");
}
