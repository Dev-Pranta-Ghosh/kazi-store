import type { Metadata } from "next";
import { ContactView } from "@/components/contact/ContactView";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Reach Kazi Store — কাজী স্টোর. Visit us at Sofina Bitan, Jubilee Road, Chattogram, call 01815-115297 or send us a message online.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactView />;
}
