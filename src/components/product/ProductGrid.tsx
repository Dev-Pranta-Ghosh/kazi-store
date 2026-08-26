"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui";

export function ProductGrid({
  products,
  className = "grid-cols-2 md:grid-cols-3 xl:grid-cols-4",
  stagger = true,
}: {
  products: Product[];
  className?: string;
  stagger?: boolean;
}) {
  return (
    <div className={`grid gap-x-5 gap-y-10 ${className}`}>
      {products.map((product, i) => (
        <Reveal key={product.id} delay={stagger ? (i % 4) * 80 : 0}>
          <ProductCard product={product} />
        </Reveal>
      ))}
    </div>
  );
}

export function ProductRail({ products }: { products: Product[] }) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };
  return (
    <div className="group/rail relative">
      <div ref={track} className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2">
        {products.map((product, i) => (
          <Reveal key={product.id} delay={(i % 5) * 70} className="w-[46vw] shrink-0 snap-start sm:w-[31%] lg:w-[23%] xl:w-[18.6%]">
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
      <div className="pointer-events-none absolute -top-16 right-0 hidden gap-2 md:flex">
        <button
          type="button"
          aria-label="Scroll products left"
          onClick={() => scroll(-1)}
          className="pointer-events-auto flex h-11 w-11 items-center justify-center border border-sand text-ink transition-all hover:border-ink hover:bg-ink hover:text-ivory"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Scroll products right"
          onClick={() => scroll(1)}
          className="pointer-events-auto flex h-11 w-11 items-center justify-center border border-sand text-ink transition-all hover:border-ink hover:bg-ink hover:text-ivory"
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
