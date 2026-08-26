import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Shopping Bag",
  description: "Review your shopping bag and check out securely at Kazi Store.",
  robots: { index: false },
};

export default function CartPage() {
  return <CartView />;
}
