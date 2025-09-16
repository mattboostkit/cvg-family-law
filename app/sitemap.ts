import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";

const routes = [
  "/about",
  "/services",
  "/services/domestic-abuse",
  "/services/children-law",
  "/services/divorce",
  "/services/financial",
  "/resources",
  "/faq",
  "/blog",
  "/contact",
  "/privacy",
  "/legal",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const entries = routes.map((path) => {
    const changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]> =
      path.startsWith("/blog") ? "weekly" : "monthly";

    return {
      url: `${siteConfig.url}${path}`,
      lastModified,
      changeFrequency,
      priority: path === "/services/domestic-abuse" ? 0.9 : 0.7,
    } satisfies MetadataRoute.Sitemap[number];
  });

  return [
    {
      url: siteConfig.url,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    } satisfies MetadataRoute.Sitemap[number],
    ...entries,
  ];
}
