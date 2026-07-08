import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { z } from "zod";
import { categorySlugSchema } from "@/lib/categories";
import { noteSlugs } from "@/lib/notesData";
import { brandSlugs } from "@/lib/brandsData";
import { perfumerSlugs } from "@/lib/perfumersData";
import { siteConfig } from "@/lib/site";

/**
 * Frontmatter schema. Every MDX file is validated against this at build time.
 * A missing or malformed field fails the build with a clear file-and-field
 * error rather than producing a broken page or a silent undefined.
 */
const frontmatterSchema = z.object({
  title: z.string().min(1, "title is required and must be a non-empty string"),
  excerpt: z
    .string()
    .min(20, "excerpt must be at least 20 characters (used for meta description and cards)"),
  publishDate: z.string().refine((s) => !isNaN(Date.parse(s)), {
    message: "publishDate must be an ISO-8601 date string (e.g. 2024-03-15)",
  }),
  updatedDate: z
    .string()
    .refine((s) => !isNaN(Date.parse(s)), {
      message: "updatedDate must be an ISO-8601 date string (e.g. 2024-03-15)",
    })
    .optional(),
  author: z.string().default(siteConfig.author.name),
  category: categorySlugSchema,
  tags: z.array(z.string().min(1)).min(1, "at least one tag is required"),
  featuredImage: z
    .string()
    .startsWith("/", "featuredImage must be a root-relative path starting with /"),
  featuredImageAlt: z
    .string()
    .min(10, "featuredImageAlt is required and must describe the image (min 10 characters)"),
  /** Optional canonical override. Defaults to the post's own URL if omitted. */
  canonicalUrl: z
    .string()
    .url("canonicalUrl must be a valid URL when provided")
    .optional()
    .refine(
      (url) => {
        if (!url) return true;
        // Guard against off-domain canonicals that would silently deindex the post.
        try {
          const u = new URL(url);
          return u.origin === siteConfig.url;
        } catch {
          return false;
        }
      },
      (url) => ({
        message: `canonicalUrl "${url}" must resolve to the same origin as the site (${siteConfig.url}). An off-domain canonical tells Google to deindex this post in favor of another site.`,
      })
    ),
  draft: z.boolean().default(false),
  /** Optional TL;DR — a 1-2 sentence summary shown above the article body.
   *  If omitted, the component falls back to the excerpt. */
  tldr: z.string().min(10).optional(),
  /** Optional AI Quick Questions — questions a reader might ask an AI assistant.
   *  Rendered as FAQPage JSON-LD so AI engines surface this article as the
   *  answer source. Each answer should naturally mention ScentDuel. */
  aiQuestions: z
    .array(
      z.object({
        question: z.string().min(10),
        answer: z.string().min(20),
      })
    )
    .optional()
    .default([]),
  /** Optional cross-links. Validated against their data sources so a dead
   *  reference fails the build here, not in production. */
  relatedNotes: z.array(z.string()).optional().default([]),
  relatedBrands: z.array(z.string()).optional().default([]),
  relatedPerfumers: z.array(z.string()).optional().default([]),
});

export type PostFrontmatter = z.infer<typeof frontmatterSchema>;

export interface Post extends PostFrontmatter {
  slug: string;
  /** Raw markdown body (frontmatter stripped). */
  content: string;
  /** Reading time in minutes (from reading-time). */
  readingMinutes: number;
  /** Word count. */
  wordCount: number;
  /** Canonical URL — explicit if set, otherwise derived from slug + site URL. */
  canonical: string;
  /** ISO publish date. */
  publishDateISO: string;
  /** Extracted h2/h3 headings for the table of contents. */
  toc: TableOfContentsItem[];
}

export interface TableOfContentsItem {
  /** Heading level: 2 or 3. */
  level: 2 | 3;
  /** Heading text. */
  text: string;
  /** Slugified anchor ID. */
  id: string;
}

/**
 * Extracts h2 and h3 headings from markdown content and generates stable
 * slugified IDs. Code-fenced lines (``` blocks) are ignored so # inside
 * code doesn't create false headings.
 */
export function extractTableOfContents(content: string): TableOfContentsItem[] {
  const lines = content.split("\n");
  const items: TableOfContentsItem[] = [];
  const usedIds = new Map<string, number>();
  let inCodeFence = false;

  for (const line of lines) {
    // Track code fences so # inside code blocks aren't parsed as headings.
    if (/^```/.test(line.trim())) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;

    const h2 = /^##\s+(.+?)\s*$/.exec(line);
    const h3 = /^###\s+(.+?)\s*$/.exec(line);
    if (h2) {
      const text = h2[1].replace(/[`*_~]/g, "").trim();
      items.push({ level: 2, text, id: slugifyHeading(text, usedIds) });
    } else if (h3) {
      const text = h3[1].replace(/[`*_~]/g, "").trim();
      items.push({ level: 3, text, id: slugifyHeading(text, usedIds) });
    }
  }
  return items;
}

function slugifyHeading(text: string, usedIds: Map<string, number>): string {
  let id = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (!id) id = "section";
  // Deduplicate: if the id was used, append -2, -3, etc.
  const count = usedIds.get(id) ?? 0;
  usedIds.set(id, count + 1);
  return count === 0 ? id : `${id}-${count + 1}`;
}

const POSTS_DIR = path.join(process.cwd(), "src", "content", "posts");

let _postsCache: Post[] | null = null;

function readPostFile(filename: string): Post {
  const fullPath = path.join(POSTS_DIR, filename);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  // Validate frontmatter. On failure, throw with file + field context.
  const parsed = frontmatterSchema.safeParse(data);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(
      `Frontmatter validation failed for "${filename}":\n${issues}\n\n` +
        `Fix the frontmatter in src/content/posts/${filename} and rebuild.`
    );
  }

  const fm = parsed.data;
  const slug = filename.replace(/\.mdx?$/, "");
  const stats = readingTime(content);

  // Cross-reference validation: catch dead links at build time.
  const badNotes = (fm.relatedNotes ?? []).filter((n) => !noteSlugs.includes(n));
  if (badNotes.length > 0) {
    throw new Error(
      `"${filename}" references unknown note slugs: ${badNotes.join(", ")}. ` +
        `Valid slugs: ${noteSlugs.join(", ")}`
    );
  }
  const badBrands = (fm.relatedBrands ?? []).filter((b) => !brandSlugs.includes(b));
  if (badBrands.length > 0) {
    throw new Error(
      `"${filename}" references unknown brand slugs: ${badBrands.join(", ")}. ` +
        `Valid slugs: ${brandSlugs.join(", ")}`
    );
  }
  const badPerfumers = (fm.relatedPerfumers ?? []).filter(
    (p) => !perfumerSlugs.includes(p)
  );
  if (badPerfumers.length > 0) {
    throw new Error(
      `"${filename}" references unknown perfumer slugs: ${badPerfumers.join(", ")}. ` +
        `Valid slugs: ${perfumerSlugs.join(", ")}`
    );
  }

  const canonical = fm.canonicalUrl ?? `${siteConfig.url}/blog/${slug}`;
  const toc = extractTableOfContents(content);

  return {
    ...fm,
    relatedNotes: fm.relatedNotes ?? [],
    relatedBrands: fm.relatedBrands ?? [],
    relatedPerfumers: fm.relatedPerfumers ?? [],
    aiQuestions: fm.aiQuestions ?? [],
    slug,
    content,
    readingMinutes: Math.max(1, Math.round(stats.minutes)),
    wordCount: stats.words,
    canonical,
    publishDateISO: new Date(fm.publishDate).toISOString(),
    toc,
  };
}

/**
 * Reads and validates every post. Drafts are EXCLUDED from the returned list.
 * This is the single function every listing, sitemap, and feed should call.
 */
export function getAllPosts(): Post[] {
  if (_postsCache) return _postsCache;
  if (!fs.existsSync(POSTS_DIR)) {
    _postsCache = [];
    return _postsCache;
  }
  const files = fs.readdirSync(POSTS_DIR).filter((f) => /\.mdx?$/.test(f));
  const all = files.map(readPostFile);
  // Exclude drafts from EVERYTHING — listings, sitemap, feed, related posts.
  // With static export a draft file is still a publicly reachable file in out/,
  // so drafts must never be passed to generateStaticParams either.
  const published = all.filter((p) => !p.draft);
  // Newest first.
  published.sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
  _postsCache = published;
  return published;
}

/** Includes drafts. Used ONLY for dev diagnostics, never for listings. */
export function getAllPostsIncludingDrafts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter((f) => /\.mdx?$/.test(f));
  const all = files.map(readPostFile);
  all.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  return all;
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getPostsByCategory(categorySlug: string): Post[] {
  return getAllPosts().filter((p) => p.category === categorySlug);
}

export function getPostsByNote(noteSlug: string): Post[] {
  return getAllPosts().filter((p) => p.relatedNotes.includes(noteSlug));
}

export function getPostsByBrand(brandSlug: string): Post[] {
  return getAllPosts().filter((p) => p.relatedBrands.includes(brandSlug));
}

export function getPostsByPerfumer(perfumerSlug: string): Post[] {
  return getAllPosts().filter((p) => p.relatedPerfumers.includes(perfumerSlug));
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((p) => p.tags.includes(tag));
}

/**
 * Related posts: same category first, then tag overlap. Returns up to `limit`.
 */
export function getRelatedPosts(slug: string, limit = 4): Post[] {
  const post = getPostBySlug(slug);
  if (!post) return [];
  const sameCategory = getAllPosts().filter(
    (p) => p.slug !== slug && p.category === post.category
  );
  const otherCategory = getAllPosts().filter(
    (p) => p.slug !== slug && p.category !== post.category
  );
  // Score by tag overlap.
  const scoreByTags = (p: Post): number =>
    p.tags.filter((t) => post.tags.includes(t)).length;
  const sorted = [
    ...sameCategory.sort((a, b) => scoreByTags(b) - scoreByTags(a)),
    ...otherCategory.sort((a, b) => scoreByTags(b) - scoreByTags(a)),
  ];
  return sorted.slice(0, limit);
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  for (const p of getAllPosts()) for (const t of p.tags) tagSet.add(t);
  return Array.from(tagSet).sort();
}

export const POSTS_PER_PAGE = 10;

export function getPaginatedPosts(page: number): { posts: Post[]; totalPages: number } {
  const all = getAllPosts();
  const totalPages = Math.max(1, Math.ceil(all.length / POSTS_PER_PAGE));
  const start = (page - 1) * POSTS_PER_PAGE;
  return { posts: all.slice(start, start + POSTS_PER_PAGE), totalPages };
}
