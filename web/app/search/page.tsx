import { redirect } from "next/navigation";

type Props = { searchParams: Promise<{ q?: string }> };
export default async function Search({ searchParams }: Props) {
  const sp = await searchParams;
  redirect(sp.q ? `/listings?q=${encodeURIComponent(sp.q)}` : "/listings");
}
