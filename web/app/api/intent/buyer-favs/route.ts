import { NextResponse } from "next/server";
import { submitIntent } from "@/lib/intent";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = String(body.phone || "").trim();
    if (!phone) return NextResponse.json({ ok: false, error: "phone required" }, { status: 400 });
    const fav_listing_ids = Array.isArray(body.fav_listing_ids) ? body.fav_listing_ids.map(String).slice(0, 50) : [];
    await submitIntent({
      kind: "buyer",
      mode: "favs",
      contact_name: "",
      contact_phone: phone,
      role: ["first_time"],
      fav_listing_ids,
      timing: "3m",
      source: String(body.source || "favs_modal"),
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }
}
