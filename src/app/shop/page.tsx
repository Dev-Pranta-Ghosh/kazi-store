import type { Metadata } from "next";
import { ShopView } from "@/components/shop/ShopView";
import type { SortKey } from "@/data/products";
import { Reveal } from "@/components/ui";

export const metadata: Metadata = {
  title: "Shop All Products",
  description:
    "Browse the full Kazi Store collection — skincare, makeup, hair care, fragrance, Korean beauty and more, delivered across Bangladesh.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const get = (k: string) => {
    const v = sp[k];
    return typeof v === "string" ? v : undefined;
  };
  const sort = get("sort");
  const validSorts: SortKey[] = ["newest", "popular", "rating", "price-asc", "price-desc"];

  return (
    <>
      <section className="border-b border-sand bg-cream">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-8 lg:py-16">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-champagne">The Full Collection</p>
            <h1 className="mt-3 font-display text-4xl font-medium text-ink sm:text-5xl">Shop All Beauty</h1>
            <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-espresso/85">
              Every shelf, one place. Filter by category, brand, price, rating or concern and find your next
              everyday essential.
            </p>
          </Reveal>
        </div>
      </section>
      <div className="pt-10">
        <ShopView
          initialBrand={get("brand")}
          initialConcern={get("concern")}
          initialSort={validSorts.includes(sort as SortKey) ? (sort as SortKey) : undefined}
          initialQuery={get("q")}
        />
      </div>
    </>
  );
}
