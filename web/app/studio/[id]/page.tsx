import { redirect } from "next/navigation";

type Params = { params: Promise<{ id: string }> };
export default async function Studio({ params }: Params) {
  const { id } = await params;
  redirect(`/listings/PIL-${id}`);
}
