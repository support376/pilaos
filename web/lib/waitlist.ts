import { WaitlistInput } from "./db";

type Result = { ok: true; id: string | number } | { ok: false; error: string };

export async function submitWaitlist(data: WaitlistInput): Promise<Result> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    // 개발/스테이징: 콘솔 로그 후 성공 응답
    console.log("[waitlist] (no Supabase) would save:", {
      kakao_place_id: data.kakao_place_id,
      place_name: data.place_name,
      phone: data.phone,
      owner_name: data.owner_name,
      biz_number: data.biz_number,
    });
    return { ok: true, id: "dev-" + Date.now() };
  }

  try {
    const resp = await fetch(`${url}/rest/v1/waitlist`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        kakao_place_id: data.kakao_place_id,
        place_name: data.place_name,
        biz_number: data.biz_number ?? null,
        owner_name: data.owner_name ?? null,
        phone: data.phone,
        message: data.message ?? null,
        source_url: data.source_url ?? null,
        user_agent: data.user_agent ?? null,
        ip: data.ip ?? null,
        status: "new",
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("[waitlist] supabase error", resp.status, text);
      return { ok: false, error: `supabase ${resp.status}` };
    }

    const rows = (await resp.json()) as Array<{ id: number | string }>;
    return { ok: true, id: rows?.[0]?.id ?? "unknown" };
  } catch (e) {
    console.error("[waitlist] fetch failed", e);
    return { ok: false, error: "network" };
  }
}

export async function countWaitlist(): Promise<number> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return 0;

  try {
    const resp = await fetch(`${url}/rest/v1/waitlist?select=id`, {
      method: "HEAD",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: "count=exact",
      },
    });
    const range = resp.headers.get("content-range"); // "0-0/N"
    if (!range) return 0;
    const m = range.match(/\/(\d+)$/);
    return m ? parseInt(m[1], 10) : 0;
  } catch {
    return 0;
  }
}

export async function countWaitlistForStudio(
  kakaoPlaceId: string
): Promise<number> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return 0;

  try {
    const resp = await fetch(
      `${url}/rest/v1/waitlist?select=id&kakao_place_id=eq.${encodeURIComponent(
        kakaoPlaceId
      )}`,
      {
        method: "HEAD",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          Prefer: "count=exact",
        },
      }
    );
    const range = resp.headers.get("content-range");
    if (!range) return 0;
    const m = range.match(/\/(\d+)$/);
    return m ? parseInt(m[1], 10) : 0;
  } catch {
    return 0;
  }
}
