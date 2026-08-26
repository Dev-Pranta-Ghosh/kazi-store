import type { Metadata } from "next";
import { LoginView } from "@/components/auth/AuthViews";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Kazi Store account to track orders and check out faster.",
  robots: { index: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const redirect = typeof sp.redirect === "string" ? sp.redirect : undefined;
  return <LoginView redirect={redirect} />;
}
