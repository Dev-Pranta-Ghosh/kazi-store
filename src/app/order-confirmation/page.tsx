import type { Metadata } from "next";
import { OrderConfirmationView } from "@/components/checkout/OrderConfirmationView";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your Kazi Store order has been placed successfully.",
  robots: { index: false },
};

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const orderId = typeof sp.order === "string" ? sp.order : "";
  return <OrderConfirmationView orderId={orderId} />;
}
