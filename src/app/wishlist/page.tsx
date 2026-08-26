import type { Metadata } from "next";
import { WishlistView } from "@/components/wishlist/WishlistView";

export const metadata: Metadata = {
  title: "Your Wishlist",
  description: "Save your favorite beauty products for later at Kazi Store.",
};

export default function WishlistPage() {
  return <WishlistView />;
}
