"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { FAQS } from "@/data/content";
import { cn } from "@/lib/utils";
import { Accordion, Breadcrumbs, Reveal, inputCls } from "@/components/ui";

export function FaqView() {
  const [active, setActive] = useState(FAQS[0].slug);
  const [query, setQuery] = useState("");

  const category = FAQS.find((c) => c.slug === active) ?? FAQS[0];

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return FAQS.flatMap((c) =>
      c.items.filter((i) => (i.q + " " + i.a).toLowerCase().includes(q)).map((i) => ({ ...i, cat: c.title }))
    );
  }, [query]);

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-24 sm:px-8">
      <div className="border-b border-sand py-10 lg:py-14">
        <Reveal>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />
          <h1 className="mt-5 font-display text-4xl font-medium text-ink sm:text-5xl">How Can We Help?</h1>
          <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-espresso/85">
            Straight answers to the questions we hear most — from orders and delivery to payments and returns.
          </p>
          <div className="relative mt-8 max-w-lg">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-taupe" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the FAQs…"
              aria-label="Search FAQs"
              className={cn(inputCls, "pl-12")}
            />
          </div>
        </Reveal>
      </div>

      {results ? (
        <div className="py-12">
          <p className="mb-6 text-[14px] text-taupe">
            <span className="font-semibold text-ink">{results.length}</span> answer
            {results.length !== 1 ? "s" : ""} for “{query.trim()}”
          </p>
          {results.length === 0 ? (
            <div className="border border-sand bg-fog p-10 text-center">
              <p className="font-display text-xl text-ink">No matching answers</p>
              <p className="mx-auto mt-2 max-w-md text-[14px] text-taupe">
                Can't find what you need? Call us at{" "}
                <a href="tel:+8801815115297" className="font-semibold text-bordeaux">
                  01815-115297
                </a>{" "}
                or message us on the{" "}
                <Link href="/contact" className="font-semibold text-bordeaux underline underline-offset-4">
                  contact page
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="border-t border-sand">
              {results.map((item, i) => (
                <Accordion key={i} title={<span>{item.q} <span className="ml-2 text-[11px] font-sans font-semibold uppercase tracking-[0.14em] text-champagne">{item.cat}</span></span>}>
                  {item.a}
                </Accordion>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-10 py-12 lg:grid-cols-[240px_1fr]">
          <nav className="flex gap-2 overflow-x-auto lg:sticky lg:top-36 lg:flex-col" aria-label="FAQ categories">
            {FAQS.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => setActive(c.slug)}
                aria-current={active === c.slug ? "page" : undefined}
                className={cn(
                  "shrink-0 border px-5 py-3 text-left text-[13px] font-semibold tracking-wide transition-all",
                  active === c.slug
                    ? "border-bordeaux bg-bordeaux text-ivory"
                    : "border-sand bg-white text-espresso hover:border-ink"
                )}
              >
                {c.title}
                <span className={cn("ml-2 text-[11px]", active === c.slug ? "text-ivory/70" : "text-stone")}>
                  {c.items.length}
                </span>
              </button>
            ))}
          </nav>

          <div>
            <h2 className="font-display text-2xl font-medium text-ink">{category.title}</h2>
            <div className="mt-5 border-t border-sand">
              {category.items.map((item, i) => (
                <Accordion key={i} title={item.q} defaultOpen={i === 0}>
                  {item.a}
                </Accordion>
              ))}
            </div>
            <div className="mt-10 border border-sand bg-fog p-7 text-center">
              <p className="font-display text-xl font-medium text-ink">Still curious?</p>
              <p className="mt-2 text-[14px] text-taupe">
                Call <a href="tel:+8801815115297" className="font-semibold text-bordeaux">01815-115297</a> or drop by
                the shop on Jubilee Road.
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-block border border-ink px-7 py-3 text-[11.5px] font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ink hover:text-ivory"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
