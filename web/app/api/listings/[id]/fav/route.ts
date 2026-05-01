// 찜 — 일단 in-memory 카운트, 추후 Upstash KV로 이전.
// 비로그인 익명 찜 (브라우저 localStorage가 source of truth).
const counts = new Map<string, number>();

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_: Request, { params }: Ctx) {
  const { id } = await params;
  counts.set(id, (counts.get(id) ?? 0) + 1);
  // webhook
  const url = process.env.DISCORD_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL;
  if (url) {
    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `[pilaos] ♥ 관심 ${id} (총 ${counts.get(id)}회)`,
          text: `[pilaos] ♥ 관심 ${id} (총 ${counts.get(id)}회)`,
        }),
      });
    } catch {}
  }
  return Response.json({ ok: true, count: counts.get(id) ?? 0 });
}

export async function DELETE(_: Request, { params }: Ctx) {
  const { id } = await params;
  return Response.json({ ok: true, count: counts.get(id) ?? 0 });
}

export async function GET(_: Request, { params }: Ctx) {
  const { id } = await params;
  return Response.json({ count: counts.get(id) ?? 0 });
}
