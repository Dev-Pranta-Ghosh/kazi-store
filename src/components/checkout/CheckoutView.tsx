"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Banknote,
  Check,
  ChevronDown,
  CreditCard,
  Lock,
  MapPin,
  Phone,
  ShoppingBag,
  Smartphone,
  Truck,
  User,
} from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { useStore } from "@/components/providers/StoreProvider";
import type { DeliveryMethod, Order, PaymentMethod } from "@/lib/types";
import { cn, formatBDT, generateOrderId, isValidBDPhone, isValidEmail, STORE } from "@/lib/utils";
import { btnPrimary, Field, inputCls } from "@/components/ui";

const STEPS = ["Customer", "Shipping", "Delivery", "Payment"] as const;

interface FormState {
  name: string;
  email: string;
  phone: string;
  address: string;
  area: string;
  city: string;
  note: string;
}

const initialForm: FormState = {
  name: "",
  email: "",
  phone: "",
  address: "",
  area: "",
  city: "Chattogram",
  note: "",
};

const CITIES = ["Chattogram", "Dhaka", "Sylhet", "Khulna", "Rajshahi", "Barisal", "Rangpur", "Cox's Bazar", "Comilla", "Narayanganj", "Other"];

export function CheckoutView() {
  const router = useRouter();
  const { cart, hydrated, user, coupon, discountFor, placeOrder, clearCart } = useStore();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState | "txn" | "card", string>>>({});
  const [delivery, setDelivery] = useState<DeliveryMethod>("chattogram");
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [txnId, setTxnId] = useState("");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvc: "" });
  const [placing, setPlacing] = useState(false);
  const [bootstrapped, setBootstrapped] = useState(false);

  // Prefill from account once hydrated
  if (hydrated && user && !bootstrapped) {
    const def = user.addresses.find((a) => a.isDefault);
    setForm((f) => ({
      ...f,
      name: f.name || user.name,
      email: f.email || user.email,
      phone: f.phone || user.phone,
      address: f.address || def?.address || "",
      area: f.area || def?.area || "",
      city: f.city || def?.city || "Chattogram",
    }));
    setBootstrapped(true);
  }

  const lines = useMemo(
    () =>
      cart
        .map((item) => ({ item, product: PRODUCTS.find((p) => p.id === item.productId)! }))
        .filter((l) => l.product),
    [cart]
  );

  const subtotal = lines.reduce((s, l) => s + l.product.price * l.item.qty, 0);
  const { amount: discount, code: appliedCoupon } = discountFor(subtotal);
  const deliveryCharge = subtotal >= STORE.freeShippingThreshold ? 0 : STORE.deliveryCharges[delivery].charge;
  const total = subtotal - discount + deliveryCharge;

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-24 sm:px-8">
        <div className="h-96 animate-pulse bg-cream" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-24 text-center sm:px-8">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-cream text-bordeaux">
          <ShoppingBag className="h-8 w-8" aria-hidden />
        </div>
        <h1 className="font-display text-3xl font-medium text-ink">Nothing to check out yet</h1>
        <p className="mx-auto mt-3 max-w-sm text-[15px] text-taupe">
          Your bag is empty. Add a few favorites and come back — the checkout will be waiting.
        </p>
        <Link href="/shop" className={cn(btnPrimary, "mt-8")}>
          Browse the Shop
        </Link>
      </div>
    );
  }

  const set = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validateStep = (): boolean => {
    const next: typeof errors = {};
    if (step === 0) {
      if (form.name.trim().length < 3) next.name = "Please enter your full name.";
      if (!isValidEmail(form.email)) next.email = "Enter a valid email address.";
      if (!isValidBDPhone(form.phone)) next.phone = "Enter a valid BD number, e.g. 01815115297.";
    }
    if (step === 1) {
      if (form.address.trim().length < 6) next.address = "Please enter your full street address.";
      if (form.area.trim().length < 2) next.area = "Please enter your area / thana.";
      if (!form.city) next.city = "Select your city.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validatePayment = (): boolean => {
    const next: typeof errors = {};
    if ((payment === "bkash" || payment === "nagad") && txnId.trim().length < 6) {
      next.txn = `Enter the ${payment === "bkash" ? "bKash" : "Nagad"} transaction ID.`;
    }
    if (payment === "card") {
      if (card.number.replace(/\s/g, "").length < 15) next.card = "Enter a valid card number.";
      else if (!card.name.trim()) next.card = "Enter the name on card.";
      else if (!/^\d{2}\s*\/\s*\d{2}$/.test(card.expiry)) next.card = "Enter expiry as MM/YY.";
      else if (card.cvc.length < 3) next.card = "Enter the 3-digit CVC.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validatePayment()) return;
    setPlacing(true);
    const order: Order = {
      id: generateOrderId(),
      date: new Date().toISOString(),
      status: "Processing",
      items: lines.map((l) => ({
        productId: l.product.id,
        slug: l.product.slug,
        name: l.product.name,
        brand: l.product.brand,
        image: l.product.images[0],
        price: l.product.price,
        qty: l.item.qty,
      })),
      subtotal,
      discount,
      couponCode: appliedCoupon ?? undefined,
      deliveryCharge,
      total,
      customer: { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() },
      shipping: { address: form.address.trim(), area: form.area.trim(), city: form.city, note: form.note.trim() || undefined },
      deliveryMethod: delivery,
      paymentMethod: payment,
    };
    // Simulate an order API round-trip
    setTimeout(() => {
      placeOrder(order);
      clearCart();
      router.push(`/order-confirmation?order=${order.id}`);
    }, 1400);
  };

  const stepIcon = [User, MapPin, Truck, Banknote];

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-24 sm:px-8">
      <div className="border-b border-sand py-10 lg:py-14">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-champagne">Almost There</p>
        <h1 className="mt-3 font-display text-4xl font-medium text-ink sm:text-5xl">Secure Checkout</h1>
      </div>

      {/* Stepper */}
      <ol className="flex items-center gap-0 overflow-x-auto py-8" aria-label="Checkout progress">
        {STEPS.map((label, i) => {
          const Icon = stepIcon[i];
          const done = i < step;
          const active = i === step;
          return (
            <li key={label} className="flex shrink-0 items-center">
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                aria-current={active ? "step" : undefined}
                className={cn("flex items-center gap-2.5 sm:gap-3", i < step ? "cursor-pointer" : "cursor-default")}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border text-[12px] font-bold transition-all",
                    done
                      ? "border-success bg-success text-ivory"
                      : active
                        ? "border-bordeaux bg-bordeaux text-ivory"
                        : "border-sand bg-white text-stone"
                  )}
                >
                  {done ? <Check className="h-4 w-4" aria-hidden /> : <Icon className="h-4 w-4" aria-hidden />}
                </span>
                <span className={cn("text-[11px] font-bold uppercase tracking-[0.14em]", active ? "text-ink" : done ? "text-success" : "text-stone")}>
                  {label}
                </span>
              </button>
              {i < STEPS.length - 1 && <span className={cn("mx-3 h-px w-8 sm:w-14", i < step ? "bg-success" : "bg-sand")} aria-hidden />}
            </li>
          );
        })}
      </ol>

      <div className="grid items-start gap-10 lg:grid-cols-[1fr_400px]">
        <div>
          {/* ——— STEP 1: CUSTOMER ——— */}
          {step === 0 && (
            <section aria-label="Customer information">
              <StepTitle n={1} title="Who's ordering?" />
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <Field label="Full name" error={errors.name}>
                  <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} placeholder="e.g. Ayesha Rahman" autoComplete="name" />
                </Field>
                <Field label="Phone (BD)" error={errors.phone} hint="Format: 01XXXXXXXXX">
                  <input value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} placeholder="01815115297" inputMode="tel" autoComplete="tel" />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Email address" error={errors.email}>
                    <input value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} placeholder="you@example.com" type="email" autoComplete="email" />
                  </Field>
                </div>
              </div>
              {!user && (
                <p className="mt-5 text-[13px] text-taupe">
                  Ordering as guest —{" "}
                  <Link href="/signup" className="font-semibold text-bordeaux underline underline-offset-4">
                    create an account
                  </Link>{" "}
                  to track orders and check out faster next time.
                </p>
              )}
            </section>
          )}

          {/* ——— STEP 2: SHIPPING ——— */}
          {step === 1 && (
            <section aria-label="Shipping address">
              <StepTitle n={2} title="Where should we deliver?" />
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Street address" error={errors.address}>
                    <input value={form.address} onChange={(e) => set("address", e.target.value)} className={inputCls} placeholder="House, road, block, landmark" autoComplete="street-address" />
                  </Field>
                </div>
                <Field label="Area / Thana" error={errors.area}>
                  <input value={form.area} onChange={(e) => set("area", e.target.value)} className={inputCls} placeholder="e.g. Jubilee Road, GEC, Banani" />
                </Field>
                <Field label="City" error={errors.city}>
                  <div className="relative">
                    <select value={form.city} onChange={(e) => set("city", e.target.value)} className={cn(inputCls, "appearance-none pr-10")}>
                      {CITIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-taupe" aria-hidden />
                  </div>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Delivery note (optional)">
                    <textarea
                      value={form.note}
                      onChange={(e) => set("note", e.target.value)}
                      rows={3}
                      className={cn(inputCls, "resize-none")}
                      placeholder="Any instructions for the courier…"
                    />
                  </Field>
                </div>
              </div>
            </section>
          )}

          {/* ——— STEP 3: DELIVERY ——— */}
          {step === 2 && (
            <section aria-label="Delivery method">
              <StepTitle n={3} title="Choose a delivery zone" />
              <div className="mt-7 space-y-3.5" role="radiogroup" aria-label="Delivery options">
                {(Object.keys(STORE.deliveryCharges) as DeliveryMethod[]).map((key) => {
                  const opt = STORE.deliveryCharges[key];
                  const active = delivery === key;
                  const free = subtotal >= STORE.freeShippingThreshold;
                  return (
                    <button
                      key={key}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setDelivery(key)}
                      className={cn(
                        "flex w-full items-center justify-between gap-4 border p-5 text-left transition-all",
                        active ? "border-bordeaux bg-bordeaux/[0.04] shadow-card" : "border-sand bg-white hover:border-stone"
                      )}
                    >
                      <span className="flex items-center gap-4">
                        <span className={cn("flex h-5 w-5 items-center justify-center rounded-full border-2", active ? "border-bordeaux" : "border-stone")} aria-hidden>
                          {active && <span className="h-2.5 w-2.5 rounded-full bg-bordeaux" />}
                        </span>
                        <span>
                          <span className="block text-[15px] font-semibold text-ink">{opt.label}</span>
                          <span className="text-[12.5px] text-taupe">Estimated {opt.eta}</span>
                        </span>
                      </span>
                      <span className={cn("text-[15px] font-bold", free ? "text-success" : "text-ink")}>
                        {free ? "FREE" : formatBDT(opt.charge)}
                      </span>
                    </button>
                  );
                })}
              </div>
              {subtotal >= STORE.freeShippingThreshold ? (
                <p className="mt-4 text-[13px] font-medium text-success">Your order qualifies for free delivery.</p>
              ) : (
                <p className="mt-4 text-[13px] text-taupe">
                  Add {formatBDT(STORE.freeShippingThreshold - subtotal)} more to get free delivery.
                </p>
              )}
            </section>
          )}

          {/* ——— STEP 4: PAYMENT ——— */}
          {step === 3 && (
            <section aria-label="Payment method">
              <StepTitle n={4} title="How would you like to pay?" />
              <div className="mt-7 space-y-3.5" role="radiogroup" aria-label="Payment options">
                <PaymentOption
                  active={payment === "cod"}
                  onSelect={() => setPayment("cod")}
                  icon={Banknote}
                  title="Cash on Delivery"
                  desc="Pay in cash when your parcel arrives. Most popular across Bangladesh."
                >
                  <p className="border-t border-sand/70 pt-3 text-[13px] leading-relaxed text-espresso/85">
                    Please keep the exact amount ready. Our courier will call before arriving at{" "}
                    <span className="font-semibold">{form.area || "your area"}, {form.city}</span>.
                  </p>
                </PaymentOption>

                <PaymentOption
                  active={payment === "bkash"}
                  onSelect={() => setPayment("bkash")}
                  icon={Smartphone}
                  title="bKash"
                  desc="Send Money to our merchant number, then share your Transaction ID."
                >
                  <WalletInstructions
                    brand="bKash"
                    number={STORE.phone}
                    amount={total}
                    txnId={txnId}
                    setTxnId={(v) => { setTxnId(v); setErrors((e) => ({ ...e, txn: undefined })); }}
                    error={errors.txn}
                  />
                </PaymentOption>

                <PaymentOption
                  active={payment === "nagad"}
                  onSelect={() => setPayment("nagad")}
                  icon={Smartphone}
                  title="Nagad"
                  desc="Send Money to our merchant number, then share your Transaction ID."
                >
                  <WalletInstructions
                    brand="Nagad"
                    number={STORE.phone}
                    amount={total}
                    txnId={txnId}
                    setTxnId={(v) => { setTxnId(v); setErrors((e) => ({ ...e, txn: undefined })); }}
                    error={errors.txn}
                  />
                </PaymentOption>

                <PaymentOption
                  active={payment === "card"}
                  onSelect={() => setPayment("card")}
                  icon={CreditCard}
                  title="Card Payment"
                  desc="Visa & Mastercard through a secure payment gateway."
                >
                  <div className="grid gap-4 border-t border-sand/70 pt-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <input
                        value={card.number}
                        onChange={(e) => setCard({ ...card, number: e.target.value.replace(/[^\d]/g, "").replace(/(\d{4})(?=\d)/g, "$1 ").slice(0, 19) })}
                        className={inputCls}
                        placeholder="Card number"
                        inputMode="numeric"
                        aria-label="Card number"
                      />
                    </div>
                    <input
                      value={card.name}
                      onChange={(e) => setCard({ ...card, name: e.target.value })}
                      className={inputCls}
                      placeholder="Name on card"
                      aria-label="Name on card"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        value={card.expiry}
                        onChange={(e) => setCard({ ...card, expiry: e.target.value.slice(0, 5) })}
                        className={inputCls}
                        placeholder="MM/YY"
                        aria-label="Expiry"
                      />
                      <input
                        value={card.cvc}
                        onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                        className={inputCls}
                        placeholder="CVC"
                        inputMode="numeric"
                        aria-label="CVC"
                      />
                    </div>
                    {errors.card && <p role="alert" className="text-[12.5px] font-medium text-danger sm:col-span-2">{errors.card}</p>}
                    <p className="text-[12px] leading-relaxed text-taupe sm:col-span-2">
                      Demo checkout — no real payment is processed. Connect a gateway (SSLCommerz / aamarPay / Stripe)
                      in production to charge cards securely.
                    </p>
                  </div>
                </PaymentOption>
              </div>
            </section>
          )}

          {/* Nav buttons */}
          <div className="mt-10 flex flex-wrap gap-4">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="inline-flex h-12 items-center border border-sand px-7 text-[11.5px] font-bold uppercase tracking-[0.16em] text-espresso transition-colors hover:border-ink"
              >
                Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={goNext} className={btnPrimary}>
                Continue
              </button>
            ) : (
              <button type="button" onClick={handlePlaceOrder} disabled={placing} className={cn(btnPrimary, "min-w-64")}>
                {placing ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-ivory/30 border-t-ivory" aria-hidden />
                    Placing your order…
                  </>
                ) : (
                  <>
                    <Lock className="h-3.5 w-3.5" aria-hidden />
                    Place Order — {formatBDT(total)}
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Summary */}
        <aside className="border border-sand bg-fog p-7 lg:sticky lg:top-36">
          <h2 className="font-display text-xl font-medium text-ink">Your Order</h2>
          <ul className="mt-5 max-h-64 space-y-4 overflow-y-auto pr-1">
            {lines.map(({ item, product }) => (
              <li key={product.id} className="flex gap-3.5">
                <span className="relative block h-16 w-13 shrink-0 bg-cream" style={{ width: 52 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-bold text-ivory">
                    {item.qty}
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-medium text-ink">{product.name}</span>
                  <span className="text-[11.5px] text-stone">{product.brand}</span>
                </span>
                <span className="text-[13.5px] font-semibold text-ink">{formatBDT(product.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-3 border-t border-sand pt-5 text-[14px]">
            <div className="flex justify-between">
              <dt className="text-espresso">Subtotal</dt>
              <dd className="font-semibold">{formatBDT(subtotal)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-success">
                <dt>Coupon {appliedCoupon}</dt>
                <dd className="font-semibold">−{formatBDT(discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-espresso">Delivery</dt>
              <dd className="font-semibold">{deliveryCharge === 0 ? "FREE" : formatBDT(deliveryCharge)}</dd>
            </div>
            <div className="flex justify-between border-t border-sand pt-4 text-[17px]">
              <dt className="font-semibold">Total</dt>
              <dd className="font-bold text-bordeaux">{formatBDT(total)}</dd>
            </div>
          </dl>
          <p className="mt-5 flex items-start gap-2.5 text-[12px] leading-relaxed text-taupe">
            <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-champagne" aria-hidden />
            Need help? Call us at {STORE.phone} — we'll happily assist with your order.
          </p>
        </aside>
      </div>
    </div>
  );
}

function StepTitle({ n, title }: { n: number; title: string }) {
  return (
    <h2 className="flex items-baseline gap-4 font-display text-2xl font-medium text-ink">
      <span className="text-[15px] font-semibold text-champagne">0{n}</span>
      {title}
    </h2>
  );
}

function PaymentOption({
  active,
  onSelect,
  icon: Icon,
  title,
  desc,
  children,
}: {
  active: boolean;
  onSelect: () => void;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "border transition-all",
        active ? "border-bordeaux bg-white shadow-card" : "border-sand bg-white hover:border-stone"
      )}
    >
      <button type="button" role="radio" aria-checked={active} onClick={onSelect} className="flex w-full items-start gap-4 p-5 text-left">
        <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2", active ? "border-bordeaux" : "border-stone")} aria-hidden>
          {active && <span className="h-2.5 w-2.5 rounded-full bg-bordeaux" />}
        </span>
        <span className="flex-1">
          <span className="flex items-center gap-2.5 text-[15px] font-semibold text-ink">
            <Icon className="h-4.5 w-4.5 text-champagne" aria-hidden />
            {title}
          </span>
          <span className="mt-1 block text-[13px] leading-relaxed text-taupe">{desc}</span>
        </span>
      </button>
      {active && <div className="px-5 pb-5 pl-14">{children}</div>}
    </div>
  );
}

function WalletInstructions({
  brand,
  number,
  amount,
  txnId,
  setTxnId,
  error,
}: {
  brand: string;
  number: string;
  amount: number;
  txnId: string;
  setTxnId: (v: string) => void;
  error?: string;
}) {
  return (
    <div className="space-y-3 border-t border-sand/70 pt-4">
      <ol className="list-decimal space-y-1.5 pl-5 text-[13px] leading-relaxed text-espresso/90">
        <li>Open your {brand} app and choose <strong>Send Money</strong>.</li>
        <li>
          Send <strong className="text-bordeaux">{formatBDT(amount)}</strong> to{" "}
          <strong className="tracking-wide">{number}</strong> (Personal).
        </li>
        <li>Paste the Transaction ID below and place your order — we verify and confirm.</li>
      </ol>
      <input
        value={txnId}
        onChange={(e) => setTxnId(e.target.value)}
        className={inputCls}
        placeholder={`${brand} Transaction ID (e.g. 9HX7A2KLM1)`}
        aria-label={`${brand} transaction ID`}
      />
      {error && <p role="alert" className="text-[12.5px] font-medium text-danger">{error}</p>}
    </div>
  );
}
