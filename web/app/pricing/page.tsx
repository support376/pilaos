import { redirect } from "next/navigation";

export default function PricingRedirect() {
  redirect("/sell#cost");
}
