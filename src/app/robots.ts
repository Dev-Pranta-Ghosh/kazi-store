import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/checkout", "/cart", "/account", "/search", "/order-confirmation"],
      },
    ],
    sitemap: "https://www.kazistore.com.bd/sitemap.xml",
  };
}
