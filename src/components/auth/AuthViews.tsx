"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Eye, EyeOff, Loader2, Lock, Mail, MailCheck, Phone, User } from "lucide-react";
import { useStore } from "@/components/providers/StoreProvider";
import { cn, isValidBDPhone, isValidEmail } from "@/lib/utils";
import { btnPrimary, Field, inputCls } from "@/components/ui";

/* ——— Shared shell ——— */
function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="mx-auto grid max-w-[1200px] gap-0 px-4 py-14 sm:px-8 lg:grid-cols-2 lg:py-20">
      {/* Editorial side */}
      <div className="relative hidden overflow-hidden bg-bordeaux-deep lg:block" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.pexels.com/photos/7691107/pexels-photo-7691107.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=800&h=1100"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="relative flex h-full flex-col justify-between p-12">
          <p className="font-display text-2xl font-semibold text-ivory">
            Kazi<span className="text-champagne-light"> Store</span>
          </p>
          <div>
            <p className="font-display text-4xl leading-tight font-medium text-ivory">
              Beauty shopping,
              <br /> the way it should feel.
            </p>
            <p className="mt-4 max-w-sm text-[14.5px] leading-relaxed text-ivory/70">
              Track every order, save your addresses, and keep your wishlist close — all from one elegant account.
            </p>
            <ul className="mt-8 space-y-3 text-[13.5px] text-ivory/80">
              {["Faster checkout with saved addresses", "Live order tracking", "Wishlist synced to your device"].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-champagne/25">
                    <Check className="h-3 w-3 text-champagne-light" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <p className="font-bangla text-[15px] text-ivory/50">কাজী স্টোর · জুবিলি রোড, চট্টগ্রাম</p>
        </div>
      </div>

      {/* Form side */}
      <div className="border border-sand bg-white p-7 sm:p-12 lg:border-l-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-champagne">{eyebrow}</p>
        <h1 className="mt-3 font-display text-3xl font-medium text-ink sm:text-4xl">{title}</h1>
        <p className="mt-3 text-[14.5px] leading-relaxed text-taupe">{subtitle}</p>
        <div className="mt-9">{children}</div>
        <div className="mt-8 border-t border-sand pt-6 text-center text-[13.5px] text-taupe">{footer}</div>
      </div>
    </div>
  );
}

/* ——— LOGIN ——— */
export function LoginView({ redirect }: { redirect?: string }) {
  const router = useRouter();
  const { login } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!isValidEmail(email)) next.email = "Enter a valid email address.";
    if (password.length < 6) next.password = "Password must be at least 6 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);
      if (!res.ok) {
        setErrors({ form: res.error });
        return;
      }
      void remember; // session persists via localStorage in this demo
      router.push(redirect && redirect.startsWith("/") ? redirect : "/account");
    }, 800);
  };

  return (
    <AuthShell
      eyebrow="Welcome Back"
      title="Sign in to your account"
      subtitle="Pick up right where you left off — your bag, wishlist and orders are waiting."
      footer={
        <>
          New to Kazi Store?{" "}
          <Link href="/signup" className="font-semibold text-bordeaux underline underline-offset-4">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-5">
        <Field label="Email address" error={errors.email}>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" aria-hidden />
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((er) => ({ ...er, email: undefined, form: undefined })); }}
              className={cn(inputCls, "pl-11")}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
        </Field>
        <Field label="Password" error={errors.password}>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" aria-hidden />
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((er) => ({ ...er, password: undefined, form: undefined })); }}
              className={cn(inputCls, "pl-11 pr-12")}
              placeholder="Your password"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-taupe transition-colors hover:text-ink"
            >
              {show ? <EyeOff className="h-4.5 w-4.5" aria-hidden /> : <Eye className="h-4.5 w-4.5" aria-hidden />}
            </button>
          </div>
        </Field>

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2.5 text-[13.5px] text-espresso">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 accent-bordeaux" />
            Remember me
          </label>
          <Link href="/forgot-password" className="text-[13.5px] font-semibold text-bordeaux underline underline-offset-4">
            Forgot password?
          </Link>
        </div>

        {errors.form && (
          <p role="alert" className="border border-danger/30 bg-danger/5 px-4 py-3 text-[13.5px] font-medium text-danger">
            {errors.form}
          </p>
        )}

        <button type="submit" disabled={loading} className={cn(btnPrimary, "w-full")}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {loading ? "Signing you in…" : "Sign In"}
        </button>
        <p className="text-center text-[12px] leading-relaxed text-stone">
          Demo authentication — accounts are stored locally on this device and can be swapped for a real backend later.
        </p>
      </form>
    </AuthShell>
  );
}

/* ——— SIGNUP ——— */
function passwordStrength(pw: string): { score: 0 | 1 | 2 | 3; label: string } {
  if (!pw) return { score: 0, label: "" };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) s++;
  return { score: s as 0 | 1 | 2 | 3, label: ["Too weak", "Weak", "Good", "Strong"][s] };
}

export function SignupView() {
  const router = useRouter();
  const { signup } = useStore();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const strength = passwordStrength(form.password);

  const set = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "", form: "" }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (form.name.trim().length < 3) next.name = "Please enter your full name.";
    if (!isValidEmail(form.email)) next.email = "Enter a valid email address.";
    if (!isValidBDPhone(form.phone)) next.phone = "Use a valid BD number, e.g. 01815115297.";
    if (form.password.length < 6) next.password = "Use at least 6 characters.";
    else if (strength.score < 2) next.password = "Add mixed case or numbers for a stronger password.";
    if (form.confirm !== form.password) next.confirm = "Passwords don't match.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    setTimeout(() => {
      const res = signup(form.name, form.email, form.phone, form.password);
      setLoading(false);
      if (!res.ok) {
        setErrors({ form: res.error ?? "Something went wrong." });
        return;
      }
      router.push("/account");
    }, 900);
  };

  return (
    <AuthShell
      eyebrow="Join Kazi Store"
      title="Create your account"
      subtitle="One account for orders, addresses and wishlist — beautifully organized."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-bordeaux underline underline-offset-4">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-5">
        <Field label="Full name" error={errors.name}>
          <div className="relative">
            <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" aria-hidden />
            <input value={form.name} onChange={(e) => set("name", e.target.value)} className={cn(inputCls, "pl-11")} placeholder="e.g. Ayesha Rahman" autoComplete="name" />
          </div>
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Email address" error={errors.email}>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" aria-hidden />
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={cn(inputCls, "pl-11")} placeholder="you@example.com" autoComplete="email" />
            </div>
          </Field>
          <Field label="Phone (BD)" error={errors.phone}>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" aria-hidden />
              <input value={form.phone} onChange={(e) => set("phone", e.target.value)} className={cn(inputCls, "pl-11")} placeholder="01815115297" inputMode="tel" autoComplete="tel" />
            </div>
          </Field>
        </div>
        <Field label="Password" error={errors.password}>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" aria-hidden />
            <input
              type={show ? "text" : "password"}
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              className={cn(inputCls, "pl-11 pr-12")}
              placeholder="Create a password"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-taupe hover:text-ink"
            >
              {show ? <EyeOff className="h-4.5 w-4.5" aria-hidden /> : <Eye className="h-4.5 w-4.5" aria-hidden />}
            </button>
          </div>
          {form.password && (
            <div className="mt-2.5" aria-live="polite">
              <div className="flex gap-1.5">
                {[1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-colors",
                      strength.score >= i ? (strength.score === 3 ? "bg-success" : strength.score === 2 ? "bg-champagne" : "bg-danger") : "bg-sand"
                    )}
                    aria-hidden
                  />
                ))}
              </div>
              <p className="mt-1.5 text-[12px] font-medium text-taupe">Strength: {strength.label}</p>
            </div>
          )}
        </Field>
        <Field label="Confirm password" error={errors.confirm}>
          <input
            type={show ? "text" : "password"}
            value={form.confirm}
            onChange={(e) => set("confirm", e.target.value)}
            className={inputCls}
            placeholder="Repeat your password"
            autoComplete="new-password"
          />
        </Field>

        {errors.form && (
          <p role="alert" className="border border-danger/30 bg-danger/5 px-4 py-3 text-[13.5px] font-medium text-danger">
            {errors.form}
          </p>
        )}

        <button type="submit" disabled={loading} className={cn(btnPrimary, "w-full")}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {loading ? "Creating your account…" : "Create Account"}
        </button>
        <p className="text-center text-[12px] leading-relaxed text-stone">
          By creating an account you agree to our{" "}
          <Link href="/policies/terms" className="underline underline-offset-2">Terms</Link> and{" "}
          <Link href="/policies/privacy" className="underline underline-offset-2">Privacy Policy</Link>.
        </p>
      </form>
    </AuthShell>
  );
}

/* ——— FORGOT PASSWORD ——— */
export function ForgotView() {
  const { requestPasswordReset } = useStore();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setState("loading");
    setTimeout(() => {
      const res = requestPasswordReset(email);
      if (!res.ok) {
        setState("idle");
        setError(res.error ?? "Something went wrong.");
        return;
      }
      setState("success");
    }, 900);
  };

  return (
    <AuthShell
      eyebrow="Account Recovery"
      title="Reset your password"
      subtitle="Enter the email you signed up with and we'll send reset instructions."
      footer={
        <>
          Remembered it?{" "}
          <Link href="/login" className="font-semibold text-bordeaux underline underline-offset-4">
            Back to sign in
          </Link>
        </>
      }
    >
      {state === "success" ? (
        <div className="border border-success/30 bg-success/5 p-6 text-center" role="status">
          <MailCheck className="mx-auto h-10 w-10 text-success" aria-hidden />
          <p className="mt-4 font-display text-xl font-medium text-ink">Check your inbox</p>
          <p className="mt-2 text-[14px] leading-relaxed text-espresso/85">
            If an account exists for <span className="font-semibold">{email}</span>, reset instructions are on their
            way. (Demo flow — connect an email service in production.)
          </p>
          <Link href="/login" className={cn(btnPrimary, "mt-6 w-full")}>
            Back to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-5">
          <Field label="Email address" error={error}>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" aria-hidden />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                className={cn(inputCls, "pl-11")}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
          </Field>
          <button type="submit" disabled={state === "loading"} className={cn(btnPrimary, "w-full")}>
            {state === "loading" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            {state === "loading" ? "Sending…" : "Send Reset Link"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
