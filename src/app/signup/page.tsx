import type { Metadata } from "next";
import { SignupView } from "@/components/auth/AuthViews";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Join Kazi Store — track orders, save addresses and unlock a smoother checkout.",
  robots: { index: false },
};

export default function SignupPage() {
  return <SignupView />;
}
