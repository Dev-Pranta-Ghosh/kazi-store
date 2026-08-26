"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { useStore } from "@/components/providers/StoreProvider";
import { EmptyState, Price, Rating, Reveal, SectionHeading, btnPrimary } from "@/components/ui";
import { cn } from "@/lib/utils";

export function WishlistView() {
  const { wishlist, hydrated, removeFromWishlist, addToCart, toast } = useStore();

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] bg-cream" />
              <div className="mt-4 h-3 w-2/3 bg-cream" />
              <div className="mt-2 h-3 w-1/3 bg-cream" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const items = wishlist
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-24 sm:px-8">
      <div className="border-b border-sand py-12 lg:py-16">
        <Reveal>
          <SectionHeading
            align="left"
            eyebrow="Saved for Later"
            title={items.length ? `Your Wishlist (${items.length})` : "Your Wishlist"}
          />
        </Reveal>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<Heart className="h-8 w-8" aria-hidden />}
          title="Your wishlist is empty"
          message="Browse the shelves and tap the heart on anything that catches your eye — we'll keep it safe here."
          actionLabel="Discover Products"
          actionHref="/shop"
        />
      ) : (
        <>
          <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((product, i) => (
              <Reveal key={product.id} delay={(i % 4) * 80}>
                <li className="group flex gap-4 border border-sand bg-white p-4 transition-all hover:shadow-card lg:flex-col">
                  <Link href={`/product/${product.slug}`} className="relative block w-24 shrink-0 overflow-hidden bg-cream lg:w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      loading="lazy"
                      className="aspect-[4/5] h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-champagne">{product.brand}</p>
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="mt-1 line-clamp-2 font-display text-[16px] leading-snug font-medium text-ink transition-colors hover:text-bordeaux">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="mt-2">
                      <Rating value={product.rating} size="xs" showCount={false} />
                    </div>
                    <div className="mt-2">
                      <Price price={product.price} originalPrice={product.originalPrice} size="sm" />
                    </div>
                    <div className="mt-auto flex gap-2 pt-4">
                      <button
                        type="button"
                        disabled={product.stock <= 0}
                        onClick={() => {
                          addToCart(product.id);
                          removeFromWishlist(product.id);
                          toast("Moved to your bag");
                        }}
                        className={cn(btnPrimary, "h-10 flex-1 px-3 py-0 text-[10.5px]")}
                      >
                        <ShoppingBag className="h-3.5 w-3.5" aria-hidden />
                        {product.stock <= 0 ? "Sold Out" : "Move to Bag"}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(product.id)}
                        aria-label={`Remove ${product.name} from wishlist`}
                        className="flex h-10 w-10 items-center justify-center border border-sand text-taupe transition-colors hover:border-danger hover:text-danger"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
