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

  return [
    {
      url: siteConfig.url,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    ...routes.map((path) => ({
      url: `${siteConfig.url}${path}`,
      lastModified,
      changeFrequency: path.startsWith("/blog") ? "weekly" : "monthly",
      priority: path === "/services/domestic-abuse" ? 0.9 : 0.7,
    })),
  ];
}

