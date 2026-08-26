"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Lock, ShoppingBag, Tag, Trash2, Truck, X } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { useStore } from "@/components/providers/StoreProvider";
import { EmptyState, QtySelector, Reveal, SectionHeading, btnPrimary } from "@/components/ui";
import { cn, estimateDelivery, formatBDT, STORE } from "@/lib/utils";

export function CartView() {
  const {
    cart, hydrated, setQty, removeFromCart, clearCart,
    coupon, applyCoupon, removeCoupon, discountFor,
  } = useStore();
  const [code, setCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ ok: boolean; text: string } | null>(null);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            {[0, 1].map((i) => (
              <div key={i} className="flex animate-pulse gap-5 border border-sand p-5">
                <div className="h-32 w-24 bg-cream" />
                <div className="flex-1 space-y-3 py-2">
                  <div className="h-4 w-2/3 bg-cream" />
                  <div className="h-3 w-1/3 bg-cream" />
                  <div className="h-8 w-28 bg-cream" />
                </div>
              </div>
            ))}
          </div>
          <div className="h-72 animate-pulse bg-cream" />
        </div>
      </div>
    );
  }

  const lines = cart
    .map((item) => ({ item, product: PRODUCTS.find((p) => p.id === item.productId)! }))
    .filter((l) => l.product);

  const subtotal = lines.reduce((s, l) => s + l.product.price * l.item.qty, 0);
  const savings = lines.reduce(
    (s, l) => s + Math.max(0, l.product.originalPrice - l.product.price) * l.item.qty,
    0
  );
  const { amount: discount, code: applied } = discountFor(subtotal);
  const freeShip = subtotal >= STORE.freeShippingThreshold;
  const shipGap = Math.max(0, STORE.freeShippingThreshold - subtotal);
  const estimatedTotal = subtotal - discount;

  const submitCoupon = (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    const res = applyCoupon(code, subtotal);
    setCouponMsg({ ok: res.ok, text: res.message });
    if (res.ok) setCode("");
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-24 sm:px-8">
      <div className="border-b border-sand py-12 lg:py-16">
        <Reveal>
          <SectionHeading
            align="left"
            eyebrow="Review & Checkout"
            title={lines.length ? `Your Bag (${cart.reduce((s, i) => s + i.qty, 0)})` : "Your Bag"}
          />
        </Reveal>
      </div>

      {lines.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="h-8 w-8" aria-hidden />}
          title="Your bag is empty"
          message="Beautiful things are waiting. Browse our bestsellers or search for something specific."
          actionLabel="Start Shopping"
          actionHref="/shop"
        />
      ) : (
        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[1fr_400px]">
          {/* Lines */}
          <div>
            {/* Free shipping progress */}
            <div className="mb-8 border border-sand bg-fog p-5">
              <p className="flex items-center gap-2.5 text-[13.5px] font-medium text-espresso">
                <Truck className="h-4 w-4 text-champagne" aria-hidden />
                {freeShip ? (
                  <>Congratulations — your order qualifies for <span className="font-bold text-success">free delivery</span>!</>
                ) : (
                  <>Add <span className="font-bold text-bordeaux">{formatBDT(shipGap)}</span> more to unlock free delivery</>
                )}
              </p>
              <div className="mt-3 h-[5px] overflow-hidden rounded-full bg-sand">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-champagne to-bordeaux transition-all duration-700"
                  style={{ width: `${Math.min(100, (subtotal / STORE.freeShippingThreshold) * 100)}%` }}
                />
              </div>
            </div>

            <ul className="divide-y divide-sand border-y border-sand">
              {lines.map(({ item, product }) => (
                <li key={product.id} className="flex gap-4 py-6 sm:gap-6">
                  <Link href={`/product/${product.slug}`} className="block w-20 shrink-0 bg-cream sm:w-28">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.images[0]} alt={product.name} className="aspect-[4/5] h-full w-full object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-champagne">{product.brand}</p>
                        <Link href={`/product/${product.slug}`}>
                          <h3 className="mt-1 font-display text-[16.5px] leading-snug font-medium text-ink transition-colors hover:text-bordeaux">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="mt-1 text-[12px] text-stone">{product.subcategory}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        aria-label={`Remove ${product.name}`}
                        className="flex h-8 w-8 shrink-0 items-center justify-center text-stone transition-colors hover:text-danger"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                      <QtySelector qty={item.qty} onChange={(q) => setQty(product.id, q)} small />
                      <div className="text-right">
                        <p className="text-[16.5px] font-semibold text-ink">{formatBDT(product.price * item.qty)}</p>
                        {product.originalPrice > product.price && (
                          <p className="text-[12.5px] text-stone line-through">
                            {formatBDT(product.originalPrice * item.qty)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:text-bordeaux"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden /> Continue Shopping
              </Link>
              <button
                type="button"
                onClick={clearCart}
                className="text-[12px] font-semibold uppercase tracking-[0.14em] text-stone transition-colors hover:text-danger"
              >
                Clear Bag
              </button>
            </div>
          </div>

          {/* Summary */}
          <aside className="border border-sand bg-fog p-7 lg:sticky lg:top-32">
            <h2 className="font-display text-2xl font-medium text-ink">Order Summary</h2>

            {/* Coupon */}
            <div className="mt-6 border-y border-sand py-5">
              <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-espresso">
                <Tag className="h-3.5 w-3.5 text-champagne" aria-hidden /> Coupon code
              </p>
              {applied ? (
                <div className="flex items-center justify-between bg-cream px-4 py-3">
                  <span className="text-[13.5px] font-semibold text-success">
                    {applied} applied — you save {formatBDT(discount)}
                  </span>
                  <button type="button" onClick={removeCoupon} aria-label="Remove coupon" className="text-taupe hover:text-danger">
                    <X className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              ) : (
                <>
                  <form onSubmit={submitCoupon} className="flex">
                    <label htmlFor="coupon" className="sr-only">Coupon code</label>
                    <input
                      id="coupon"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="e.g. WELCOME10"
                      className="w-full border border-sand bg-white px-4 py-3 text-[14px] uppercase outline-none placeholder:normal-case placeholder:text-stone focus:border-ink"
                    />
                    <button
                      type="submit"
                      className="shrink-0 bg-ink px-5 text-[11.5px] font-bold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-bordeaux"
                    >
                      Apply
                    </button>
                  </form>
                  {couponMsg && (
                    <p role="status" className={cn("mt-2 text-[12.5px] font-medium", couponMsg.ok ? "text-success" : "text-danger")}>
                      {couponMsg.text}
                    </p>
                  )}
                </>
              )}
            </div>

            <dl className="space-y-3.5 py-5 text-[14.5px]">
              <div className="flex justify-between">
                <dt className="text-espresso">Subtotal</dt>
                <dd className="font-semibold text-ink">{formatBDT(subtotal)}</dd>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-success">
                  <dt>Product savings</dt>
                  <dd className="font-semibold">−{formatBDT(savings)}</dd>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-success">
                  <dt>Coupon discount</dt>
                  <dd className="font-semibold">−{formatBDT(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-espresso">Delivery</dt>
                <dd className="text-taupe">{freeShip ? "Free" : "Calculated at checkout"}</dd>
              </div>
              <div className="flex justify-between border-t border-sand pt-4 text-[17px]">
                <dt className="font-semibold text-ink">Estimated total</dt>
                <dd className="font-bold text-bordeaux">{formatBDT(estimatedTotal)}</dd>
              </div>
            </dl>

            <p className="mb-5 text-[12.5px] leading-relaxed text-taupe">
              Standard delivery estimate: {estimateDelivery(2, 5)} depending on your zone.
            </p>

            <Link href="/checkout" className={cn(btnPrimary, "w-full")}>
              <Lock className="h-3.5 w-3.5" aria-hidden />
              Proceed to Checkout <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <p className="mt-4 text-center text-[11.5px] tracking-wide text-stone">
              COD · bKash · Nagad · Cards accepted at checkout
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
