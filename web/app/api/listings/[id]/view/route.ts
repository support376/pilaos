const counts = new Map<string, number>();

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_: Request, { params }: Ctx) {
  const { id } = await params;
  counts.set(id, (counts.get(id) ?? 0) + 1);
  return Response.json({ ok: true, count: counts.get(id) ?? 0 });
}

export async function GET(_: Request, { params }: Ctx) {
  const { id } = await params;
  return Response.json({ count: counts.get(id) ?? 0 });
}
