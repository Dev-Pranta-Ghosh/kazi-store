import type { Metadata } from "next";
import { FaqView } from "@/components/faq/FaqView";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers about ordering, delivery, payment, returns and products at Kazi Store — কাজী স্টোর, Chattogram.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return <FaqView />;
}
