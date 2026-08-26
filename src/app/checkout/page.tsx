import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/CheckoutView";

export const metadata: Metadata = {
  title: "Secure Checkout",
  description: "Complete your Kazi Store order with Cash on Delivery, bKash, Nagad or card payment.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
