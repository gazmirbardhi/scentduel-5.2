import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";
import { categories } from "@/lib/categories";

export const dynamic = "force-static";

/**
 * RSS 2.0 feed at /feed.xml.
 *
 * With Next.js App Router, a Route Handler that reads only build-time data and
 * exports `dynamic = "force-static"` is compatible with `output: 'export'`.
 * This handler reads from getAllPosts() (which reads the filesystem at build
 * time) and never uses the request object, so it exports cleanly.
 */
export function GET() {
  const posts = getAllPosts();
  const siteUrl = siteConfig.url;

  const items = posts
    .map((post) => {
      const url = `${siteUrl}/blog/${post.slug}`;
      const pubDate = new Date(post.publishDate).toUTCString();
      // Escape XML special characters in text fields.
      const esc = (s: string) =>
        s
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&apos;");
      return `    <item>
      <title>${esc(post.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${esc(post.excerpt)}</description>
      <category>${esc(post.category)}</category>
    </item>`;
    })
    .join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name}</title>
    <link>${siteUrl}</link>
    <description>${siteConfig.description}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
