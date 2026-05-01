import { redirect } from "next/navigation";

type Params = { params: Promise<{ id: string }> };
export default async function Claim({ params }: Params) {
  const { id } = await params;
  redirect(`/sell/new?listing=${encodeURIComponent(`PIL-${id}`)}`);
}
