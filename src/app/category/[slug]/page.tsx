import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategoryBySlug } from "@/data/products";
import { ShopView } from "@/components/shop/ShopView";
import { Breadcrumbs, Reveal } from "@/components/ui";

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return {};
  return {
    title: `${cat.name} — ${cat.tagline}`,
    description: cat.description,
    alternates: { canonical: `/category/${cat.slug}` },
    openGraph: { title: `${cat.name} | Kazi Store`, description: cat.description, images: [cat.image] },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) notFound();

  return (
    <>
      <section className="relative overflow-hidden border-b border-sand">
        <div className="absolute inset-0" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cat.image} alt="" className="h-full w-full object-cover opacity-[0.16]" />
          <div className="absolute inset-0 bg-gradient-to-r from-ivory via-ivory/85 to-ivory/40" />
        </div>
        <div className="relative mx-auto max-w-[1440px] px-4 py-14 sm:px-8 lg:py-20">
          <Reveal>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Shop", href: "/shop" },
                { label: cat.name },
              ]}
            />
            <h1 className="mt-5 font-display text-4xl font-medium text-ink sm:text-5xl lg:text-6xl">{cat.name}</h1>
            <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.26em] text-champagne">{cat.tagline}</p>
            <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed text-espresso/90">{cat.description}</p>
          </Reveal>
        </div>
      </section>
      <div className="pt-10">
        <ShopView fixedCategory={cat.slug} heading={cat.name} />
      </div>
    </>
  );
}
