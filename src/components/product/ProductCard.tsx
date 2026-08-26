"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Heart, ShoppingBag, X } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn, discountPercent } from "@/lib/utils";
import { useStore } from "@/components/providers/StoreProvider";
import { Price, QtySelector, Rating, btnPrimary } from "@/components/ui";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, inWishlist } = useStore();
  const [quickView, setQuickView] = useState(false);
  const wish = inWishlist(product.id);
  const off = discountPercent(product.price, product.originalPrice);
  const out = product.stock <= 0;

  return (
    <>
      <article className="group relative flex flex-col">
        <div className="relative overflow-hidden bg-cream">
          <Link
            href={`/product/${product.slug}`}
            aria-label={`View ${product.name}`}
            className="block aspect-[4/5]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className={cn(
                "h-full w-full object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]",
                product.images[1] ? "group-hover:opacity-0" : ""
              )}
            />
            {product.images[1] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.images[1]}
                alt=""
                loading="lazy"
                decoding="async"
                aria-hidden
                className="absolute inset-0 h-full w-full scale-[1.06] object-cover opacity-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02] group-hover:opacity-100"
              />
            )}
          </Link>

          {/* Badges */}
          <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {off > 0 && (
              <span className="bg-bordeaux px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ivory">
                −{off}%
              </span>
            )}
            {product.isNew && (
              <span className="bg-champagne px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ivory">
                New
              </span>
            )}
            {out && (
              <span className="bg-ink/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ivory">
                Sold out
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            aria-label={wish ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            aria-pressed={wish}
            className={cn(
              "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/90 shadow-card backdrop-blur transition-all duration-300 hover:scale-110",
              wish ? "text-bordeaux" : "text-ink hover:text-bordeaux"
            )}
          >
            <Heart className="h-4 w-4" fill={wish ? "currentColor" : "none"} aria-hidden />
          </button>

          {/* Hover actions */}
          <div className="absolute inset-x-0 bottom-0 flex translate-y-full transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0">
            <button
              type="button"
              onClick={() => setQuickView(true)}
              className="flex h-11 flex-1 items-center justify-center gap-2 bg-ivory/95 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink backdrop-blur transition-colors hover:bg-ivory"
              aria-label={`Quick view ${product.name}`}
            >
              <Eye className="h-3.5 w-3.5" aria-hidden /> Quick View
            </button>
            <button
              type="button"
              disabled={out}
              onClick={() => {
                addToCart(product.id);
              }}
              className="flex h-11 flex-1 items-center justify-center gap-2 bg-ink text-[11px] font-semibold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-bordeaux disabled:cursor-not-allowed disabled:opacity-60"
              aria-label={`Add ${product.name} to bag`}
            >
              <ShoppingBag className="h-3.5 w-3.5" aria-hidden />
              {out ? "Sold Out" : "Add to Bag"}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 pt-4">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-champagne">{product.brand}</p>
          <Link href={`/product/${product.slug}`} className="group/name">
            <h3 className="font-display text-[16.5px] leading-snug font-medium text-ink transition-colors group-hover/name:text-bordeaux">
              {product.name}
            </h3>
          </Link>
          <Rating value={product.rating} count={product.reviewCount} size="xs" />
          <Price price={product.price} originalPrice={product.originalPrice} size="sm" className="mt-0.5" />
        </div>
      </article>

      {quickView && <QuickViewModal product={product} onClose={() => setQuickView(false)} />}
    </>
  );
}

function QuickViewModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addToCart, toggleWishlist, inWishlist } = useStore();
  const [qty, setQty] = useState(1);
  const wish = inWishlist(product.id);
  const off = discountPercent(product.price, product.originalPrice);
  const out = product.stock <= 0;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view: ${product.name}`}
      className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close quick view"
        className="animate-fade-in absolute inset-0 bg-ink/50 backdrop-blur-[3px]"
      />
      <div className="animate-scale-in relative z-10 grid max-h-[92vh] w-full max-w-3xl grid-cols-1 overflow-y-auto bg-ivory shadow-soft sm:grid-cols-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-ivory text-ink shadow-card transition-transform hover:scale-110"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>

        <div className="relative aspect-[4/5] bg-cream sm:aspect-auto sm:min-h-[480px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.images[0]} alt={product.name} className="absolute inset-0 h-full w-full object-cover" />
          {off > 0 && (
            <span className="absolute left-4 top-4 bg-bordeaux px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ivory">
              −{off}%
            </span>
          )}
        </div>

        <div className="flex flex-col p-6 sm:p-8">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-champagne">{product.brand}</p>
          <h2 className="mt-2 font-display text-2xl leading-tight font-medium text-ink">{product.name}</h2>
          <div className="mt-3">
            <Rating value={product.rating} count={product.reviewCount} />
          </div>
          <Price price={product.price} originalPrice={product.originalPrice} size="lg" className="mt-4" />
          <p className="mt-4 line-clamp-3 text-[14.5px] leading-relaxed text-espresso/90">{product.description}</p>

          <div className="mt-auto pt-6">
            <div className="flex flex-wrap items-center gap-3">
              <QtySelector qty={qty} onChange={setQty} />
              <button
                type="button"
                disabled={out}
                onClick={() => {
                  addToCart(product.id, qty);
                  onClose();
                }}
                className={cn(btnPrimary, "h-12 flex-1 px-4 py-0")}
              >
                <ShoppingBag className="h-4 w-4" aria-hidden />
                {out ? "Sold Out" : "Add to Bag"}
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label={wish ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={wish}
                className={cn(
                  "flex h-12 w-12 items-center justify-center border transition-colors",
                  wish ? "border-bordeaux bg-bordeaux text-ivory" : "border-sand text-ink hover:border-bordeaux hover:text-bordeaux"
                )}
              >
                <Heart className="h-4 w-4" fill={wish ? "currentColor" : "none"} aria-hidden />
              </button>
            </div>
            <Link
              href={`/product/${product.slug}`}
              onClick={onClose}
              className="mt-5 inline-block text-[12px] font-semibold uppercase tracking-[0.16em] text-ink underline underline-offset-4 transition-colors hover:text-bordeaux"
            >
              View Full Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
