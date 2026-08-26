"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Droplets,
  Globe,
  Leaf,
  MapPin,
  ShieldCheck,
  Sparkles,
  Sun,
  Truck,
  Wallet,
} from "lucide-react";
import { BRANDS, CATEGORIES, PRODUCTS } from "@/data/products";
import { GALLERY_IMAGES, ROUTINES, TESTIMONIALS } from "@/data/content";
import { cn } from "@/lib/utils";
import { ProductGrid, ProductRail } from "@/components/product/ProductGrid";
import { btnPrimary, btnSecondary, Rating, Reveal, SectionHeading } from "@/components/ui";

const bestSellers = PRODUCTS.filter((p) => p.isBestSeller);
const newArrivals = [...PRODUCTS].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 4);
const featuredBrands = BRANDS.slice(0, 10) as string[];

const HERO_MAIN_IMAGE =
  "https://images.pexels.com/photos/4210370/pexels-photo-4210370.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1040&h=1300";

const CAMPAIGN_RITUAL_IMAGE =
  "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1800&h=1100";

const MARQUEE_ITEMS = [
  "Free delivery over ৳2,500",
  "Cash on Delivery",
  "bKash · Nagad · Cards",
  "In-store at Jubilee Road, Chattogram",
  "Nationwide delivery",
  "New K-beauty arrivals weekly",
];

const CONCERNS = [
  { name: "Acne Care", icon: Sparkles, href: "/shop?concern=Acne Care" },
  { name: "Hydration", icon: Droplets, href: "/shop?concern=Hydration" },
  { name: "Brightening", icon: Sun, href: "/shop?concern=Brightening" },
  { name: "Sensitive Skin", icon: Leaf, href: "/shop?concern=Sensitive Skin" },
  { name: "Sun Protection", icon: ShieldCheck, href: "/shop?concern=Sun Protection" },
  { name: "Anti-Aging", icon: Clock3, href: "/shop?concern=Anti-Aging" },
];

export function HomeView() {
  return (
    <>
      <Hero />
      <MarqueeBand />
      <CategoriesSection />
      <BestSellersSection />
      <CampaignBanner />
      <NewArrivalsSection />
      <BrandsSection />
      <ConcernsSection />
      <RoutinesSection />
      <PromoSection />
      <TestimonialsSection />
      <GallerySection />
    </>
  );
}

/* ——————————————— HERO ——————————————— */
function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-sand bg-cream">
      {/* giant ghost word */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 left-1/2 w-full -translate-x-1/2 select-none text-center font-display text-[24vw] leading-none font-semibold tracking-tight text-ink/[0.035] lg:text-[19rem]"
      >
        BEAUTY
      </div>
      <div className="relative mx-auto grid max-w-[1440px] items-center gap-10 px-4 py-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:py-24">
        <div>
          <Reveal>
            <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-bordeaux">
              <span className="h-px w-10 bg-bordeaux" aria-hidden />
              Chattogram · Since you asked for better beauty
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="mt-6 font-display text-[2.9rem] leading-[1.04] font-medium tracking-[-0.01em] text-ink sm:text-6xl lg:text-[4.6rem]">
              Where beauty
              <br />
              becomes <em className="text-gilded not-italic">ritual</em>
              <span className="text-bordeaux">.</span>
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-6 max-w-md text-[16.5px] leading-relaxed text-espresso/90 lg:text-[17.5px]">
              Skincare, makeup and fragrance curated with intention — from K-beauty icons to everyday essentials.
              Shop in-store on Jubilee Road or have it delivered anywhere in Bangladesh.
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/shop" className={btnPrimary}>
                Shop the Collection
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/category/korean-beauty" className={btnSecondary}>
                Explore K-Beauty
              </Link>
            </div>
          </Reveal>
          <Reveal delay={480}>
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4">
              {[
                { icon: Truck, label: "Nationwide delivery" },
                { icon: Wallet, label: "COD · bKash · Nagad" },
                { icon: MapPin, label: "Jubilee Road store" },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-2.5 text-[12.5px] font-semibold tracking-wide text-espresso">
                  <Icon className="h-4 w-4 text-champagne" aria-hidden />
                  {label}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={200} className="relative">
          <div className="relative mx-auto max-w-[520px]">
            <div className="absolute -inset-4 border border-champagne/50 sm:-inset-6" aria-hidden />
            <div className="relative aspect-[4/5] overflow-hidden shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={HERO_MAIN_IMAGE}
                alt="Editorial beauty campaign — amber serum bottle on travertine stone"
                className="h-full w-full object-cover"
                fetchPriority="high"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(248,243,235,0.22)_0%,rgba(120,39,56,0.12)_100%)]"
              />
            </div>
            {/* floating card */}
            <div className="absolute -bottom-6 -left-4 hidden max-w-[240px] border border-sand bg-ivory p-5 shadow-card sm:block lg:-left-14">
              <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-champagne">This week's edit</p>
              <p className="mt-2 font-display text-[17px] leading-snug font-medium text-ink">
                The Glass-Skin Starter
              </p>
              <Link
                href="/category/korean-beauty"
                className="mt-3 inline-flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-[0.14em] text-bordeaux hover:gap-2.5 transition-all"
              >
                Shop the edit <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
            {/* rotate badge */}
            <div className="absolute -top-9 right-4 hidden h-28 w-28 items-center justify-center rounded-full bg-bordeaux text-ivory lg:flex">
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-[spin_18s_linear_infinite]" aria-hidden>
                <defs>
                  <path id="circ" d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" />
                </defs>
                <text className="fill-ivory text-[9.5px] font-semibold uppercase tracking-[0.24em]">
                  <textPath href="#circ">Kazi Store · কাজী স্টোর · est. Chattogram ·</textPath>
                </text>
              </svg>
              <Globe className="h-6 w-6 text-champagne-light" aria-hidden />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ——————————————— MARQUEE ——————————————— */
function MarqueeBand() {
  const row = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="overflow-hidden border-b border-sand bg-ivory py-4" aria-hidden>
      <div className="animate-marquee flex w-max items-center gap-10">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-10 text-[11.5px] font-bold uppercase tracking-[0.22em] text-taupe">
            {item}
            <span className="h-1 w-1 rounded-full bg-champagne" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ——————————————— CATEGORIES ——————————————— */
function CategoriesSection() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8 lg:py-28">
      <Reveal>
        <SectionHeading eyebrow="Curated Departments" title="Shop by Category" link="/shop" linkLabel="Shop everything" />
      </Reveal>
      <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {CATEGORIES.map((cat, i) => (
          <Reveal key={cat.slug} delay={(i % 4) * 90} className={cn(i % 4 === 1 || i % 4 === 2 ? "lg:translate-y-8" : "")}>
            <Link href={`/category/${cat.slug}`} className="group relative block overflow-hidden">
              <div className="aspect-[3/4] overflow-hidden bg-cream">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-5">
                <div>
                  <h3 className="font-display text-xl font-medium text-ivory">{cat.name}</h3>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-ivory/70">
                    {PRODUCTS.filter((p) => p.category === cat.slug).length} products
                  </p>
                </div>
                <span className="flex h-10 w-10 shrink-0 translate-y-2 items-center justify-center rounded-full bg-ivory text-ink opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ——————————————— BEST SELLERS ——————————————— */
function BestSellersSection() {
  return (
    <section className="border-y border-sand bg-fog">
      <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8 lg:py-28">
        <Reveal>
          <SectionHeading
            align="left"
            eyebrow="Most Loved"
            title="Icons our customers keep re-ordering"
            link="/shop?sort=popular"
          />
        </Reveal>
        <div className="mt-14">
          <ProductRail products={bestSellers} />
        </div>
      </div>
    </section>
  );
}

/* ——————————————— CAMPAIGN ——————————————— */
function CampaignBanner() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[480px] lg:min-h-[560px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={CAMPAIGN_RITUAL_IMAGE}
          alt="Editorial skincare campaign — woman applying cream in soft light"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/35 to-transparent" aria-hidden />
        <div className="relative mx-auto flex min-h-[480px] max-w-[1440px] items-center px-4 py-16 sm:px-8 lg:min-h-[560px]">
          <div className="max-w-xl">
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-champagne-light">The Ritual Edit</p>
            </Reveal>
            <Reveal delay={140}>
              <h2 className="mt-5 font-display text-4xl leading-[1.08] font-medium text-ivory sm:text-5xl lg:text-[3.6rem]">
                Your everyday ritual, elevated.
              </h2>
            </Reveal>
            <Reveal delay={280}>
              <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ivory/80">
                Five quiet minutes. Honest formulations. Skin that feels like yours again — only better. Discover the
                routines worth slowing down for.
              </p>
            </Reveal>
            <Reveal delay={420}>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  href="/category/skincare"
                  className="inline-flex items-center gap-2 bg-ivory px-8 py-4 text-[12px] font-bold uppercase tracking-[0.16em] text-ink transition-all hover:bg-champagne-light"
                >
                  Shop Skincare <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 border border-ivory/50 px-8 py-4 text-[12px] font-bold uppercase tracking-[0.16em] text-ivory transition-all hover:border-ivory hover:bg-ivory/10"
                >
                  Our Story
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ——————————————— NEW ARRIVALS ——————————————— */
function NewArrivalsSection() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8 lg:py-28">
      <Reveal>
        <SectionHeading
          align="left"
          eyebrow="Just Landed"
          title="New arrivals, fresh from the shelf"
          link="/shop?sort=newest"
          linkLabel="See all new"
        />
      </Reveal>
      <div className="mt-14">
        <ProductGrid products={newArrivals} />
      </div>
    </section>
  );
}

/* ——————————————— BRANDS ——————————————— */
function BrandsSection() {
  return (
    <section className="border-y border-sand bg-cream">
      <div className="mx-auto max-w-[1440px] px-4 py-20 text-center sm:px-8 lg:py-24">
        <Reveal>
          <SectionHeading eyebrow="Label Library" title="Shop by Brand" />
        </Reveal>
        <Reveal delay={160}>
          <div className="mx-auto mt-12 flex max-w-4xl flex-wrap items-center justify-center gap-3">
            {featuredBrands.map((brand) => (
              <Link
                key={brand as string}
                href={`/shop?brand=${encodeURIComponent(brand as string)}`}
                className="group border border-ink/15 px-6 py-3.5 transition-all duration-300 hover:border-bordeaux hover:bg-bordeaux"
              >
                <span className="font-display text-[17px] font-medium tracking-wide text-ink transition-colors group-hover:text-ivory">
                  {brand as string}
                </span>
              </Link>
            ))}
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-4 py-3 text-[12px] font-bold uppercase tracking-[0.16em] text-bordeaux hover:underline underline-offset-4"
            >
              View all <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </Reveal>
        <Reveal delay={240}>
          <p className="mx-auto mt-10 max-w-lg text-[13px] leading-relaxed text-taupe">
            Brand lineup shown is demo data — replace with Kazi Store's real stocked brands and, once confirmed,
            official partnership badges.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ——————————————— CONCERNS ——————————————— */
function ConcernsSection() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8 lg:py-28">
      <Reveal>
        <SectionHeading eyebrow="Skin Goals" title="Shop by beauty concern" />
      </Reveal>
      <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
        {CONCERNS.map(({ name, icon: Icon, href }, i) => (
          <Reveal key={name} delay={(i % 3) * 100}>
            <Link
              href={href}
              className="group flex h-full flex-col items-start gap-10 border border-sand bg-fog p-6 transition-all duration-300 hover:border-bordeaux hover:bg-bordeaux sm:p-8"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-champagne/50 text-champagne transition-colors group-hover:border-ivory/40 group-hover:text-champagne-light">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span>
                <span className="font-display text-[21px] font-medium text-ink transition-colors group-hover:text-ivory">
                  {name}
                </span>
                <span className="mt-2 flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.16em] text-taupe transition-colors group-hover:text-champagne-light">
                  Shop solutions
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ——————————————— ROUTINES ——————————————— */
function RoutinesSection() {
  return (
    <section className="border-t border-sand bg-fog">
      <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8 lg:py-28">
        <Reveal>
          <SectionHeading eyebrow="The Ritual Library" title="Routines worth slowing down for" />
        </Reveal>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {ROUTINES.map((routine, i) => (
            <Reveal key={routine.slug} delay={i * 120}>
              <article className="group flex h-full flex-col border border-sand bg-ivory p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card lg:p-10">
                <div className="flex items-center justify-between">
                  <span className="font-display text-[2.4rem] leading-none font-light text-champagne/80">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-bordeaux">{routine.tagline}</span>
                </div>
                <h3 className="mt-6 font-display text-2xl font-medium text-ink">{routine.title}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-espresso/85">{routine.blurb}</p>
                <ol className="mt-7 flex-1 space-y-0">
                  {routine.steps.map((step, j) => (
                    <li key={step} className="flex items-center gap-4 border-t border-sand/70 py-3 text-[13.5px] font-medium text-espresso">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cream text-[10.5px] font-bold text-bordeaux">
                        {j + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
                <Link
                  href={`/search?q=${encodeURIComponent(routine.steps[0])}`}
                  className="mt-8 inline-flex items-center gap-2 border-b border-ink pb-1 text-[12px] font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:border-bordeaux hover:text-bordeaux"
                >
                  Build this ritual <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ——————————————— PROMO + WORKING COUNTDOWN ——————————————— */
function PromoSection() {
  const [left, setLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    const KEY = "kazi_promo_end_v1";
    let end = Number(window.localStorage.getItem(KEY) || 0);
    if (!end || end < Date.now() + 60000) {
      end = Date.now() + 72 * 3600 * 1000;
      window.localStorage.setItem(KEY, String(end));
    }
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      setLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const cells = left
    ? [
        { v: left.d, l: "Days" },
        { v: left.h, l: "Hours" },
        { v: left.m, l: "Mins" },
        { v: left.s, l: "Secs" },
      ]
    : [];

  return (
    <section className="relative overflow-hidden bg-bordeaux-deep text-ivory">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/2 h-[540px] w-[540px] -translate-y-1/2 rounded-full border-[60px] border-bordeaux/60"
      />
      <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 px-4 py-20 sm:px-8 lg:grid-cols-2 lg:py-28">
        <div>
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-champagne-light">The Weekend Soirée</p>
            <h2 className="mt-4 font-display text-4xl leading-[1.1] font-medium sm:text-5xl">
              Up to 25% off the Glow Edit.
            </h2>
            <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-ivory/75">
              Serums, essences and sunscreens from our most-loved shelves — for three days only. Use code{" "}
              <span className="font-bold text-champagne-light">KAZI15</span> at checkout for an extra treat.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-10 flex gap-3 sm:gap-4" role="timer" aria-label="Offer countdown">
              {cells.map((c) => (
                <div key={c.l} className="flex w-[74px] flex-col items-center border border-ivory/25 bg-ivory/5 py-4 sm:w-[88px] sm:py-5">
                  <span className="font-display text-3xl font-semibold tabular-nums sm:text-4xl">
                    {String(c.v).padStart(2, "0")}
                  </span>
                  <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-ivory/60">{c.l}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={340}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/shop?sort=popular"
                className="inline-flex items-center gap-2 bg-ivory px-8 py-4 text-[12px] font-bold uppercase tracking-[0.16em] text-bordeaux transition-all hover:bg-champagne-light"
              >
                Shop the Sale <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/category/skincare"
                className="inline-flex items-center gap-2 border border-ivory/40 px-8 py-4 text-[12px] font-bold uppercase tracking-[0.16em] text-ivory transition-all hover:border-ivory hover:bg-ivory/10"
              >
                Browse Skincare
              </Link>
            </div>
          </Reveal>
        </div>
        <Reveal delay={200} className="hidden lg:block">
          <div className="relative ml-auto max-w-[440px]">
            <div className="absolute -inset-4 border border-champagne/40" aria-hidden />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.pexels.com/photos/7691162/pexels-photo-7691162.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=720&h=880"
              alt="Minimal skincare arrangement"
              loading="lazy"
              className="relative aspect-[4/5] w-full object-cover shadow-soft"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ——————————————— TESTIMONIALS ——————————————— */
function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8 lg:py-28">
      <Reveal>
        <SectionHeading eyebrow="Kind Words" title="Loved across Chattogram & beyond" />
      </Reveal>
      <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.id} delay={(i % 4) * 100}>
            <figure className="flex h-full flex-col border border-sand bg-fog p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
              <Rating value={t.rating} showCount={false} />
              <blockquote className="mt-5 flex-1 font-display text-[16.5px] leading-relaxed font-normal text-espresso">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 border-t border-sand pt-4">
                <p className="text-[14px] font-semibold text-ink">{t.name}</p>
                <p className="text-[12px] tracking-wide text-taupe">{t.location}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
      <Reveal delay={120}>
        <p className="mt-8 text-center text-[12.5px] italic text-stone">
          Sample reviews shown for demonstration — ready to be replaced with verified customer reviews.
        </p>
      </Reveal>
    </section>
  );
}

/* ——————————————— INSPIRATION GALLERY ——————————————— */
function GallerySection() {
  return (
    <section className="border-t border-sand bg-fog">
      <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8 lg:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="Beauty Inspiration"
            title="From the ritual journal"
            link="/shop"
            linkLabel="Get inspired"
          />
        </Reveal>
        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
          {GALLERY_IMAGES.map((g, i) => (
            <Reveal key={g.src} delay={(i % 6) * 70} className={cn(i % 2 === 1 ? "lg:translate-y-6" : "")}>
              <figure className="group relative aspect-[3/4] overflow-hidden bg-cream">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.src}
                  alt={g.caption}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
                />
                <figcaption className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/70 to-transparent p-4 opacity-0 transition-opacity duration-400 group-hover:opacity-100">
                  <span className="text-[12.5px] font-medium leading-snug text-ivory">{g.caption}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <p className="mt-10 text-center text-[12px] font-semibold uppercase tracking-[0.26em] text-champagne">
            Tag <span className="text-bordeaux">@kazistore</span> to be featured — social handle placeholder
          </p>
        </Reveal>
      </div>
    </section>
  );
}
