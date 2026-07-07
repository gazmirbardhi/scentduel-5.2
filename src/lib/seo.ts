import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { categories } from "@/lib/categories";
import { getAllPosts } from "@/lib/posts";
import { notes } from "@/lib/notesData";
import { brands } from "@/lib/brandsData";
import { perfumers } from "@/lib/perfumersData";

/** Helper to build absolute URLs from root-relative paths. */
export function abs(path: string): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

interface BuildMetadataArgs {
  title: string;
  description: string;
  path: string;
  /** OG image — root-relative path. Falls back to the site default. */
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  canonical?: string;
  noIndex?: boolean;
}

/**
 * Single helper that produces a complete Metadata object with canonical,
 * OG, and Twitter Card tags. Every page should use this so the tag set is
 * consistent.
 */
export function buildMetadata({
  title,
  description,
  path,
  image = "/images/og/default.svg",
  type = "website",
  publishedTime,
  modifiedTime,
  canonical,
  noIndex = false,
}: BuildMetadataArgs): Metadata {
  const url = abs(path);
  const canonicalUrl = canonical ?? url;
  const ogImage = image.startsWith("http") ? image : abs(image);
  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      types: { "application/rss+xml": abs("/feed.xml") },
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: siteConfig.twitterHandle,
    },
  };
}

/**
 * Sitemap entries for every indexable route. Drafts, /404, and utility
 * routes are excluded.
 */
export interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency: "daily" | "weekly" | "monthly";
  priority: number;
}

export function getAllSitemapEntries(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];

  // Static pages
  const staticPages: { path: string; freq: SitemapEntry["changeFrequency"]; priority: number }[] = [
    { path: "/", freq: "daily", priority: 1.0 },
    { path: "/blog", freq: "daily", priority: 0.9 },
    { path: "/tools", freq: "monthly", priority: 0.8 },
    { path: "/notes", freq: "weekly", priority: 0.8 },
    { path: "/brands", freq: "weekly", priority: 0.8 },
    { path: "/perfumers", freq: "weekly", priority: 0.8 },
    { path: "/about", freq: "monthly", priority: 0.5 },
    { path: "/author", freq: "monthly", priority: 0.5 },
    { path: "/contact", freq: "monthly", priority: 0.4 },
    { path: "/disclaimer", freq: "monthly", priority: 0.3 },
    { path: "/privacy", freq: "monthly", priority: 0.3 },
  ];
  for (const p of staticPages) {
    entries.push({
      url: abs(p.path),
      lastModified: new Date().toISOString(),
      changeFrequency: p.freq,
      priority: p.priority,
    });
  }

  // Tool pages
  const toolPages = [
    "/tools/scent-dueler",
    "/tools/scent-matcher",
    "/tools/spray-calculator",
    "/tools/blind-buy-risk",
    "/tools/name-that-note",
    "/tools/fragrance-quiz",
    "/tools/batch-checker",
  ];
  for (const t of toolPages) {
    entries.push({
      url: abs(t),
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Categories
  for (const c of categories) {
    entries.push({
      url: abs(`/categories/${c.slug}`),
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  // Posts (excluding drafts — getAllPosts already filters them)
  for (const post of getAllPosts()) {
    entries.push({
      url: abs(`/blog/${post.slug}`),
      lastModified: (post.updatedDate ?? post.publishDate) as string,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // Notes
  for (const n of notes) {
    entries.push({
      url: abs(`/notes/${n.slug}`),
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  // Brands
  for (const b of brands) {
    entries.push({
      url: abs(`/brands/${b.slug}`),
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  // Perfumers
  for (const p of perfumers) {
    entries.push({
      url: abs(`/perfumers/${p.slug}`),
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}

/**
 * JSON-LD BreadcrumbList. Pass an array of {name, url} segments.
 */
export function buildBreadcrumbJsonLd(
  segments: { name: string; url: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: segments.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      item: abs(s.url),
    })),
  };
}

/** JSON-LD WebSite block for the root layout. */
export function buildWebsiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
