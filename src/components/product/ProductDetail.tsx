"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Heart,
  Package,
  RefreshCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
  ZoomIn,
} from "lucide-react";
import type { Product } from "@/lib/types";
import { cn, discountPercent, formatBDT, STORE } from "@/lib/utils";
import { PRODUCTS, relatedProducts } from "@/data/products";
import { useStore } from "@/components/providers/StoreProvider";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Accordion, Price, QtySelector, Rating, Reveal, SectionHeading, btnPrimary, btnSecondary } from "@/components/ui";

type TabKey = "description" | "benefits" | "ingredients" | "howto" | "delivery";

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, inWishlist, pushRecentlyViewed, recentlyViewed, toast } = useStore();
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<TabKey>("description");
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);

  const off = discountPercent(product.price, product.originalPrice);
  const out = product.stock <= 0;
  const low = product.stock > 0 && product.stock <= 8;
  const wish = inWishlist(product.id);
  const related = useMemo(() => relatedProducts(product, 4), [product]);
  const fbt = useMemo(() => relatedProducts(product, 2).filter((p) => p.stock > 0), [product]);
  const [fbtChecked, setFbtChecked] = useState<string[]>([]);

  useEffect(() => {
    pushRecentlyViewed(product.id);
    setFbtChecked(fbt.map((p) => p.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const recentProducts = useMemo(
    () =>
      recentlyViewed
        .filter((id) => id !== product.id)
        .map((id) => PRODUCTS.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p))
        .slice(0, 4),
    [recentlyViewed, product.id]
  );

  const fbtTotal = product.price + fbt.filter((p) => fbtChecked.includes(p.id)).reduce((s, p) => s + p.price, 0);

  const buyNow = () => {
    addToCart(product.id, qty);
    router.push("/checkout");
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "description", label: "Description" },
    { key: "benefits", label: "Key Benefits" },
    { key: "ingredients", label: "Ingredients" },
    { key: "howto", label: "How to Use" },
    { key: "delivery", label: "Delivery & Returns" },
  ];

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-24 sm:px-8">
      <div className="grid gap-12 pt-10 lg:grid-cols-2 lg:gap-16">
        {/* ——— Gallery ——— */}
        <div>
          <div
            className="relative aspect-[4/5] cursor-zoom-in overflow-hidden bg-cream"
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
            }}
            onMouseLeave={() => setZoom(null)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.images[activeImg]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-200 ease-out"
              style={zoom ? { transform: "scale(1.9)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
            />
            <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-1.5">
              {off > 0 && (
                <span className="bg-bordeaux px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-ivory">
                  Save {off}%
                </span>
              )}
              {product.isNew && (
                <span className="bg-champagne px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-ivory">New</span>
              )}
            </div>
            <span className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-2 bg-ivory/85 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink backdrop-blur">
              <ZoomIn className="h-3.5 w-3.5" aria-hidden /> Hover to zoom
            </span>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3" role="tablist" aria-label="Product images">
            {product.images.map((src, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={activeImg === i}
                aria-label={`View image ${i + 1}`}
                onClick={() => setActiveImg(i)}
                className={cn(
                  "relative aspect-[4/5] overflow-hidden border-2 bg-cream transition-all",
                  activeImg === i ? "border-bordeaux" : "border-transparent opacity-70 hover:opacity-100"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        {/* ——— Info ——— */}
        <div>
          <Reveal>
            <Link href={`/shop?brand=${encodeURIComponent(product.brand)}`} className="text-[12px] font-bold uppercase tracking-[0.24em] text-champagne transition-colors hover:text-bordeaux">
              {product.brand}
            </Link>
            <h1 className="mt-3 font-display text-3xl leading-[1.12] font-medium text-ink sm:text-4xl lg:text-[2.8rem]">
              {product.name}
            </h1>
            <div className="mt-4 flex items-center gap-3">
              <Rating value={product.rating} size="md" showCount={false} />
              <a href="#reviews" className="text-[13px] font-medium text-taupe transition-colors hover:text-bordeaux">
                {product.reviewCount.toLocaleString("en-IN")} reviews
              </a>
              <span className="text-sand">|</span>
              <span className="text-[12.5px] uppercase tracking-[0.14em] text-stone">{product.subcategory}</span>
            </div>

            <div className="mt-6 flex items-end gap-4 border-y border-sand py-6">
              <Price price={product.price} originalPrice={product.originalPrice} size="lg" />
              <span
                className={cn(
                  "mb-1 inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.14em]",
                  out ? "text-danger" : low ? "text-champagne" : "text-success"
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", out ? "bg-danger" : low ? "bg-champagne" : "bg-success")} aria-hidden />
                {out ? "Out of stock" : low ? `Low stock — ${product.stock} left` : "In stock"}
              </span>
            </div>

            <p className="mt-6 text-[15.5px] leading-relaxed text-espresso/90">{product.description}</p>

            <ul className="mt-5 grid gap-2 text-[14px] text-espresso sm:grid-cols-2">
              {product.benefits.slice(0, 4).map((b) => (
                <li key={b} className="flex items-start gap-2.5">
                  <span className="mt-[7px] h-1 w-4 shrink-0 bg-champagne" aria-hidden />
                  {b}
                </li>
              ))}
            </ul>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <QtySelector qty={qty} onChange={setQty} />
              <button
                type="button"
                disabled={out}
                onClick={() => addToCart(product.id, qty)}
                className={cn(btnPrimary, "h-12 flex-1 px-6 py-0")}
              >
                <ShoppingBag className="h-4 w-4" aria-hidden />
                {out ? "Out of Stock" : "Add to Bag"}
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-pressed={wish}
                aria-label={wish ? "Remove from wishlist" : "Add to wishlist"}
                className={cn(
                  "flex h-12 w-12 items-center justify-center border transition-all",
                  wish ? "border-bordeaux bg-bordeaux text-ivory" : "border-sand text-ink hover:border-bordeaux hover:text-bordeaux"
                )}
              >
                <Heart className="h-4.5 w-4.5" fill={wish ? "currentColor" : "none"} aria-hidden />
              </button>
            </div>
            <button
              type="button"
              disabled={out}
              onClick={buyNow}
              className={cn(btnSecondary, "mt-3 h-12 w-full py-0")}
            >
              Buy Now — Express Checkout
            </button>

            {/* Delivery notes */}
            <div className="mt-8 space-y-3 border border-sand bg-fog p-5 text-[13.5px]">
              <p className="flex items-center gap-3 text-espresso">
                <Truck className="h-4 w-4 shrink-0 text-champagne" aria-hidden />
                Chattogram {STORE.deliveryCharges.chattogram.charge}৳ · Dhaka {STORE.deliveryCharges.dhaka.charge}৳ · Nationwide{" "}
                {STORE.deliveryCharges.nationwide.charge}৳
              </p>
              <p className="flex items-center gap-3 text-espresso">
                <Package className="h-4 w-4 shrink-0 text-champagne" aria-hidden />
                Free delivery over {formatBDT(STORE.freeShippingThreshold)} — Cash on Delivery available
              </p>
              <p className="flex items-center gap-3 text-espresso">
                <RefreshCcw className="h-4 w-4 shrink-0 text-champagne" aria-hidden />
                Easy returns on damaged or incorrect items within 48 hours
              </p>
              <p className="flex items-center gap-3 text-espresso">
                <ShieldCheck className="h-4 w-4 shrink-0 text-champagne" aria-hidden />
                Sold and delivered by Kazi Store, Jubilee Road, Chattogram
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ——— Details tabs (desktop) / accordions (mobile) ——— */}
      <section className="mt-20" id="reviews">
        <div className="hidden border-b border-sand md:flex" role="tablist" aria-label="Product information">
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "relative px-6 py-4 text-[12px] font-bold uppercase tracking-[0.16em] transition-colors",
                tab === t.key ? "text-bordeaux" : "text-taupe hover:text-ink"
              )}
            >
              {t.label}
              {tab === t.key && <span className="absolute inset-x-0 -bottom-px h-[2px] bg-bordeaux" aria-hidden />}
            </button>
          ))}
        </div>
        <div className="hidden py-10 md:block">
          {tab === "description" && (
            <div className="prose max-w-3xl">
              <p className="text-[16px] leading-[1.85] text-espresso/90">{product.description}</p>
              <p className="mt-4 text-[16px] leading-[1.85] text-espresso/90">
                Part of our {product.subcategory.toLowerCase()} edit at Kazi Store — available in-store on Jubilee
                Road, Chattogram and delivered nationwide.
              </p>
            </div>
          )}
          {tab === "benefits" && (
            <ul className="grid max-w-4xl gap-4 sm:grid-cols-2">
              {product.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 border border-sand bg-fog p-5 text-[14.5px] text-espresso">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-champagne" aria-hidden />
                  {b}
                </li>
              ))}
            </ul>
          )}
          {tab === "ingredients" && (
            <p className="max-w-3xl text-[14.5px] leading-[1.9] text-espresso/85">{product.ingredients}</p>
          )}
          {tab === "howto" && <p className="max-w-3xl text-[16px] leading-[1.85] text-espresso/90">{product.howToUse}</p>}
          {tab === "delivery" && (
            <div className="grid max-w-4xl gap-6 sm:grid-cols-2">
              <div className="border border-sand p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-champagne">Delivery</p>
                <ul className="mt-4 space-y-2.5 text-[14px] leading-relaxed text-espresso">
                  <li>Chattogram City — ৳{STORE.deliveryCharges.chattogram.charge} ({STORE.deliveryCharges.chattogram.eta})</li>
                  <li>Dhaka City — ৳{STORE.deliveryCharges.dhaka.charge} ({STORE.deliveryCharges.dhaka.eta})</li>
                  <li>Nationwide — ৳{STORE.deliveryCharges.nationwide.charge} ({STORE.deliveryCharges.nationwide.eta})</li>
                  <li>Free over {formatBDT(STORE.freeShippingThreshold)}</li>
                </ul>
              </div>
              <div className="border border-sand p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-champagne">Returns</p>
                <p className="mt-4 text-[14px] leading-relaxed text-espresso">
                  Report damaged, defective or incorrect items within 48 hours of delivery with your order number and
                  photos. Unopened items may be eligible for return within 7 days. See our{" "}
                  <Link href="/policies/returns" className="font-semibold text-bordeaux underline underline-offset-4">
                    returns policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Mobile accordions */}
        <div className="md:hidden">
          <Accordion title="Description" defaultOpen>
            <p>{product.description}</p>
          </Accordion>
          <Accordion title="Key Benefits">
            <ul className="space-y-2">
              {product.benefits.map((b) => (
                <li key={b} className="flex gap-2.5">
                  <span className="mt-[9px] h-1 w-3 shrink-0 bg-champagne" aria-hidden /> {b}
                </li>
              ))}
            </ul>
          </Accordion>
          <Accordion title="Ingredients">
            <p>{product.ingredients}</p>
          </Accordion>
          <Accordion title="How to Use">
            <p>{product.howToUse}</p>
          </Accordion>
          <Accordion title="Delivery & Returns">
            <p>
              Chattogram ৳{STORE.deliveryCharges.chattogram.charge} · Dhaka ৳{STORE.deliveryCharges.dhaka.charge} ·
              Nationwide ৳{STORE.deliveryCharges.nationwide.charge}. Free over{" "}
              {formatBDT(STORE.freeShippingThreshold)}. Report damaged items within 48 hours for easy resolution.
            </p>
          </Accordion>
        </div>
      </section>

      {/* ——— Frequently bought together ——— */}
      {fbt.length > 0 && (
        <section className="mt-20 border-t border-sand pt-16">
          <Reveal>
            <SectionHeading align="left" eyebrow="Complete the Ritual" title="Frequently bought together" />
          </Reveal>
          <Reveal delay={150}>
            <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-center">
              <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
                {[{ p: product, locked: true as const }, ...fbt.map((p) => ({ p, locked: false as const }))].map(({ p, locked }, idx, arr) => (
                  <div key={p.id} className="flex items-center gap-4">
                    <label className={cn("group relative block w-28 shrink-0 sm:w-36", locked && "pointer-events-none")}>
                      <span className="block aspect-[4/5] overflow-hidden border border-sand bg-cream">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.images[0]} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                      </span>
                      <span className="mt-2 block truncate text-[12.5px] font-medium text-ink">{p.name}</span>
                      <span className="text-[12.5px] font-semibold text-bordeaux">{formatBDT(p.price)}</span>
                      {locked ? (
                        <span className="absolute left-2 top-2 bg-ink px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-ivory">
                          This item
                        </span>
                      ) : (
                        <input
                          type="checkbox"
                          checked={fbtChecked.includes(p.id)}
                          onChange={() =>
                            setFbtChecked((c) => (c.includes(p.id) ? c.filter((id) => id !== p.id) : [...c, p.id]))
                          }
                          aria-label={`Include ${p.name}`}
                          className="absolute left-2 top-2 h-4.5 w-4.5 accent-bordeaux"
                        />
                      )}
                    </label>
                    {idx < arr.length - 1 && <span className="font-display text-2xl text-champagne">+</span>}
                  </div>
                ))}
              </div>
              <div className="border border-sand bg-fog p-6 lg:ml-auto lg:w-72">
                <p className="text-[12px] uppercase tracking-[0.18em] text-taupe">Total for {1 + fbtChecked.length} item(s)</p>
                <p className="mt-2 font-display text-3xl font-semibold text-ink">{formatBDT(fbtTotal)}</p>
                <button
                  type="button"
                  onClick={() => {
                    addToCart(product.id, 1);
                    fbtChecked.forEach((id) => addToCart(id, 1));
                    toast("Bundle added to your bag");
                  }}
                  className={cn(btnPrimary, "mt-5 w-full")}
                >
                  Add Selected to Bag
                </button>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* ——— Related ——— */}
      <section className="mt-24">
        <Reveal>
          <SectionHeading
            align="left"
            eyebrow="You May Also Love"
            title="Related products"
            link={`/category/${product.category}`}
            linkLabel="More in this category"
          />
        </Reveal>
        <div className="mt-12">
          <ProductGrid products={related} />
        </div>
      </section>

      {/* ——— Recently viewed ——— */}
      {recentProducts.length > 0 && (
        <section className="mt-24">
          <Reveal>
            <SectionHeading align="left" eyebrow="Pick Up Where You Left Off" title="Recently viewed" />
          </Reveal>
          <div className="mt-12">
            <ProductGrid products={recentProducts} />
          </div>
        </section>
      )}

      {/* Mobile-sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-[70] flex gap-2 border-t border-sand bg-ivory/95 p-3 backdrop-blur lg:hidden">
        <button
          type="button"
          disabled={out}
          onClick={() => addToCart(product.id, qty)}
          className="flex h-12 flex-1 items-center justify-center gap-2 border border-ink text-[11.5px] font-bold uppercase tracking-[0.14em] text-ink disabled:opacity-50"
        >
          Add to Bag
        </button>
        <button
          type="button"
          disabled={out}
          onClick={buyNow}
          className="flex h-12 flex-1 items-center justify-center gap-2 bg-ink text-[11.5px] font-bold uppercase tracking-[0.14em] text-ivory disabled:opacity-50"
        >
          {out ? "Sold Out" : "Buy Now"}
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
