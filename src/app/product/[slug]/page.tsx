import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS, getCategoryBySlug, getProductBySlug } from "@/data/products";
import { ProductDetail } from "@/components/product/ProductDetail";
import { Breadcrumbs } from "@/components/ui";
import { formatBDT } from "@/lib/utils";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} — ${product.brand}`,
    description: product.description.slice(0, 158),
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} | Kazi Store`,
      description: product.description.slice(0, 158),
      images: [product.images[0]],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const cat = getCategoryBySlug(product.category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: { "@type": "Brand", name: product.brand },
    image: product.images,
    description: product.description,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "BDT",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Kazi Store" },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-[1440px] px-4 pt-6 sm:px-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            ...(cat ? [{ label: cat.name, href: `/category/${cat.slug}` }] : []),
            { label: product.name },
          ]}
        />
      </div>
      <ProductDetail product={product} />
      <p className="sr-only">{formatBDT(product.price)} — available at Kazi Store Chattogram with nationwide delivery.</p>
    </>
  );
}
