import { redirect } from "next/navigation";

type Props = { searchParams: Promise<{ listing?: string }> };

export default async function SellNew({ searchParams }: Props) {
  const sp = await searchParams;
  const params = new URLSearchParams({ kind: "sell" });
  if (sp.listing) params.set("listing", sp.listing);
  redirect(`/inquire?${params.toString()}`);
}
