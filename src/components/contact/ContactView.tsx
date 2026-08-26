"use client";

import { useState, type FormEvent } from "react";
import { Clock3, Loader2, Mail, MapPin, MessageSquare, Phone, Send } from "lucide-react";
import { cn, isValidBDPhone, isValidEmail, STORE } from "@/lib/utils";
import { Breadcrumbs, btnPrimary, Field, inputCls, Reveal } from "@/components/ui";

const SUBJECTS = ["General enquiry", "Order support", "Product question", "Delivery question", "Feedback", "Other"];

export function ContactView() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: SUBJECTS[0], message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");

  const set = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (form.name.trim().length < 3) next.name = "Please enter your name.";
    if (!isValidEmail(form.email)) next.email = "Enter a valid email address.";
    if (form.phone && !isValidBDPhone(form.phone)) next.phone = "Use the format 01XXXXXXXXX.";
    if (form.message.trim().length < 10) next.message = "Tell us a little more (at least 10 characters).";
    setErrors(next);
    if (Object.keys(next).length) return;
    setState("loading");
    // Demo delivery — connect to a real mail/CRM endpoint later.
    setTimeout(() => setState("success"), 1100);
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-24 sm:px-8">
      <div className="border-b border-sand py-10 lg:py-14">
        <Reveal>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
          <h1 className="mt-5 font-display text-4xl font-medium text-ink sm:text-5xl">Let's Talk Beauty</h1>
          <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-espresso/85">
            Questions about a product, an order, or what suits your skin? We answer fast — and honestly.
          </p>
        </Reveal>
      </div>

      <div className="grid gap-12 pt-12 lg:grid-cols-[1fr_1.1fr]">
        {/* Info side */}
        <Reveal>
          <div className="space-y-8">
            <div>
              <p className="font-display text-2xl font-semibold text-ink">
                Kazi Store <span className="font-bangla text-[19px] text-taupe">— কাজী স্টোর</span>
              </p>
              <ul className="mt-6 space-y-5 text-[14.5px]">
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bordeaux/10 text-bordeaux">
                    <MapPin className="h-4.5 w-4.5" aria-hidden />
                  </span>
                  <span>
                    <strong className="block text-[12px] uppercase tracking-[0.16em] text-taupe">Visit us</strong>
                    <span className="mt-1 block leading-relaxed text-espresso">
                      {STORE.address}
                      <br />
                      Located in {STORE.locatedIn}
                    </span>
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bordeaux/10 text-bordeaux">
                    <Phone className="h-4.5 w-4.5" aria-hidden />
                  </span>
                  <span>
                    <strong className="block text-[12px] uppercase tracking-[0.16em] text-taupe">Call / WhatsApp</strong>
                    <a href={STORE.phoneHref} className="mt-1 block font-semibold text-espresso transition-colors hover:text-bordeaux">
                      {STORE.phone}
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bordeaux/10 text-bordeaux">
                    <Mail className="h-4.5 w-4.5" aria-hidden />
                  </span>
                  <span>
                    <strong className="block text-[12px] uppercase tracking-[0.16em] text-taupe">Email</strong>
                    <a href={`mailto:${STORE.email}`} className="mt-1 block text-espresso transition-colors hover:text-bordeaux">
                      {STORE.email} <span className="text-[12px] italic text-stone">(placeholder)</span>
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bordeaux/10 text-bordeaux">
                    <Clock3 className="h-4.5 w-4.5" aria-hidden />
                  </span>
                  <span>
                    <strong className="block text-[12px] uppercase tracking-[0.16em] text-taupe">Business hours</strong>
                    <span className="mt-1 block text-espresso">
                      {STORE.hours}
                      <span className="block text-[12px] italic text-stone">Placeholder — confirm actual hours with the business.</span>
                    </span>
                  </span>
                </li>
              </ul>
            </div>

            {/* Map embed */}
            <div>
              <div className="overflow-hidden border border-sand">
                <iframe
                  title="Kazi Store location — Jubilee Road, Chattogram"
                  src="https://maps.google.com/maps?q=Jubilee%20Road%2C%20Chattogram%2C%20Bangladesh&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="h-72 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <p className="mt-2 text-[12px] italic text-stone">
                Map shows Jubilee Road, Chattogram — replace with the store's precise pin when confirmed.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Form side */}
        <Reveal delay={140}>
          <div className="border border-sand bg-white p-7 sm:p-10">
            {state === "success" ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center" role="status">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                  <MessageSquare className="h-7 w-7 text-success" aria-hidden />
                </span>
                <h2 className="mt-6 font-display text-3xl font-medium text-ink">Message received</h2>
                <p className="mx-auto mt-3 max-w-sm text-[14.5px] leading-relaxed text-taupe">
                  Thank you, {form.name.split(" ")[0]}. We'll get back to you at {form.email} as soon as we can —
                  usually within one working day.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setForm({ name: "", email: "", phone: "", subject: SUBJECTS[0], message: "" });
                    setState("idle");
                  }}
                  className={cn(btnPrimary, "mt-8")}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-display text-2xl font-medium text-ink">Send us a message</h2>
                <p className="mt-2 text-[13.5px] text-taupe">We reply within one working day.</p>
                <form onSubmit={submit} noValidate className="mt-8 grid gap-5 sm:grid-cols-2">
                  <Field label="Your name" error={errors.name}>
                    <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} placeholder="Full name" autoComplete="name" />
                  </Field>
                  <Field label="Email" error={errors.email}>
                    <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} placeholder="you@example.com" autoComplete="email" />
                  </Field>
                  <Field label="Phone (optional)" error={errors.phone}>
                    <input value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} placeholder="01XXXXXXXXX" inputMode="tel" autoComplete="tel" />
                  </Field>
                  <Field label="Subject">
                    <div className="relative">
                      <select
                        value={form.subject}
                        onChange={(e) => set("subject", e.target.value)}
                        className={cn(inputCls, "appearance-none pr-10")}
                        aria-label="Subject"
                      >
                        {SUBJECTS.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                      <Send className="sr-only" />
                    </div>
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Message" error={errors.message}>
                      <textarea
                        value={form.message}
                        onChange={(e) => set("message", e.target.value)}
                        rows={5}
                        className={cn(inputCls, "resize-none")}
                        placeholder="How can we help?"
                      />
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <button type="submit" disabled={state === "loading"} className={cn(btnPrimary, "w-full sm:w-auto")}>
                      {state === "loading" ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      ) : (
                        <Send className="h-4 w-4" aria-hidden />
                      )}
                      {state === "loading" ? "Sending…" : "Send Message"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
