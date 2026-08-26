import type { Metadata } from "next";
import { ForgotView } from "@/components/auth/AuthViews";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your Kazi Store account password.",
  robots: { index: false },
};

export default function ForgotPasswordPage() {
  return <ForgotView />;
}
