"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Heart, LayoutGrid, Rows3, SearchX, SlidersHorizontal, X } from "lucide-react";
import { BRANDS, CATEGORIES, PRODUCTS, sortProducts, type SortKey } from "@/data/products";
import { CONCERNS } from "@/data/products";
import type { Product } from "@/lib/types";
import { cn, discountPercent, formatBDT } from "@/lib/utils";
import { useStore } from "@/components/providers/StoreProvider";
import { ProductCard } from "@/components/product/ProductCard";
import { Price, Rating, Reveal, btnPrimary } from "@/components/ui";

const MAX_PRICE = 7000;
const PAGE_SIZE = 12;

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export interface ShopFilters {
  categories: string[];
  brands: string[];
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  concerns: string[];
}

export function ShopView({
  fixedCategory,
  initialBrand,
  initialConcern,
  initialSort,
  initialQuery,
  heading = "Shop All",
}: {
  fixedCategory?: string;
  initialBrand?: string;
  initialConcern?: string;
  initialSort?: SortKey;
  initialQuery?: string;
  heading?: string;
}) {
  const [filters, setFilters] = useState<ShopFilters>({
    categories: fixedCategory ? [fixedCategory] : [],
    brands: initialBrand ? [initialBrand] : [],
    maxPrice: MAX_PRICE,
    minRating: 0,
    inStockOnly: false,
    concerns: initialConcern ? [initialConcern] : [],
  });
  const [sort, setSort] = useState<SortKey>(initialSort ?? "newest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    if (initialQuery) {
      const q = initialQuery.toLowerCase();
      list = list.filter((p) =>
        [p.name, p.brand, p.subcategory, p.category.replace(/-/g, " "), ...p.tags, ...p.concerns]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }
    if (filters.categories.length) list = list.filter((p) => filters.categories.includes(p.category));
    if (filters.brands.length) list = list.filter((p) => filters.brands.includes(p.brand));
    list = list.filter((p) => p.price <= filters.maxPrice);
    if (filters.minRating > 0) list = list.filter((p) => p.rating >= filters.minRating);
    if (filters.inStockOnly) list = list.filter((p) => p.stock > 0);
    if (filters.concerns.length) list = list.filter((p) => p.concerns.some((c) => filters.concerns.includes(c)));
    return sortProducts(list, sort);
  }, [filters, sort, initialQuery]);

  const shown = filtered.slice(0, visible);
  const activeCount =
    filters.brands.length +
    filters.concerns.length +
    (filters.categories.length && !fixedCategory ? filters.categories.length : 0) +
    (filters.maxPrice < MAX_PRICE ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0);

  const resetFilters = () =>
    setFilters({
      categories: fixedCategory ? [fixedCategory] : [],
      brands: [],
      maxPrice: MAX_PRICE,
      minRating: 0,
      inStockOnly: false,
      concerns: [],
    });

  const toggle = (key: "categories" | "brands" | "concerns", value: string) => {
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(value) ? (f[key] as string[]).filter((v) => v !== value) : [...f[key], value],
    }));
    setVisible(PAGE_SIZE);
  };

  const filterPanel = (
    <FilterPanel
      filters={filters}
      setFilters={(next) => {
        setFilters(next);
        setVisible(PAGE_SIZE);
      }}
      toggle={toggle}
      fixedCategory={fixedCategory}
      resetFilters={resetFilters}
      activeCount={activeCount}
    />
  );

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-24 sm:px-8">
      {/* Toolbar */}
      <div className="sticky top-[64px] z-40 -mx-4 mb-8 border-b border-sand bg-ivory/95 px-4 py-3.5 backdrop-blur-md sm:-mx-8 sm:px-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFilters(true)}
              className="flex h-10 items-center gap-2 border border-sand px-4 text-[11.5px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink lg:hidden"
              aria-label="Open filters"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
              Filters
              {activeCount > 0 && <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-bordeaux px-1 text-[9.5px] text-ivory">{activeCount}</span>}
            </button>
            <p className="text-[13px] text-taupe">
              <span className="font-semibold text-ink">{filtered.length}</span> {filtered.length === 1 ? "product" : "products"}
              {heading !== "Shop All" && <span className="hidden sm:inline"> in {heading}</span>}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setSortOpen((s) => !s)}
                onBlur={() => setTimeout(() => setSortOpen(false), 150)}
                className="flex h-10 items-center gap-2 border border-sand bg-white px-4 text-[11.5px] font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink"
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
              >
                <span className="hidden sm:inline">Sort:</span>
                {SORT_OPTIONS.find((o) => o.value === sort)?.label}
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", sortOpen && "rotate-180")} aria-hidden />
              </button>
              {sortOpen && (
                <ul
                  role="listbox"
                  aria-label="Sort products"
                  className="absolute right-0 top-full z-50 mt-1.5 w-56 border border-sand bg-white py-1.5 shadow-card"
                >
                  {SORT_OPTIONS.map((o) => (
                    <li key={o.value}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={sort === o.value}
                        onMouseDown={() => {
                          setSort(o.value);
                          setVisible(PAGE_SIZE);
                          setSortOpen(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2.5 text-left text-[13.5px] transition-colors hover:bg-cream",
                          sort === o.value ? "font-semibold text-bordeaux" : "text-espresso"
                        )}
                      >
                        {o.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="hidden border border-sand sm:flex" role="group" aria-label="Change layout">
              <button
                type="button"
                onClick={() => setView("grid")}
                aria-label="Grid view"
                aria-pressed={view === "grid"}
                className={cn("flex h-10 w-10 items-center justify-center transition-colors", view === "grid" ? "bg-ink text-ivory" : "text-espresso hover:bg-cream")}
              >
                <LayoutGrid className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                aria-label="List view"
                aria-pressed={view === "list"}
                className={cn("flex h-10 w-10 items-center justify-center transition-colors", view === "list" ? "bg-ink text-ivory" : "text-espresso hover:bg-cream")}
              >
                <Rows3 className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-32 max-h-[calc(100vh-10rem)] overflow-y-auto pr-1">{filterPanel}</div>
        </aside>

        {/* Results */}
        <div>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-20 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-cream text-bordeaux">
                <SearchX className="h-8 w-8" aria-hidden />
              </div>
              <h3 className="font-display text-2xl font-medium text-ink">Nothing matches those filters</h3>
              <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-taupe">
                Try broadening your search — remove a filter or two and the shelves will fill right back up.
              </p>
              <button type="button" onClick={resetFilters} className={cn(btnPrimary, "mt-8")}>
                Clear All Filters
              </button>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
              {shown.map((product, i) => (
                <Reveal key={product.id} delay={(i % 3) * 70}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          ) : (
            <ul className="space-y-5">
              {shown.map((product) => (
                <li key={product.id}>
                  <ListRow product={product} />
                </li>
              ))}
            </ul>
          )}

          {filtered.length > 0 && visible < filtered.length && (
            <div className="mt-14 flex flex-col items-center gap-4">
              <p className="text-[12.5px] tracking-wide text-taupe">
                Showing {shown.length} of {filtered.length}
              </p>
              <div className="h-[3px] w-48 overflow-hidden rounded-full bg-sand">
                <div
                  className="h-full bg-bordeaux transition-all duration-500"
                  style={{ width: `${(shown.length / filtered.length) * 100}%` }}
                />
              </div>
              <button type="button" onClick={() => setVisible((v) => v + PAGE_SIZE)} className={cn(btnPrimary, "mt-2")}>
                Load More Products
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFilters && (
        <div role="dialog" aria-modal="true" aria-label="Filters" className="fixed inset-0 z-[100] lg:hidden">
          <button type="button" aria-label="Close filters" onClick={() => setMobileFilters(false)} className="absolute inset-0 bg-ink/50" />
          <div className="absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col bg-ivory shadow-soft">
            <div className="flex items-center justify-between border-b border-sand px-5 py-4">
              <p className="font-display text-lg font-medium">Filters {activeCount > 0 && <span className="text-bordeaux">({activeCount})</span>}</p>
              <button type="button" onClick={() => setMobileFilters(false)} aria-label="Close filters" className="flex h-9 w-9 items-center justify-center text-ink">
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5">{filterPanel}</div>
            <div className="border-t border-sand p-4">
              <button type="button" onClick={() => setMobileFilters(false)} className={cn(btnPrimary, "w-full")}>
                Show {filtered.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ————— Filter sidebar ————— */
function FilterPanel({
  filters,
  setFilters,
  toggle,
  fixedCategory,
  resetFilters,
  activeCount,
}: {
  filters: ShopFilters;
  setFilters: (f: ShopFilters) => void;
  toggle: (key: "categories" | "brands" | "concerns", value: string) => void;
  fixedCategory?: string;
  resetFilters: () => void;
  activeCount: number;
}) {
  return (
    <div className="space-y-8 py-6 lg:py-0">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-champagne">Refine</p>
        {activeCount > 0 && (
          <button type="button" onClick={resetFilters} className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-bordeaux hover:underline underline-offset-4">
            Clear all ({activeCount})
          </button>
        )}
      </div>

      {!fixedCategory && (
        <FilterGroup title="Category">
          {CATEGORIES.map((cat) => (
            <CheckRow
              key={cat.slug}
              label={cat.name}
              checked={filters.categories.includes(cat.slug)}
              onChange={() => toggle("categories", cat.slug)}
              count={PRODUCTS.filter((p) => p.category === cat.slug).length}
            />
          ))}
        </FilterGroup>
      )}

      <FilterGroup title="Brand">
        <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
          {BRANDS.map((brand) => (
            <CheckRow
              key={brand as string}
              label={brand as string}
              checked={filters.brands.includes(brand as string)}
              onChange={() => toggle("brands", brand as string)}
              count={PRODUCTS.filter((p) => p.brand === brand).length}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title={`Max price — ${formatBDT(filters.maxPrice)}`}>
        <input
          type="range"
          min={500}
          max={MAX_PRICE}
          step={100}
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
          className="ks-range w-full"
          aria-label="Maximum price"
        />
        <div className="mt-1 flex justify-between text-[11px] text-stone">
          <span>{formatBDT(500)}</span>
          <span>{formatBDT(MAX_PRICE)}+</span>
        </div>
      </FilterGroup>

      <FilterGroup title="Rating">
        {[
          { v: 0, label: "All ratings" },
          { v: 4.5, label: "4.5 & up" },
          { v: 4, label: "4.0 & up" },
          { v: 3.5, label: "3.5 & up" },
        ].map((opt) => (
          <label key={opt.v} className="flex cursor-pointer items-center gap-3 py-1.5">
            <input
              type="radio"
              name="min-rating"
              checked={filters.minRating === opt.v}
              onChange={() => setFilters({ ...filters, minRating: opt.v })}
              className="h-4 w-4 accent-bordeaux"
            />
            <span className="text-[13.5px] text-espresso">{opt.label}</span>
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title="Availability">
        <CheckRow
          label="In stock only"
          checked={filters.inStockOnly}
          onChange={() => setFilters({ ...filters, inStockOnly: !filters.inStockOnly })}
        />
      </FilterGroup>

      <FilterGroup title="Beauty concern">
        {CONCERNS.map((c) => (
          <CheckRow key={c} label={c} checked={filters.concerns.includes(c)} onChange={() => toggle("concerns", c)} />
        ))}
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-sand pt-5">
      <legend className="sr-only">{title}</legend>
      <p className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-espresso">{title}</p>
      <div className="space-y-1">{children}</div>
    </fieldset>
  );
}

function CheckRow({
  label,
  checked,
  onChange,
  count,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  count?: number;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-1.5">
      <span
        className={cn(
          "flex h-[18px] w-[18px] items-center justify-center border transition-colors",
          checked ? "border-bordeaux bg-bordeaux" : "border-stone bg-white"
        )}
        aria-hidden
      >
        {checked && (
          <svg viewBox="0 0 10 8" className="h-2.5 w-2.5 fill-none stroke-ivory" strokeWidth="1.6">
            <path d="M1 4l2.5 2.5L9 1" />
          </svg>
        )}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span className={cn("flex-1 text-[13.5px]", checked ? "font-semibold text-ink" : "text-espresso")}>{label}</span>
      {typeof count === "number" && <span className="text-[11.5px] text-stone">{count}</span>}
    </label>
  );
}

/* ————— List row ————— */
function ListRow({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, inWishlist } = useStore();
  const off = discountPercent(product.price, product.originalPrice);
  return (
    <article className="group flex gap-5 border border-sand bg-white p-4 transition-all hover:shadow-card sm:gap-7 sm:p-5">
      <Link href={`/product/${product.slug}`} className="relative block w-28 shrink-0 overflow-hidden bg-cream sm:w-40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.images[0]} alt={product.name} loading="lazy" className="aspect-[4/5] h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {off > 0 && (
          <span className="absolute left-2 top-2 bg-bordeaux px-2 py-0.5 text-[9.5px] font-bold text-ivory">−{off}%</span>
        )}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-champagne">{product.brand}</p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="mt-1 font-display text-lg leading-snug font-medium text-ink transition-colors hover:text-bordeaux sm:text-xl">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2">
          <Rating value={product.rating} count={product.reviewCount} size="xs" />
        </div>
        <p className="mt-3 hidden line-clamp-2 max-w-lg text-[13.5px] leading-relaxed text-taupe sm:block">{product.description}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
          <Price price={product.price} originalPrice={product.originalPrice} />
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-pressed={inWishlist(product.id)}
              aria-label="Toggle wishlist"
              className={cn(
                "flex h-10 w-10 items-center justify-center border transition-colors",
                inWishlist(product.id) ? "border-bordeaux text-bordeaux" : "border-sand text-espresso hover:border-bordeaux hover:text-bordeaux"
              )}
            >
              <Heart className="h-4 w-4" fill={inWishlist(product.id) ? "currentColor" : "none"} aria-hidden />
            </button>
            <button
              type="button"
              disabled={product.stock <= 0}
              onClick={() => addToCart(product.id)}
              className="flex h-10 items-center gap-2 bg-ink px-5 text-[11px] font-bold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-bordeaux disabled:opacity-50"
            >
              {product.stock <= 0 ? "Sold Out" : "Add to Bag"}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
