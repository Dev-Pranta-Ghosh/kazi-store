"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, MapPin, Package, Phone, ReceiptText } from "lucide-react";
import { useStore } from "@/components/providers/StoreProvider";
import { estimateDelivery, formatBDT, formatDate, STORE } from "@/lib/utils";
import { btnPrimary, btnSecondary } from "@/components/ui";

const PAYMENT_LABELS: Record<string, string> = {
  cod: "Cash on Delivery",
  bkash: "bKash",
  nagad: "Nagad",
  card: "Card Payment",
};

export function OrderConfirmationView({ orderId }: { orderId: string }) {
  const { orders, hydrated } = useStore();

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 sm:px-8">
        <div className="h-96 animate-pulse bg-cream" />
      </div>
    );
  }

  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-8">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-cream text-bordeaux">
          <ReceiptText className="h-8 w-8" aria-hidden />
        </div>
        <h1 className="font-display text-3xl font-medium text-ink">We couldn't find that order</h1>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-taupe">
          The order reference may have expired from this device. Sign in to check your order history, or start a fresh
          shopping session.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/account" className={btnSecondary}>View My Orders</Link>
          <Link href="/shop" className={btnPrimary}>Continue Shopping</Link>
        </div>
      </div>
    );
  }

  const delivery = STORE.deliveryCharges[order.deliveryMethod];

  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 sm:px-8">
      {/* Success header */}
      <div className="border-b border-sand py-14 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-10 w-10 text-success" aria-hidden />
        </div>
        <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.3em] text-champagne">Thank You, {order.customer.name.split(" ")[0]}</p>
        <h1 className="mt-3 font-display text-4xl font-medium text-ink sm:text-5xl">Your order is confirmed</h1>
        <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-taupe">
          We've received your order and our team will confirm it shortly. A summary has been sent to{" "}
          <span className="font-medium text-ink">{order.customer.email}</span>.
        </p>
        <p className="mt-6 inline-flex items-center gap-3 border border-champagne/50 bg-cream px-6 py-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-taupe">Order No.</span>
          <span className="font-display text-xl font-semibold tracking-wide text-bordeaux">{order.id}</span>
        </p>
      </div>

      {/* Items */}
      <div className="py-10">
        <h2 className="flex items-center gap-3 font-display text-2xl font-medium text-ink">
          <Package className="h-5 w-5 text-champagne" aria-hidden /> What's in your parcel
        </h2>
        <ul className="mt-6 divide-y divide-sand border-y border-sand">
          {order.items.map((item) => (
            <li key={item.productId} className="flex items-center gap-4 py-4 sm:gap-6">
              <Link href={`/product/${item.slug}`} className="block w-14 shrink-0 bg-cream sm:w-16">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.name} className="aspect-[4/5] h-full w-full object-cover" />
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/product/${item.slug}`} className="font-medium text-ink transition-colors hover:text-bordeaux">
                  {item.name}
                </Link>
                <p className="mt-0.5 text-[12.5px] text-stone">
                  {item.brand} · Qty {item.qty}
                </p>
              </div>
              <p className="font-semibold text-ink">{formatBDT(item.price * item.qty)}</p>
            </li>
          ))}
        </ul>
        <dl className="ml-auto mt-6 max-w-xs space-y-2.5 text-[14px]">
          <div className="flex justify-between">
            <dt className="text-espresso">Subtotal</dt>
            <dd className="font-semibold">{formatBDT(order.subtotal)}</dd>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-success">
              <dt>Discount {order.couponCode && `(${order.couponCode})`}</dt>
              <dd>−{formatBDT(order.discount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-espresso">Delivery</dt>
            <dd className="font-semibold">{order.deliveryCharge === 0 ? "FREE" : formatBDT(order.deliveryCharge)}</dd>
          </div>
          <div className="flex justify-between border-t border-sand pt-3 text-[17px]">
            <dt className="font-semibold">Total</dt>
            <dd className="font-bold text-bordeaux">{formatBDT(order.total)}</dd>
          </div>
        </dl>
      </div>

      {/* Info cards */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="border border-sand bg-fog p-6">
          <p className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-champagne">
            <MapPin className="h-4 w-4" aria-hidden /> Delivering to
          </p>
          <p className="mt-3.5 text-[14px] font-semibold text-ink">{order.customer.name}</p>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-espresso/85">
            {order.shipping.address}, {order.shipping.area}
            <br />
            {order.shipping.city}
          </p>
          <p className="mt-1.5 text-[13px] text-taupe">{order.customer.phone}</p>
          {order.shipping.note && <p className="mt-2 text-[12.5px] italic text-taupe">“{order.shipping.note}”</p>}
        </div>
        <div className="border border-sand bg-fog p-6">
          <p className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-champagne">
            <Clock3 className="h-4 w-4" aria-hidden /> Delivery estimate
          </p>
          <p className="mt-3.5 text-[14px] font-semibold text-ink">{delivery.label}</p>
          <p className="mt-1.5 text-[13.5px] text-espresso/85">
            {delivery.eta} — expected between <span className="font-semibold">{estimateDelivery(1, 4)}</span>
          </p>
          <p className="mt-2 text-[12.5px] italic text-taupe">Estimate placeholder — confirm courier timeline with the store.</p>
        </div>
        <div className="border border-sand bg-fog p-6">
          <p className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-champagne">
            <Phone className="h-4 w-4" aria-hidden /> Payment
          </p>
          <p className="mt-3.5 text-[14px] font-semibold text-ink">{PAYMENT_LABELS[order.paymentMethod]}</p>
          <p className="mt-1.5 text-[13.5px] text-espresso/85">
            {order.paymentMethod === "cod"
              ? `Please keep ${formatBDT(order.total)} ready on delivery.`
              : `Our team will verify your ${PAYMENT_LABELS[order.paymentMethod]} payment and confirm.`}
          </p>
          <p className="mt-2 text-[13px] text-taupe">Placed on {formatDate(order.date)}</p>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-4">
        <Link href="/shop" className={btnPrimary}>
          Continue Shopping <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <Link href="/account" className={btnSecondary}>Track in My Account</Link>
      </div>
    </div>
  );
}
