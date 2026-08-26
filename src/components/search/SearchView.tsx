"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SearchX, X } from "lucide-react";
import { searchProducts } from "@/data/products";
import { POPULAR_SEARCHES } from "@/data/content";
import { useStore } from "@/components/providers/StoreProvider";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Reveal, inputCls } from "@/components/ui";

export function SearchView({ initialQuery }: { initialQuery: string }) {
  const { recentSearches, pushRecentSearch, clearRecentSearches, hydrated } = useStore();
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    if (initialQuery.trim()) pushRecentSearch(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const results = useMemo(() => searchProducts(query), [query]);

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-24 sm:px-8">
      {/* Search hero */}
      <div className="border-b border-sand py-12 lg:py-16">
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-champagne">Find Your Favorite</p>
          <h1 className="mt-3 font-display text-4xl font-medium text-ink sm:text-5xl">Search the Shelves</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (query.trim()) pushRecentSearch(query);
            }}
            role="search"
            className="relative mt-8 max-w-2xl"
          >
            <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-taupe" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try “sunscreen”, “COSRX” or “oud”…"
              aria-label="Search products"
              className={`${inputCls} py-4.5 pl-14 pr-12 text-[16px]`}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-taupe transition-colors hover:text-bordeaux"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            )}
          </form>
        </Reveal>
      </div>

      {query.trim() ? (
        <>
          <div className="py-8">
            <p className="text-[14px] text-taupe">
              {results.length > 0 ? (
                <>
                  <span className="font-semibold text-ink">{results.length}</span>{" "}
                  {results.length === 1 ? "result" : "results"} for{" "}
                  <span className="font-medium text-bordeaux">“{query.trim()}”</span>
                </>
              ) : (
                <>
                  No results for <span className="font-medium text-bordeaux">“{query.trim()}”</span>
                </>
              )}
            </p>
          </div>
          {results.length > 0 ? (
            <ProductGrid products={results} />
          ) : (
            <div className="flex flex-col items-center py-16 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-cream text-bordeaux">
                <SearchX className="h-8 w-8" aria-hidden />
              </div>
              <h2 className="font-display text-2xl font-medium text-ink">We couldn't find that</h2>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-taupe">
                Check the spelling, try a broader term like “serum” or “lipstick”, or explore one of the popular
                searches below.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {POPULAR_SEARCHES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuery(q)}
                    className="border border-sand bg-white px-4 py-2 text-[13px] text-espresso transition-colors hover:border-ink"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="grid gap-12 py-12 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-espresso">Popular searches</p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {POPULAR_SEARCHES.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuery(q)}
                  className="border border-sand bg-white px-5 py-2.5 text-[14px] text-espresso transition-all hover:border-bordeaux hover:text-bordeaux"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
          {hydrated && recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-espresso">Your recent searches</p>
                <button
                  type="button"
                  onClick={clearRecentSearches}
                  className="text-[12px] font-semibold uppercase tracking-[0.12em] text-bordeaux hover:underline underline-offset-4"
                >
                  Clear
                </button>
              </div>
              <ul className="mt-5 divide-y divide-sand border-y border-sand">
                {recentSearches.map((q) => (
                  <li key={q}>
                    <button
                      type="button"
                      onClick={() => setQuery(q)}
                      className="flex w-full items-center gap-3 py-3.5 text-left text-[14.5px] text-espresso transition-colors hover:text-bordeaux"
                    >
                      <Search className="h-3.5 w-3.5 text-stone" aria-hidden />
                      {q}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
