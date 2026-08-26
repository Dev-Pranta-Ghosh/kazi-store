"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Heart, Menu, Phone, Search, ShoppingBag, User, X } from "lucide-react";
import { CATEGORIES, searchProducts } from "@/data/products";
import { POPULAR_SEARCHES } from "@/data/content";
import { cn, formatBDT, STORE } from "@/lib/utils";
import { useStore } from "@/components/providers/StoreProvider";

const ANNOUNCEMENTS = [
  "Premium beauty, delivered to your door",
  "Free delivery on orders over ৳2,500",
  "Nationwide delivery across Bangladesh",
];

const NAV = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "/shop" },
  { label: "Categories", href: "/shop", mega: true },
  { label: "Korean Beauty", href: "/category/korean-beauty" },
  { label: "Brands", href: "/shop#brands" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [announce, setAnnounce] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { cartCount, wishlistCount, hydrated } = useStore();
  const pathname = usePathname();

  useEffect(() => {
    const t = setInterval(() => setAnnounce((a) => (a + 1) % ANNOUNCEMENTS.length), 4500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setSearchOpen(false);
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <header className="sticky top-0 z-[90]">
      {/* Announcement bar */}
      <div className="bg-ink text-ivory">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-2 sm:px-8">
          <a
            href={STORE.phoneHref}
            className="hidden items-center gap-2 text-[11px] font-medium tracking-[0.14em] text-ivory/80 transition-colors hover:text-champagne-light sm:flex"
          >
            <Phone className="h-3 w-3" aria-hidden /> {STORE.phone}
          </a>
          <p aria-live="polite" className="relative h-4 flex-1 overflow-hidden text-center sm:flex-none">
            {ANNOUNCEMENTS.map((msg, i) => (
              <span
                key={msg}
                className={cn(
                  "absolute inset-0 text-[10.5px] font-semibold uppercase tracking-[0.24em] transition-all duration-700",
                  i === announce ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
                )}
              >
                {msg}
              </span>
            ))}
          </p>
          <div className="hidden items-center gap-4 text-[11px] font-medium tracking-[0.14em] text-ivory/80 sm:flex">
            <Link href="/account" className="transition-colors hover:text-champagne-light">
              Track Order
            </Link>
            <Link href="/faq" className="transition-colors hover:text-champagne-light">
              Help
            </Link>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-sand bg-ivory/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-4 py-4 sm:gap-8 sm:px-8 lg:py-5">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center text-ink lg:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>

          {/* Logo */}
          <Link href="/" className="group flex flex-col leading-none" aria-label="Kazi Store home">
            <span className="font-display text-[24px] font-semibold tracking-tight text-ink sm:text-[27px]">
              Kazi<span className="text-bordeaux"> Store</span>
            </span>
            <span className="mt-1 text-[10px] font-medium tracking-[0.3em] text-taupe">
              <span className="font-bangla tracking-normal">কাজী স্টোর</span> · Chattogram
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="ml-auto hidden lg:block" aria-label="Primary">
            <ul className="flex items-center gap-7">
              {NAV.map((item) =>
                item.mega ? (
                  <li key={item.label} className="group relative">
                    <Link
                      href={item.href}
                      className="flex items-center gap-1.5 py-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-espresso transition-colors hover:text-bordeaux"
                    >
                      {item.label}
                      <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" aria-hidden />
                    </Link>
                    {/* Mega menu */}
                    <div className="invisible absolute left-1/2 top-full z-50 w-[720px] -translate-x-1/2 pt-4 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
                      <div className="grid grid-cols-4 gap-2 border border-sand bg-ivory p-6 shadow-soft">
                        {CATEGORIES.map((cat) => (
                          <Link
                            key={cat.slug}
                            href={`/category/${cat.slug}`}
                            className="group/cat flex flex-col gap-2 p-2 transition-colors hover:bg-cream"
                          >
                            <span className="relative block aspect-square overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={cat.image}
                                alt=""
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover/cat:scale-105"
                              />
                            </span>
                            <span className="text-[12.5px] font-semibold tracking-wide text-ink">{cat.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </li>
                ) : (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={cn(
                        "py-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] transition-colors hover:text-bordeaux",
                        pathname === item.href ? "text-bordeaux" : "text-espresso"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>

          {/* Icons */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2 lg:ml-0">
            <button
              type="button"
              onClick={() => setSearchOpen((s) => !s)}
              aria-label="Search"
              aria-expanded={searchOpen}
              className="flex h-10 w-10 items-center justify-center text-ink transition-colors hover:text-bordeaux"
            >
              {searchOpen ? <X className="h-[19px] w-[19px]" aria-hidden /> : <Search className="h-[19px] w-[19px]" aria-hidden />}
            </button>
            <Link
              href="/account"
              aria-label="Account"
              className="hidden h-10 w-10 items-center justify-center text-ink transition-colors hover:text-bordeaux sm:flex"
            >
              <User className="h-[19px] w-[19px]" aria-hidden />
            </Link>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative flex h-10 w-10 items-center justify-center text-ink transition-colors hover:text-bordeaux"
            >
              <Heart className="h-[19px] w-[19px]" aria-hidden />
              {hydrated && wishlistCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-champagne px-1 text-[9.5px] font-bold text-ink">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              aria-label="Shopping bag"
              className="relative flex h-10 w-10 items-center justify-center text-ink transition-colors hover:text-bordeaux"
            >
              <ShoppingBag className="h-[19px] w-[19px]" aria-hidden />
              {hydrated && cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-bordeaux px-1 text-[9.5px] font-bold text-ivory">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search overlay row */}
        <div
          className={cn(
            "grid overflow-hidden border-sand transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
            searchOpen ? "grid-rows-[1fr] border-t" : "grid-rows-[0fr]"
          )}
        >
          <div className="overflow-hidden">
            <SearchPanel onDone={() => setSearchOpen(false)} />
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[100] lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
            className="animate-fade-in absolute inset-0 bg-ink/50 backdrop-blur-[2px]"
          />
          <div className="absolute left-0 top-0 flex h-full w-[86%] max-w-sm animate-fade-in flex-col overflow-y-auto bg-ivory shadow-soft">
            <div className="flex items-center justify-between border-b border-sand px-6 py-5">
              <span className="font-display text-xl font-semibold text-ink">
                Kazi<span className="text-bordeaux"> Store</span>
              </span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center text-ink"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <nav className="flex flex-col px-6 py-6" aria-label="Mobile">
              {NAV.filter((n) => !n.mega).map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="border-b border-sand/70 py-4 font-display text-[19px] font-medium text-ink transition-colors hover:text-bordeaux"
                >
                  {item.label}
                </Link>
              ))}
              <p className="pb-2 pt-7 text-[10.5px] font-bold uppercase tracking-[0.28em] text-champagne">Categories</p>
              <div className="grid grid-cols-2 gap-2 pb-6">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className="border border-sand bg-fog px-3 py-3 text-[13px] font-medium text-espresso transition-colors hover:border-bordeaux hover:text-bordeaux"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
              <div className="mt-auto space-y-3 border-t border-sand pt-6 text-[13.5px] text-espresso">
                <p className="font-bangla text-[15px] text-taupe">কাজী স্টোর</p>
                <p>{STORE.address}</p>
                <a href={STORE.phoneHref} className="flex items-center gap-2 font-semibold text-bordeaux">
                  <Phone className="h-4 w-4" aria-hidden /> {STORE.phone}
                </a>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

function SearchPanel({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const { pushRecentSearch, recentSearches } = useStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const results = query.trim().length > 1 ? searchProducts(query).slice(0, 5) : [];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const go = (q: string) => {
    if (!q.trim()) return;
    pushRecentSearch(q);
    onDone();
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go(query);
        }}
        className="relative"
        role="search"
      >
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-taupe" aria-hidden />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="search"
          placeholder="Search products, brands, categories…"
          aria-label="Search products"
          className="w-full border border-sand bg-white py-4 pl-12 pr-32 text-[15px] text-ink outline-none transition-colors placeholder:text-stone focus:border-ink"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-ink px-6 py-2.5 text-[11.5px] font-bold uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-bordeaux"
        >
          Search
        </button>
      </form>

      {/* Instant suggestions */}
      {results.length > 0 && (
        <ul className="mt-3 divide-y divide-sand border border-sand bg-white" aria-label="Search suggestions">
          {results.map((pr) => (
            <li key={pr.id}>
              <button
                type="button"
                onClick={() => {
                  pushRecentSearch(pr.name);
                  onDone();
                  router.push(`/product/${pr.slug}`);
                }}
                className="flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-cream"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pr.images[0]} alt="" className="h-12 w-12 shrink-0 object-cover" loading="lazy" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-medium text-ink">{pr.name}</span>
                  <span className="text-[11.5px] uppercase tracking-[0.14em] text-stone">{pr.brand}</span>
                </span>
                <span className="text-[13.5px] font-semibold text-bordeaux">{formatBDT(pr.price)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {query.trim().length <= 1 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {recentSearches.length > 0 && (
            <>
              <span className="mr-1 text-[11px] font-bold uppercase tracking-[0.2em] text-taupe">Recent:</span>
              {recentSearches.slice(0, 4).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => go(q)}
                  className="border border-sand bg-white px-3 py-1.5 text-[12px] text-espresso transition-colors hover:border-ink"
                >
                  {q}
                </button>
              ))}
              <span className="mx-2 h-4 w-px bg-sand" aria-hidden />
            </>
          )}
          <span className="mr-1 text-[11px] font-bold uppercase tracking-[0.2em] text-taupe">Popular:</span>
          {POPULAR_SEARCHES.slice(0, 6).map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => go(q)}
              className="border border-sand bg-white px-3 py-1.5 text-[12px] text-espresso transition-colors hover:border-ink"
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
