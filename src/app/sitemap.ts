import type { MetadataRoute } from "next";
import { CATEGORIES, PRODUCTS } from "@/data/products";

const BASE = "https://www.kazistore.com.bd";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/shop",
    "/about",
    "/contact",
    "/faq",
    "/wishlist",
    "/cart",
    "/policies/delivery",
    "/policies/returns",
    "/policies/privacy",
    "/policies/terms",
  ].map((path) => ({ url: `${BASE}${path}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.7 }));

  const categoryPages = CATEGORIES.map((c) => ({
    url: `${BASE}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const productPages = PRODUCTS.map((p) => ({
    url: `${BASE}/product/${p.slug}`,
    lastModified: new Date(p.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
